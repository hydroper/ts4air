import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2SwfError} from 'ts4air/ts2swf/errors';
import {AbcFile} from 'ts4air/abc/abcFile';
import Ts2SwfState from './state';
import Project from './project';
import * as colorconvert from 'ts4air/util/convertColor';
import SwfWriter from 'ts4air/swf/swfWriter';
import AbcFileWriter from 'ts4air/abc/abcWriter';
import SwfReader, {SwfTagCode} from 'ts4air/swf/swfReader';
import ByteArray from 'com.hydroper.util.nodejsbytearray';

export class Ts2Swf {
    public state: Ts2SwfState = new Ts2SwfState();
    
    constructor(projectPath: string, generateSWF: boolean = true) {
        const project = new Project(path.resolve(projectPath));

        this.mergePreludeSWFs();
        this.defineAdditionalBuiltins();

        // check for package-lock.json
        let packageLockPath = path.resolve(project.path, 'package-lock.json');
        if (!(fs.existsSync(packageLockPath) && fs.statSync(packageLockPath).isFile())) {
            throw new Ts2SwfError('npmDepsNotInstalled');
        }
        const packageLockJson = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));

        // collect the library entry points,
        // mapping them to their library project paths.
        const libProjectEntries: [string, string][] = [];
        for (let pkgPath of Object.keys(packageLockJson.packages)) {
            if (!pkgPath.startsWith('node_modules/')) {
                continue;
            }
            const entry = this.getLibraryProjectEntry(path.resolve(project.path, pkgPath));
            if (entry !== undefined) {
               this.state.libEntryPoints.set(entry[0], entry[1]);
            }
        }

        this.compileProject(project);

        if (this.state.foundAnyError) {
            console.log('Project invalidated due to errors above.');
        } else if (generateSWF) {
            this.generateSWF(project);
        } else {
            console.log(`Project validated: no TypeScript errors.`);
        }
    }

    public generateSWF(project: Project) {
        // read ts4air.json to get things like frame-rate, background, width etc.
        const ts4airJson = readTs4airJson(project.path);
        if (ts4airJson === undefined) {
            console.error('Project must have a ts4air.json file.');
            return;
        }
        if (ts4airJson.type != 'app') {
            console.error('Project must be an Adobe AIR application for generating a SWF.');
            return;
        }
        if (typeof ts4airJson.swf != 'object') {
            console.error('ts4air.json must have a "swf" property.');
            return;
        }
        if (typeof ts4airJson.swf.path != 'string') {
            console.error('ts4air.json must have a "swf.path" string property.');
            return;
        }
        const swfPath = path.resolve(project.path, ts4airJson.swf.path);

        // validate the main Sprite class before generating the SWF.
        // the entry point .ts must export a default Sprite subclass.
        this.validateMainClass();

        // - generate SWF based on https://github.com/brion/wasm2swf
        const swfWriter = new SwfWriter();
        swfWriter.swfHeader({
            frameSize: {
                x: 0,
                y: 0,
                width: Number(ts4airJson.swf.width === undefined ? 600 : ts4airJson.swf.width),
                height: Number(ts4airJson.swf.height === undefined ? 600 : ts4airJson.swf.height),
            },
            frameRate: Number(ts4airJson.swf.framerate === undefined ? 60 : ts4airJson.swf.framerate),
        });
        swfWriter.fileAttributes({
            actionScript3: true,
            useNetwork: true,
        });
        swfWriter.setBackgroundColor(ts4airJson.swf.background === undefined ? 0 : colorconvert.rgb(ts4airJson.swf.background));
        swfWriter.frameLabel('frame1');

        for (const tag of this.state.swfTags) {
            if (tag.code == SwfTagCode.DO_ABC) {
                let doAbc = new SwfReader(ByteArray.from(tag.data)).doABC();
                swfWriter.doABC(doAbc.name, doAbc.data, doAbc.flags);
            } else if (tag.code == SwfTagCode.DEFINE_BINARY_DATA) {
                let binaryData = new SwfReader(ByteArray.from(tag.data)).defineBinaryData();
                swfWriter.defineBinaryData(binaryData.tag, binaryData.data);
            } else if (tag.code == SwfTagCode.SYMBOL_CLASS) {
                toDo();
            }
        }

        const abcWriter = new AbcFileWriter();
        abcWriter.abcFile(this.state.abcFile);
        swfWriter.doABC('frame1', abcWriter.bytes);

        // - associate character tag id 0 to the main class by adding a SymbolClass tag
        associateMain();

        swfWriter.showFrame();
        swfWriter.end();

        fs.mkdirSync(path.resolve(swfPath, '..'), {recursive: true});
        fs.writeFileSync(swfPath, swfWriter.toSWFBytes().toNodejsBuffer());
        console.log(`SWF written to ${swfPath}.`);
    }

    public mergePreludeSWFs() {
        this.state.mergeSWF(path.resolve(__dirname, '../../../actionscript-prelude/swc/actionscript-prelude.swf'));
    }

    public compileProject(project: Project) {
        this.state.projectStack.push(project);

        // merge any SWFs referenced in optional ts4air.json
        this.mergeProjectReferencedSWFs(project.path);

        const program = this.createTSProgram(project.path);
        if (program !== undefined) {
            this.state.project.program = program;
            this.compileTSProgram(program);
        }
        this.state.projectStack.pop();
    }
    
    private mergeProjectReferencedSWFs(projectPath: string) {
        const ts4airJson = readTs4airJson(projectPath);
        if (ts4airJson !== undefined && (ts4airJson.externalActionScript instanceof Array)) {
            for (let swfPath of ts4airJson.externalActionScript) {
                swfPath = path.resolve(projectPath, swfPath);
                if (!(fs.existsSync(swfPath) && fs.statSync(swfPath).isFile())) {
                    throw new Ts2SwfError('externalSWFNotFound', {path: swfPath});
                }
                this.state.mergeSWF(swfPath);
            }
        }
    }

    public getLibraryProjectEntry(projectPath: string): [string, string] | undefined {
        const entryTS = findEntryTypeScript(projectPath);
        return entryTS === undefined ? undefined : [path.normalize(entryTS), projectPath];
    }

    public compileTSProgram(program: ts.Program) {
        [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].forEach(this.reportTSDiagnostic.bind(this));
        if (this.state.foundAnyError) {
            return;
        }  
        // - program.getTypeChecker();
        // - program.getSourceFiles();
        // throw new Error(`Unimplemented node: ${node.kind}`);
    }

    public createTSProgram(projectPath: string): ts.Program | undefined {
        let tsConfigPath = findTsConfigPath(projectPath);
        let tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
        let entryTS = findEntryTypeScript(projectPath);
        return entryTS === undefined ? undefined : ts.createProgram([entryTS], tsConfig.compilerOptions);
    }

    private reportTSDiagnostic(diagnostic: ts.Diagnostic) {
        this.state.foundAnyError ||= diagnostic.category === ts.DiagnosticCategory.Error;
        if (diagnostic.file) {
            let {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            this.state.logMessage(diagnostic.file.fileName, line, character, message);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    }
}

function readTs4airJson(projectPath: string): any {
    const ts4airJsonPath = path.resolve(projectPath, 'ts4air.json');
    if (!(fs.existsSync(ts4airJsonPath) && fs.statSync(ts4airJsonPath).isFile())) {
        return undefined;
    }
    return JSON.parse(fs.readFileSync(ts4airJsonPath, 'utf8'));
}

function findEntryTypeScript(projectPath: string): string | undefined {
    let npmPackageConfigPath = path.resolve(projectPath, 'package.json');
    if (!(fs.existsSync(npmPackageConfigPath) && fs.statSync(npmPackageConfigPath).isFile())) {
        throw new Ts2SwfError('noEntryTS');
    }
    const npmPackageConfig = JSON.parse(fs.readFileSync(npmPackageConfigPath, 'utf8'));
    if (!npmPackageConfig.hasOwnProperty("main")) {
        return undefined;
    }
    let mainTsPath = path.resolve(projectPath, npmPackageConfig.main);
    if (fs.existsSync(mainTsPath) && fs.statSync(mainTsPath).isFile()) {
        return mainTsPath;
    }
    throw new Ts2SwfError('noEntryTS');
}

function findTsConfigPath(projectPath: string): string {
    let tsConfigPath: string | undefined = undefined;
    if (fs.existsSync(path.resolve(projectPath, 'tsconfig.json')) && fs.statSync(path.resolve(projectPath, 'tsconfig.json')).isFile()) {
        tsConfigPath = path.resolve(projectPath, 'tsconfig.json');
    } else {
        tsConfigPath = path.resolve(projectPath);
        tsConfigPath = ts.findConfigFile(tsConfigPath, ts.sys.fileExists);
        if (tsConfigPath === undefined) {
            throw new Ts2SwfError('noTSConfig');
        }
    }
    return path.resolve(process.cwd(), tsConfigPath);
}