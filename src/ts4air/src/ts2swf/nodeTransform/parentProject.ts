import Ts2SwfState from 'ts4air/ts2swf/state';
import {Ts2SwfError} from '../errors';
import * as path from 'path';
import * as fs from 'fs';

export function mergeProjectReferencedSWFs(projectPath: string, state: Ts2SwfState) {
    const ts4airJson = readTs4airJson(projectPath);
    if (ts4airJson !== undefined && (ts4airJson.externalActionScript instanceof Array)) {
        for (let swfPath of ts4airJson.externalActionScript) {
            swfPath = path.resolve(projectPath, swfPath);
            if (!(fs.existsSync(swfPath) && fs.statSync(swfPath).isFile())) {
                throw new Ts2SwfError('externalSWFNotFound', {path: swfPath});
            }
            state.mergeSWF(swfPath);
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