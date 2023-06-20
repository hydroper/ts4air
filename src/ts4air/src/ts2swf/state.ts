import {AbcFile} from 'ts4air/abc/abcFile';
import {SwfTag} from 'ts4air/swf/swf';
import * as ts from 'typescript';
import * as path from 'path';
import Project from './project';
import SwfReader, {SwfTagCode} from 'ts4air/swf/swfReader';
import {assert} from 'console';
import ByteArray from 'com.hydroper.util.nodejsbytearray';
import SwfWriter from 'ts4air/swf/swfWriter';

export default class Ts2SwfState {
    public program: ts.Program | null = null;

    /**
     * Entry point project.
     */
    public project: Project | null = null;

    /**
     * Maps from a project path, terminating with a slash, to a `Project` object.
     */
    public projectPool: Map<string, Project> = new Map();

    public sourceFilesAlreadyCompiled: Set<string> = new Set();

    public swfTags: SwfTag[] = [];
    private swfAlreadyUsedCharTagIds: Set<number> = new Set();

    public abcFile: AbcFile = new AbcFile();

    /**
     * Index of the public namespace of the top-level package.
     */
    public abcToplevelPubns: number = 0;

    /**
     * Tells whether the project is invalidated due to a TypeScript error.
     */
    public foundAnyError: boolean = false;

    constructor() {
        this.abcToplevelPubns = this.abcFile.constantPool.internNamespace('packageNamespace', '');
    }

    public logMessage(file: string, line: number, character: number, message: string) {
        console.log(`${path.relative(this.project!.path, file)} (${line + 1},${character + 1}): ${message}`);
    }

    public reportError(file: string, line: number, character: number, message: string) {
        this.foundAnyError = true;
        console.error(`${path.relative(this.project!.path, file)} (${line + 1},${character + 1}): ${message}`);
    }

    public nextSWFCharTagId(): number {
        let r = 1;
        while (this.swfAlreadyUsedCharTagIds.has(r)) {
            ++r;
            assert(r <= 0xFFFF);
        }
        this.swfAlreadyUsedCharTagIds.add(r);
        return r;
    }

    public mergeSWF(file: Buffer | string) {
        let swf = SwfReader.readSync(file);
        let symbolClasses = swf.tags.filter(tag => tag.code == SwfTagCode.SYMBOL_CLASS);
        let reassignedCharTagIds = new Map<number, number>();
        for (let tag of swf.tags) {
            if (tag.code == SwfTagCode.DO_ABC) {
                this.swfTags.push(tag);
            } else if (tag.code == SwfTagCode.DEFINE_BINARY_DATA) {
                // re-assign the character tag ID if already used.
                let binaryData = new SwfReader(ByteArray.from(tag.data!)).defineBinaryData();
                let prevTag = binaryData.tag;
                binaryData.tag = this.swfAlreadyUsedCharTagIds.has(binaryData.tag) ? this.nextSWFCharTagId() : binaryData.tag;
                this.swfAlreadyUsedCharTagIds.add(binaryData.tag);
                reassignedCharTagIds.set(prevTag, binaryData.tag);
                let newData = new SwfWriter();
                newData.ui16(binaryData.tag);
                newData.ui32(0);
                newData.binary(binaryData.data);
                tag.data = newData.toNodejsBuffer();
            }
        }
        for (let symbolClass of symbolClasses) {
            // re-assign the character tag IDs
            for (let symbol of symbolClass.symbols!) {
                symbol.id = reassignedCharTagIds.get(symbol.id)!;
            }

            this.swfTags.push(symbolClass);
        }
    }
}