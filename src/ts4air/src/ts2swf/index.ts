import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2SwfError} from 'ts4air/ts2swf/errors';
import {AbcFile} from 'ts4air/abc/abcFile';
import Ts2SwfState from './state';

export class Ts2Swf {
    public state: Ts2SwfState = new Ts2SwfState();
    
    constructor(projectPath: string) {
        projectPath = path.resolve(projectPath);

        this.mergePreludeSWFs();
        this.defineAdditionalBuiltins();

        // compile libraries
        let packageLockPath = path.resolve(projectPath, 'package-lock.json');
        if (!(fs.existsSync(packageLockPath) && fs.statSync(packageLockPath).isFile())) {
            throw new Ts2SwfError('npmDepsNotInstalled');
        }
        const packageLockPkgs = JSON.parse(fs.readFileSync(packageLockPath, 'utf8')).packages;
        // installed packages have to be iterated in dependency ascending order
        for (let pkgPath of Object.keys(packageLockPkgs)) {
            if (!pkgPath.startsWith('node_modules/')) {
                continue;
            }
            this.compileProject(path.resolve(projectPath, pkgPath));
            if (this.state.foundAnyError) {
                break;
            }
        }

        if (this.state.foundAnyError) {
            console.log('No SWF generated due to errors above.');
        } else {
            generateSWF();
            console.log(`SWF written to ${swfWrittenToZxczxc}.`);
        }
    }

    public compileProject(projectPath: string) {
        projectPath = path.resolve(projectPath);
        // merge any SWFs referenced in optional ts4air.json
        zxczxczxczxczxczcxc();
        // 
        this.compileTSProgram(this.createTSProgram(projectPath), projectPath);
    }

    public compileTSProgram(program: ts.Program, projectPath: string) {
        projectPath = path.resolve(projectPath);
        this.state.currentProgram = program;
        this.state.projectPath = projectPath;
  
        [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].forEach(this.reportTSDiagnostic.bind(this));
        if (this.state.foundAnyError) {
            return;
        }
  
        // compile to ABC
        // - program.getTypeChecker();
        // - program.getSourceFiles();
        // throw new Error(`Unimplemented node: ${node.kind}`);
    }

    public createTSProgram(projectPath: string): ts.Program {
        let tsConfigPath = findTsConfigPath(projectPath);
        let tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
        let entryTS = findEntryTypeScript(projectPath);
        return ts.createProgram([entryTS], tsConfig.compilerOptions);
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

function findEntryTypeScript(projectPath: string): string {
    let npmPackageConfigPath = path.resolve(projectPath, 'package.json');
    if (!(fs.existsSync(npmPackageConfigPath) && fs.statSync(npmPackageConfigPath).isFile())) {
        throw new Ts2SwfError('noEntryTS');
    }
    let mainTsPath = path.resolve(projectPath, JSON.parse(fs.readFileSync(npmPackageConfigPath, 'utf8')).main);
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