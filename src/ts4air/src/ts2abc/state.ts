import {AbcFile} from 'ts4air/abc/abcFile';
import * as ts from 'typescript';

export default class Ts2AbcState {
    public abcFile: AbcFile = new AbcFile();
    public foundAnyError: boolean = false;
    public currentProgram: ts.Program | null = null;

    public reportError(message: string) {
        this.foundAnyError = true;
        console.error(message);
    }
}