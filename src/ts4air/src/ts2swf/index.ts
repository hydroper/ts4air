import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { Ts2SwfError } from 'ts4air/ts2swf/errors';
import defineAdditionalBuiltins from 'ts4air/ts2swf/defineAdditionalBuiltins';
import { AbcFile } from 'ts4air/abc/abcFile';
import Ts2SwfState from './state';
import Project from './project';
import compileNode from './nodes';
import * as colorconvert from 'ts4air/util/convertColor';
import SwfWriter from 'ts4air/swf/swfWriter';
import AbcFileWriter from 'ts4air/abc/abcWriter';
import SwfReader, { SwfTagCode } from 'ts4air/swf/swfReader';
import ByteArray from 'com.hydroper.util.nodejsbytearray';
import { assert } from 'console';

export class Ts2Swf {
    public state: Ts2SwfState = new Ts2SwfState();
    
    constructor(projectPath: string, generateSWF: boolean = true) {
        const project = new Project(path.resolve(projectPath));
        this.state.project = project;

        this.mergePreludeSWFs();

        // define types such as Promise and Map
        defineAdditionalBuiltins(this.state);

        // check for package-lock.json
        let packageLockPath = path.resolve(project.path, 'package-lock.json');
        if (!(fs.existsSync(packageLockPath) && fs.statSync(packageLockPath).isFile())) {
            throw new Ts2SwfError('npmDepsNotInstalled');
        }
        const packageLockJson = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));

        for (let pkgPath of Object.keys(packageLockJson.packages)) {
            pkgPath = path.normalize(path.resolve(project.path, pkgPath));
            pkgPath = path.normalize(pkgPath + (pkgPath.endsWith(path.sep) ? '' : path.sep));
            this.state.projectPool.set(pkgPath, new Project(pkgPath));
        }

        // compile ts.SourceFile index.d.ts from com.adobe.air package before other
        // source files, since it uses `declare global {}`.
        this.compileAdobeAIRDTS();
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
        const ts4airJson = readTs4airJson(project.path);
        if (ts4airJson === undefined) {
            console.error('Project must have a package.json file with a "ts4air" field.');
            return;
        }
        if (ts4airJson.type != 'app') {
            console.error('Project must be an Adobe AIR application for generating a SWF.');
            return;
        }
        if (typeof ts4airJson.swf != 'object') {
            console.error('package.json must have a "ts4air.swf" property.');
            return;
        }
        if (typeof ts4airJson.swf.path != 'string') {
            console.error('package.json must have a "ts4air.swf.path" string property.');
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
                let doAbc = new SwfReader(ByteArray.from(tag.data!)).doABC();
                swfWriter.doABC(doAbc.name, doAbc.data, doAbc.flags);
            } else if (tag.code == SwfTagCode.DEFINE_BINARY_DATA) {
                let binaryData = new SwfReader(ByteArray.from(tag.data!)).defineBinaryData();
                swfWriter.defineBinaryData(binaryData.tag, binaryData.data);
            } else if (tag.code == SwfTagCode.SYMBOL_CLASS) {
                swfWriter.symbolClass(tag.symbols!);
            }
        }

        // output the entry point script to state.abcFile.scripts
        outputABCEntryScriptInfoHere();

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
        const program = this.createTSProgram(project.path);
        if (program === undefined) {
            throw new Ts2SwfError('noEntryTS');
        }
        this.state.program = program;
        [...this.state.program.getSyntacticDiagnostics(), ...this.state.program.getSemanticDiagnostics()].forEach(this.reportTSDiagnostic.bind(this));
        if (this.state.foundAnyError) {
            return;
        }
        const [rootFileName] = this.state.program.getRootFileNames();
        compileNode(this.state.program.getSourceFile(rootFileName)!, this.state);
    }

    // compile .d.ts specifically from 'com.adobe.air'.
    public compileAdobeAIRDTS() {
        let sourceFile = this.state.program!.getSourceFile(path.resolve(this.state.project!.path, 'node_modules/com.adobe.air/src/index.d.ts'));
        assert(sourceFile !== undefined, 'Failed to retrieve \'com.adobe.air\' .d.ts.');
        compileNode(sourceFile!, this.state!);
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
            let {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start!);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            this.state.logMessage(diagnostic.file.fileName, line, character, message);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    }
}

function readTs4airJson(projectPath: string): any {
    const ts4airJsonPath = path.resolve(projectPath, 'package.json');
    if (!(fs.existsSync(ts4airJsonPath) && fs.statSync(ts4airJsonPath).isFile())) {
        return undefined;
    }
    const o = JSON.parse(fs.readFileSync(ts4airJsonPath, 'utf8'));
    return typeof o.ts4air === 'object' ? o.ts4air : undefined;
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