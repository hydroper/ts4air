import {AbcFile} from 'ts4air/abc/abcFile';
import {SwfTag} from 'ts4air/swf/swf';
import * as ts from 'typescript';
import * as path from 'path';
import Project from './project';

export default class Ts2SwfState {
    public swfTags: SwfTag[] = [];
    public abcFile: AbcFile = new AbcFile();
    public foundAnyError: boolean = false;
    public projectStack: Project[] = [];

    public get project(): Project {
        return this.projectStack[this.projectStack.length - 1];
    }

    public logMessage(file: string, line: number, character: number, message: string) {
        console.log(`${path.relative(this.project.path, file)} (${line + 1},${character + 1}): ${message}`);
    }

    public reportError(file: string, line: number, character: number, message: string) {
        this.foundAnyError = true;
        console.error(`${path.relative(this.project.path, file)} (${line + 1},${character + 1}): ${message}`);
    }
}