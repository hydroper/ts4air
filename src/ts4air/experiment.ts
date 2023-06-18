import {Ts2Abc} from './src//ts2abc';

let ts2abc = new Ts2Abc();
ts2abc.compile(ts2abc.programFromProject('../ts4air-testproj'));