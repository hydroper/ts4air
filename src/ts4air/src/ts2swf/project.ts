import * as ts from 'typescript';

export default class Project {
    entryTSPath: string = '';
    program: ts.Program | null = null;
    alreadyCompiled: boolean = false;

    constructor(public path: string) {
    }
}