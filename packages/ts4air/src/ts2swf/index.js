const {
    ABCFileBuilder,
    Label,
    Namespace,
    Instance,
    Class,
    Trait,
    Script,

    SWFFileBuilder,
} = require('./swfWritting/index');
const ts = require('typescript');

class TS2SWF {
    program = null;

    constructor(fileName, options) {
        this.program = ts.createProgram(fileName, options);
    }
}

exports.TS2SWF = TS2SWF;