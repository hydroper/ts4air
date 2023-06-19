import ByteArray from 'com.hydroper.util.nodejsbytearray';
import {assert} from 'console';

export default class SwfReader {
    constructor(private bytes: ByteArray) {
        this.bytes.endian = 'littleEndian';
    }

    public skipHeader() {
        assert(this.ui8() == 'F'.codePointAt(0), 'SWF with unsupported compression format.');
        this.ui8(); // signature
        this.ui8(); // signature
        this.ui8(); // version
        this.ui32(); // file length
        this.rect(); // frame size
        this.ui16(); // frame rate
        this.ui16(); // frame count
    }

    public tags(): SwfTag[] {
        let tags: SwfTag[] = [];
        while (this.bytes.hasBytesAvailable) {
            let b = this.ui16();
            let [kind, length] = [b >> 6, b & 0b111_111];
            if (length >= 63) {
                length = this.ui32();
            }
            let content = this.bytes.readBytes(length);
            tags.push(new SwfTag(kind, content));
        }
        return tags;
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

    public rect(): Rect {
        let bits = new BitsReader(this.bytes);
        let numBits = bits.ub(5);
        return {
            minX: bits.sb(numBits),
            maxX: bits.sb(numBits),
            minY: bits.sb(numBits),
            maxY: bits.sb(numBits),
        };
    }
}

export class SwfTag {
    constructor(public kind: number, public content: ByteArray) {
    }
}

export type Rect = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
};

// note: picked up from https://github.com/rafaeldias/swf-reader/blob/master/lib/swf-buffer.js.
// may need to be replaced by something different later.
class BitsReader {
    constructor(private bytes: ByteArray) {
        this.start();
    }

    public ub(length: number): number {
        return this.b(length, false);
    }

    public sb(length: number): number {
        return this.b(length, true);
    }

    public b(length: number, signed: boolean = false): number {
        let {current} = this;
        let n = 0, r = 0;
        let sign = signed && ++n && ((current >> (8 - this.bytes.position++)) & 1) ? -1 : 1;
        while (n++ < length) {
            if (this.bytes.position > 8) {
                this.start();
                ({current} = this);
            }
            r = (r << 1) + ((current >> (8 - this.bytes.position++)) & 1);
        }
        return sign * r;
    }

    private get current(): number {
        return this.bytes.at(this.bytes.position - 1);
    }

    private start() {
        assert(this.bytes.hasBytesAvailable, 'SWF is invalid.');
        this.bytes.position = 1;
    }
}