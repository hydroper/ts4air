import ByteArray from 'com.hydroper.util.nodejsbytearray';
import {Rect} from './swf';
import BitStream from './util/bitstream';

export default class SwfWriter {
    public bytes: ByteArray = new ByteArray();

    constructor() {
        this.bytes.endian = 'littleEndian';
    }

    toNodejsBuffer() {
        return this.bytes.toNodejsBuffer();
    }

    si8(value: number) {
        this.bytes.writeSignedByte(value);
    }

    si16(value: number) {
        this.bytes.writeShort(value);
    }

    si32(value: number) {
        this.bytes.writeInt(value);
    }

    ui8(value: number) {
        this.bytes.writeByte(value);
    }

    ui16(value: number) {
        this.bytes.writeUnsignedShort(value);
    }

    ui32(value: number) {
        this.bytes.writeUnsignedInt(value);
    }

    ui64(value: bigint) {
        this.bytes.writeUnsignedLong(value);
    }

    float(value: number) {
        this.bytes.writeFloat(value);
    }

    double(value: number) {
        this.bytes.writeDouble(value);
    }

    encodedU32(value: number) {
        for (;;) {
            let byte = value & 0b01111111;
            value >>= 7;
            if (value != 0) {
                byte |= 0b10000000;
            }
            this.ui8(byte);
            if (value == 0) {
                break;
            }
        }
    }

    rect(rect: Rect) {
        // based on https://github.com/brion/wasm2swf/blob/master/src/swf.js
        let {x, y, width, height} = rect;
        let xmax = x + width;
        let ymax = y + height;
        let coords = [x, y, xmax, ymax];
        let nbits = 1 + 32 - Math.min.apply(null,
            coords.map(Math.abs).map(Math.clz32));
        
        let bits = new BitStream();
        bits.ub(nbits, 5);
        bits.sb(x, nbits);
        bits.sb(xmax, nbits);
        bits.sb(y, nbits);
        bits.sb(ymax, nbits);
        this.bytes.writeBytes(bits.toBytes());
    }

    tag(tag: number, bytes: ByteArray) {
        let {length} = bytes;
        let coded = (tag << 16)| Math.min(length, 63);
        this.ui16(coded);
        if (length >= 63) {
            this.ui32(length);
        }
        this.bytes.writeBytes(bytes);
    }

    swfHeader(options: SwfHeaderOptions) {
        this.ui8('F'.codePointAt(0));
        this.ui8('W'.codePointAt(0));
        this.ui8('S'.codePointAt(0));
        this.ui8(19);
        this.ui32(options.fileLength);
        this.rect(options.frameSize);
        this.ui16(Math.round(options.frameRate * 256));
        this.ui16(options.frameCount);
    }
}

export type SwfHeaderOptions = {
    fileLength: number,
    frameSize: Rect,
    frameRate: number,
    frameCount: number,
};