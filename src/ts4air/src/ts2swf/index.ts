import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2SwfError} from 'ts4air/ts2swf/errors';
import {AbcFile} from 'ts4air/abc/abcFile';
import Ts2SwfState from './state';
import Project from './project';

export class Ts2Swf {
    public state: Ts2SwfState = new Ts2SwfState();
    
    constructor(projectPath: string, generateSWF: boolean = true) {
        projectPath = path.resolve(projectPath);

        this.mergePreludeSWFs();
        this.defineAdditionalBuiltins();

        // check for package-lock.json
        let packageLockPath = path.resolve(projectPath, 'package-lock.json');
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
            const entry = this.getLibraryProjectEntry(path.resolve(projectPath, pkgPath));
            if (entry !== undefined) {
               this.state.libEntryPoints.set(entry[0], entry[1]);
            }
        }

        this.compileProject(projectPath);

        if (this.state.foundAnyError) {
            console.log('Project invalidated due to errors above.');
        } else if (generateSWF) {
            this.generateSWF(projectPath);
        } else {
            console.log(`Project validated: no TypeScript errors.`);
        }
    }

    public generateSWF(projectPath: string) {
        // read ts4air.json to get things like frame-rate, background, width etc.
        let ts4airJsonPath = path.resolve(projectPath, 'ts4air.json');
        if (!(fs.existsSync(ts4airJsonPath) && fs.statSync(ts4airJsonPath).isFile())) {
            console.error('Project must have a ts4air.json file.');
            return;
        }

        // - validate the main Sprite class before generating SWF
        // - generate SWF based on https://github.com/brion/wasm2swf
        // - associate character tag id 0 to the main class (by adding a SymbolClass tag)
        // - use util/convertColor.ts

        if (projectIsApplication()) {
            generateSWF();
            console.log(`SWF written to ${swfWrittenToZxczxc}.`);
        } else {
            console.error(`Cannot generate SWF since the project is a library`);
        }
    }

    public mergePreludeSWFs() {
        this.state.mergeSWF(path.resolve(__dirname, '../../../actionscript-prelude/swc/actionscript-prelude.swf'));
    }

    public compileProject(projectPath: string) {
        projectPath = path.resolve(projectPath);
        this.state.projectStack.push(new Project(projectPath));

        // merge any SWFs referenced in optional ts4air.json
        mergeProjectReferencedSWFs();

        const program = this.createTSProgram(projectPath);
        if (program !== undefined) {
            this.state.project.program = program;
            this.compileTSProgram(program, projectPath);
        }
        this.state.projectStack.pop();
    }

    public getLibraryProjectEntry(projectPath: string): [string, string] | undefined {
        const entryTS = findEntryTypeScript(projectPath);
        return entryTS === undefined ? undefined : [path.normalize(entryTS), projectPath];
    }

    public compileTSProgram(program: ts.Program, projectPath: string) {
        projectPath = path.resolve(projectPath);

        [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].forEach(this.reportTSDiagnostic.bind(this));
        if (this.state.foundAnyError) {
            return;
        }
  
        // compile to ABC
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