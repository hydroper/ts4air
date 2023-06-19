import ByteArray from 'com.hydroper.util.nodejsbytearray';
import BitStream from './util/bitstream';
import {assert} from 'console';

export default class SwfWriter {
    private bytes: ByteArray = new ByteArray();
    private lengthOffset: number = 0;
    private frameCount: number = 0;
    private frameCountOffset: number = 0;

    constructor() {
        this.bytes.endian = 'littleEndian';
    }

    public toSWFBytes(): ByteArray {
        this._applyFixups();
        return this.bytes;
    }

    private _applyFixups() {
        this.bytes.position = this.lengthOffset;
        this.ui32(this.bytes.length);

        this.bytes.position = this.frameCountOffset;
        this.ui16(this.frameCount);

        this.bytes.position = this.bytes.length;
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

    string(str: string) {
        this.bytes.writeUTF8(str);
        this.ui8(0);
    }

    binary(value: ByteArray) {
        this.bytes.writeBytes(value);
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

    fileAttributes(attr: SwfFileAttributes) {
        let tag = new BitStream();
        tag.bits(0, 3);
        tag.bit(attr.hasMetadata ? 1 : 0);
        tag.bit(attr.actionScript3 ? 1 : 0);
        tag.bit(attr.suppressCrossDomainCaching ? 1 : 0);
        tag.bit(0);
        tag.bit(attr.useNetwork ? 1 : 0);
        tag.bits(0, 24); // reserved?

        this.tag(69, tag.toBytes());
    }

    frameLabel(name: string, anchor: boolean = false) {
        let tag = new SwfWriter();
        tag.string(name);
        assert(!anchor);
        /*
        if (anchor) {
            tag.bit(1);
        }
        */

        this.tag(43, tag.bytes);
    }

    showFrame() {
        this.tag(1, new ByteArray());
        ++this.frameCount;
    }

    /**
     * @param flags Flags represented by `DoABCFlags`.
     */
    doABC(name: string, bytecode: ByteArray, flags: number = 0) {
        let tag = new SwfWriter();
        tag.ui32(flags);
        tag.string(name);
        tag.bytes.writeBytes(bytecode);

        this.tag(82, tag.bytes);
    }

    symbolClass(entries: ({id: number, name: string})[]) {
        let tag = new SwfWriter();
        tag.ui16(entries.length);
        for (let {id, name} of entries) {
            tag.ui16(id);
            tag.string(name);
        }

        this.tag(76, tag.bytes);
    }

    defineBinaryData(id: number, data: ByteArray) {
        let tag = new SwfWriter();
        tag.ui16(id);
        tag.ui32(0);
        tag.bytes.writeBytes(data);

        this.tag(87, tag.bytes);
    }

    setBackgroundColor(color: number) {
        let tag = new SwfWriter();
        tag.ui8((color >> 16) & 0xFF);
        tag.ui8((color >> 8) & 0xFF);
        tag.ui8(color & 0xFF);

        this.tag(9, tag.bytes);
    }

    end() {
        this.tag(0, new ByteArray());
    }

    swfHeader(options: SwfHeaderOptions) {
        this.ui8('F'.codePointAt(0)!);
        this.ui8('W'.codePointAt(0)!);
        this.ui8('S'.codePointAt(0)!);
        this.ui8(19);

        // fileLength
        this.lengthOffset = this.bytes.position;
        this.ui32(0);

        this.rect(options.frameSize);
        this.ui16(Math.round(options.frameRate * 256));

        // frameCount
        this.frameCountOffset = this.bytes.position;
        this.ui16(0);
    }
}

export type SwfHeaderOptions = {
    frameSize: Rect,
    frameRate: number,
};

export type SwfFileAttributes = {
    actionScript3: boolean,
    useNetwork: boolean,
    hasMetadata?: boolean,
    suppressCrossDomainCaching?: boolean,
};

export const DoABCFlags = {
    LAZY_INITIALIZE: 1,
};

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number,
};