import ByteArray from 'com.hydroper.util.nodejsbytearray';
import * as rfd_SWFReader from 'swf-reader';
import {assert} from 'console';
import {Swf, SwfBinaryData} from './swf';

export default class SwfReader {
    public static readSync(file: Buffer | string): Swf {
        let rfdSwf = rfd_SWFReader.readSync(file);
        return {
            version: rfdSwf.version,
            fileLength: rfdSwf.fileLength,
            frameSize: rfdSwf.frameSize,
            frameRate: rfdSwf.frameRate,
            frameCount: rfdSwf.frameCount,
            backgroundColor: rfdSwf.backgroundColor,
            fileAttributes: rfdSwf.fileAttributes,
            metadata: rfdSwf.metadata,
            tags: rfdSwf.tags,
        };
    }

    constructor(public bytes: ByteArray) {
        this.bytes.endian = 'littleEndian';
    }

    public ui32(): number {
        return this.bytes.readUnsignedInt();
    }

    public ui16(): number {
        return this.bytes.readUnsignedShort();
    }

    public ui8(): number {
        return this.bytes.readByte();
    }

    public defineBinaryData(): SwfBinaryData {
        let tag = this.ui16();
        this.ui32();
        let data = this.bytes.readBytes(this.bytes.bytesAvailable);
        return { tag, data };
    }
}

export class SwfTag {
    constructor(public kind: number, public content: ByteArray) {
    }
}

export const SwfTagCode = {
    SYMBOL_CLASS: 76,
    DEFINE_BINARY_DATA: 87,
    DO_ABC: 82,
};