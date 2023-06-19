import {AbcFile} from 'ts4air/abc/abcFile';
import {SwfTag} from 'ts4air/swf/swf';
import * as ts from 'typescript';
import * as path from 'path';

export default class Ts2SwfState {
    public swfTags: SwfTag[] = [];
    public abcFile: AbcFile = new AbcFile();
    public foundAnyError: boolean = false;
    public currentProgram: ts.Program | null = null;
    public projectPath: string = '';

    public logMessage(file: string, line: number, character: number, message: string) {
        console.log(`${path.relative(this.projectPath, file)} (${line + 1},${character + 1}): ${message}`);
    }

    public reportError(file: string, line: number, character: number, message: string) {
        this.foundAnyError = true;
        console.error(`${path.relative(this.projectPath, file)} (${line + 1},${character + 1}): ${message}`);
    }
}