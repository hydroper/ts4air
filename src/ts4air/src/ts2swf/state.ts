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
    public swfTags: SwfTag[] = [];

    private swfAlreadyUsedCharTagIds: Set<number> = new Set();

    public abcFile: AbcFile = new AbcFile();

    public foundAnyError: boolean = false;

    public projectStack: Project[] = [];

    /**
     * Maps an entry point `.ts` file to a library project path.
     * Used for compiling dependency projects with custom `ts4air.json` configuration.
     */
    public libEntryPoints: Map<string, string> = new Map();

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
                let binaryData = new SwfReader(ByteArray.from(tag.data)).defineBinaryData();
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
            for (let symbol of symbolClass.symbols) {
                symbol.id = reassignedCharTagIds.get(symbol.id);
            }

            this.swfTags.push(symbolClass);
        }
    }
}