import {AbcFile} from 'ts4air/abcwriter/abcFile';

export default class Ts2AbcState {
    public abcFile: AbcFile = new AbcFile();
    public foundAnyError: boolean = false;
}