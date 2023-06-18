import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import {Ts2AbcError} from 'ts4air/ts2abc/errors';
import {AbcFile} from 'ts4air/abcwriter/abcFile';

export class Ts2Abc {
    private abcFile: AbcFile = new AbcFile();

    constructor(projectPath: string) {
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