import Ts2SwfState from 'ts4air/ts2swf/state';
import {Ts2SwfError} from '../errors';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

export default function compileNode(node: ts.Node, state: Ts2SwfState): void {
    function compileNode(node: ts.Node): void {
        // - program.getTypeChecker();
        // - program.getSourceFiles();
        if (node.kind === ts.SyntaxKind.SourceFile) {
            compileSourceFile(node as ts.SourceFile);
        } else {
            toDo();
            throw new Error(`Unimplemented node: ${node.kind}`);
        }
    }

    function compileSourceFile(node: ts.SourceFile): void {
        let fileName = path.normalize(node.fileName);
        if (state.sourceFilesAlreadyCompiled.has(fileName)) {
            return;
        }
        state.sourceFilesAlreadyCompiled.add(fileName);

        // if the source file is from another project from a dependencty,
        // merge referenced SWFs from package.json.
        for (let [projDirName, proj] of state.projectPool) {
            if (fileName.startsWith(projDirName)) {
                if (proj.externalSWFsLoaded) {
                    break;
                }
                mergeProjectReferencedSWFs(proj.path, state);
                proj.externalSWFsLoaded = true;
                break;
            }
        }

        // compile the ts.SourceFile statements
        toDo();
    }

    compileNode(node);
}

function readTs4airJson(projectPath: string): any {
    const ts4airJsonPath = path.resolve(projectPath, 'package.json');
    if (!(fs.existsSync(ts4airJsonPath) && fs.statSync(ts4airJsonPath).isFile())) {
        return undefined;
    }
    const o = JSON.parse(fs.readFileSync(ts4airJsonPath, 'utf8'));
    return typeof o.ts4air === 'object' ? o.ts4air : undefined;
}

function mergeProjectReferencedSWFs(projectPath: string, state: Ts2SwfState) {
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