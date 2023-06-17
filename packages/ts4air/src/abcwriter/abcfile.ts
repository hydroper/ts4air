import ByteArray, {Endian} from 'com.hydroper.util.nodejsbytearray';

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

    writeU24(value: number) {
        this.bytes.writeUnsignedShort(-value & 0xFF_FF);
        this.bytes.writeByte(value > -1 ? value >> 16 : (-value >> 16) | 0x80);
    }
}