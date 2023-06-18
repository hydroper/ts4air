import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2AbcError} from 'ts4air/ts2abc/errors';
import {AbcFile} from 'ts4air/abcwriter/abcFile';

export class Ts2Abc {
    private abcFile: AbcFile = new AbcFile();
    private foundAnyError: boolean = false;

    constructor(projectPath: string) {
    }

    compile(program: ts.Program) {
        [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()].forEach(this.reportDiagnostic);
    }
    
    reportDiagnostic(diagnostic: ts.Diagnostic) {
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

function findTsConfigPath(projectPath: string): string {
    let tsConfigPath: string | undefined = path.resolve(projectPath);
    if (!fs.existsSync(tsConfigPath) || !fs.statSync(tsConfigPath).isFile()) {
        tsConfigPath = ts.findConfigFile(tsConfigPath, ts.sys.fileExists);
        if (tsConfigPath === undefined) {
            throw new Ts2AbcError('noTSConfig');
        }
    }
    return path.resolve(process.cwd(), tsConfigPath);
}