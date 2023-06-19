import * as ts from 'typescript';

export default class Project {
    entryTSPath: string = '';
    alreadyCompiled: boolean = false;

    constructor(public path: string) {
    }
}