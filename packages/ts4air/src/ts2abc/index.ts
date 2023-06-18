import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2AbcError} from 'ts4air/ts2abc/errors';
import {AbcFile} from 'ts4air/abcwriter/abcFile';

export class Ts2Abc {
    private abcFile: AbcFile = new AbcFile();
    private foundAnyError: boolean = false;

    public compile(program: ts.Program) {
        [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].forEach(this.reportDiagnostic.bind(this));
        if (!this.foundAnyError) {
            // compile to ABC
        }
    }

    public programFromProject(projectPath: string): ts.Program {
        let tsConfigPath = findTsConfigPath(projectPath);
        let tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, 'utf8'));
        let entryTS = findEntryTypeScript(projectPath);
        return ts.createProgram([entryTS], tsConfig.compilerOptions);
    }

    private reportDiagnostic(diagnostic: ts.Diagnostic) {
        this.foundAnyError ||= diagnostic.category === ts.DiagnosticCategory.Error;
        if (diagnostic.file) {
            let {line, character} = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        } else {
            console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
    }
}

function findEntryTypeScript(projectPath: string): string {
    if (fs.existsSync(path.resolve(projectPath, 'src/index.ts')) && fs.statSync(path.resolve(projectPath, 'src/index.ts')).isFile()) {
        return path.resolve(projectPath, 'src/index.ts');
    }
    throw new Ts2AbcError('noEntryTS');
}

function findTsConfigPath(projectPath: string): string {
    let tsConfigPath: string | undefined = undefined;
    if (fs.existsSync(path.resolve(projectPath, 'tsconfig.json')) && fs.statSync(path.resolve(projectPath, 'tsconfig.json')).isFile()) {
        tsConfigPath = path.resolve(projectPath, 'tsconfig.json');
    } else {
        tsConfigPath = path.resolve(projectPath);
        tsConfigPath = ts.findConfigFile(tsConfigPath, ts.sys.fileExists);
        if (tsConfigPath === undefined) {
            throw new Ts2AbcError('noTSConfig');
        }
    }
    return path.resolve(process.cwd(), tsConfigPath);
}