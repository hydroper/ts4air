import ByteArray, {Endian} from 'com.hydroper.util.nodejsbytearray';
import {assert} from 'console';

export default class AbcFile {
    public bytes = new ByteArray;

    constructor() {
        this.bytes.endian = 'littleEndian';
    }

    toNodejsBuffer() {
        return this.bytes.toNodejsBuffer();
    }

    writeU8(value: number) {
        this.bytes.writeByte(value);
    }

    writeU16(value: number) {
        this.bytes.writeUnsignedShort(value);
    }

    writeS24(value: number) {
        assert(value >= -0x80_00_00 && value <= 0x7F_FF_FF, `Invalid s24 range, given: ${value}.`);
        this.bytes.writeUnsignedShort(-value & 0xFF_FF);
        this.bytes.writeByte(value > -1 ? value >> 16 : -(value >> 16) | 0x80);
    }

    writeU32(value: number) {
        assert(value >= 0 && value <= 0xFF_FF_FF_FF, `Invalid u32 range, given: ${value}.`);
        for (;;) {
            let byte = value & 0x7F;
            value >>= 7;
            if (value != 0) {
                this.writeU8(0b1_0000000 | byte);
            } else {
                this.writeU8(byte);
                break;
            }
        }
    }
}