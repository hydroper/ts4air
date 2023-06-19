import ByteArray from 'com.hydroper.util.nodejsbytearray';
import {assert} from 'console';

export default class SwfReader {
    constructor(private bytes: ByteArray) {
        this.bytes.endian = 'littleEndian';
    }

    private ui32(): number {
        return this.bytes.readUnsignedInt();
    }

    private ui16(): number {
        return this.bytes.readUnsignedShort();
    }

    private ui8(): number {
        return this.bytes.readByte();
    }

    private skipHeader() {
        this.ui8(); // signature
        this.ui8(); // signature
        this.ui8(); // signature
        this.ui8(); // version
        this.ui32(); // file length
        this.rect();
    }

    private rect(): Rect {
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

export type Rect = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
};

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