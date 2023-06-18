import ByteArray, {Endian} from 'com.hydroper.util.nodejsbytearray';

export default class SwfWriter {
    public bytes: ByteArray = new ByteArray();

    constructor() {
        this.bytes.endian = 'littleEndian';
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
}