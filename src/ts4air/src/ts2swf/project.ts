import * as ts from 'typescript';

export default class Project {
    entryTSPath: string;
    program: ts.Program;

    constructor(public path: string) {
    }
}