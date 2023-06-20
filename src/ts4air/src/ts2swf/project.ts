import * as ts from 'typescript';

export default class Project {
    entryTSPath: string = '';
    externalSWFsLoaded: boolean = false;

    constructor(public path: string) {
    }
}