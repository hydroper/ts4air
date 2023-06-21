import Ts2SwfState from 'ts4air/ts2swf/state';
import { Ts2SwfError } from '../errors';
import { mergeProjectReferencedSWFs } from './parentProject';
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

export default function nodeTransform(node: ts.Node, state: Ts2SwfState): void {
    function transformNode(node: ts.Node): void {
        // - program.getTypeChecker();
        // - program.getSourceFiles();
        if (node.kind === ts.SyntaxKind.SourceFile) {
            transformSourceFile(node as ts.SourceFile);
        } else {
            toDo();
            throw new Error(`Unimplemented node: ${node.kind}`);
        }
    }

    function transformSourceFile(node: ts.SourceFile): void {
        let fileName = path.normalize(node.fileName);
        if (state!.sourceFilesAlreadyCompiled.has(fileName)) {
            return;
        }
        state!.sourceFilesAlreadyCompiled.add(fileName);

        // compile the ts.SourceFile statements
        toDo();

        // merge referenced SWFs from package.json from parent project.
        for (let [projDirName, proj] of state!.projectPool) {
            if (fileName.startsWith(projDirName)) {
                if (proj.externalSWFsLoaded) {
                    break;
                }
                mergeProjectReferencedSWFs(proj.path, state!);
                proj.externalSWFsLoaded = true;
                break;
            }
        }
    }

    transformNode(node);
}