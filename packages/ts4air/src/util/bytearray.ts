import {assert} from 'console';

export type Endian = 'littleEndian' | 'bigEndian';

export default class ByteArray {
    private static INITIAL_CAPACITY: number = 8;
    private _buffer: Buffer;
    private _index: number = 0;
    private _length: number = 0;
    private _endian: Endian = 'littleEndian';

    constructor(initialCapacityArg: undefined | number = undefined) {
        let initialCapacity = initialCapacityArg === undefined ? ByteArray.INITIAL_CAPACITY : initialCapacityArg;
        assert(initialCapacity >= 2, 'ByteArray initial capacity must be >= 2.');
        this._buffer = Buffer.allocUnsafe(initialCapacity);
    }

    public static withCapacity(length: number): ByteArray {
        return new ByteArray(length);
    }

    public static withZeroes(length: number): ByteArray {
        let r = new ByteArray();
        r._buffer = Buffer.alloc(length);
        r._length = length;
        return r;
    }

    public static from(arg: ByteArray | Buffer): ByteArray {
        let r = new ByteArray();
        if (arg instanceof ByteArray) {
            r._buffer = arg.toNodejsBuffer();
            r._length = r._buffer.length;
        } else {
            r._buffer = Buffer.from(arg);
            r._length = arg.length;
        }
        return r;
    }

    public toNodejsBuffer(): Buffer {
        return Buffer.from(this._buffer.subarray(0, this._length));
    }

    public get endian(): Endian {
        return this._endian;
    }

    public set endian(value: Endian) {
        this._endian = value;
    }

    public get length(): number {
        return this._length;
    }

    public get position(): number {
        return this._index;
    }

    public set position(value: number) {
        this._index = Math.min(Math.max(value, 0), this._length);
    }

    public get bytesAvailable(): number {
        return this._length - this._index;
    }

    public get hasBytesAvailable(): boolean {
        return this._index < this._length;
    }

    public at(position: number): number {
        return position < this._length ? this._buffer.readUInt8(position) : 0;
    }

    public set(position: number, value: number) {
        assert(this.hasBytesAvailable, 'Setting ByteArray index out of bounds.');
        this._buffer.writeUInt8(value, position);
    }

    private _growIfRequired(length: number): void {
        let ipl = this._index + length;
        // double buffer capacity as needed
        while (ipl > this._buffer.length) {
            this._buffer = Buffer.concat([this._buffer, Buffer.allocUnsafe(this._buffer.length)]);
        }
        let bytesToAppend = -(this._length - ipl);
        this._length += bytesToAppend > 0 ? bytesToAppend : 0;
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this._length; ++i) {
            yield this._buffer.readUInt8(i);
        }
    }

    public readByte(): number {
        assert(this._index < this._length, 'Insufficient data available to read.');
        let k = this._buffer.readUInt8(this._index);
        this._index += 1;
        return k;
    }

    public writeByte(value: number): void {
        this._growIfRequired(1);
        this._buffer.writeUInt8(value, this._index);
        this._index += 1;
    }

    public readSignedByte(): number {
        assert(this._index < this._length, 'Insufficient data available to read.');
        let k = this._buffer.readInt8(this._index);
        this._index += 1;
        return k;
    }

    public writeSignedByte(value: number): void {
        this._growIfRequired(1);
        this._buffer.writeInt8(value, this._index);
        this._index += 1;
    }

    public readShort(): number {
        assert(this._index + 1 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readInt16LE(this._index) : this._buffer.readInt16BE(this._index);
        this._index += 2;
        return k;
    }

    public writeShort(value: number): void {
        this._growIfRequired(2);
        if (this._endian == 'littleEndian') {
            this._buffer.writeInt16LE(value, this._index);
        } else {
            this._buffer.writeInt16BE(value, this._index);
        }
        this._index += 2;
    }

    public readUnsignedShort(): number {
        assert(this._index + 1 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readUInt16LE(this._index) : this._buffer.readUInt16BE(this._index);
        this._index += 2;
        return k;
    }

    public writeUnsignedShort(value: number): void {
        this._growIfRequired(2);
        if (this._endian == 'littleEndian') {
            this._buffer.writeUInt16LE(value, this._index);
        } else {
            this._buffer.writeUInt16BE(value, this._index);
        }
        this._index += 2;
    }

    public readInt(): number {
        assert(this._index + 3 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readInt32LE(this._index) : this._buffer.readInt32BE(this._index);
        this._index += 4;
        return k;
    }

    public writeInt(value: number): void {
        this._growIfRequired(4);
        if (this._endian == 'littleEndian') {
            this._buffer.writeInt32LE(value, this._index);
        } else {
            this._buffer.writeInt32BE(value, this._index);
        }
        this._index += 4;
    }

    public readUnsignedInt(): number {
        assert(this._index + 3 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readUInt32LE(this._index) : this._buffer.readUInt32BE(this._index);
        this._index += 4;
        return k;
    }

    public writeUnsignedInt(value: number): void {
        this._growIfRequired(4);
        if (this._endian == 'littleEndian') {
            this._buffer.writeUInt32LE(value, this._index);
        } else {
            this._buffer.writeUInt32BE(value, this._index);
        }
        this._index += 4;
    }

    public readLong(): bigint {
        assert(this._index + 7 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readBigInt64LE(this._index) : this._buffer.readBigInt64BE(this._index);
        this._index += 8;
        return k;
    }

    public writeLong(value: bigint): void {
        this._growIfRequired(8);
        if (this._endian == 'littleEndian') {
            this._buffer.writeBigInt64LE(value, this._index);
        } else {
            this._buffer.writeBigInt64BE(value, this._index);
        }
        this._index += 8;
    }

    public readUnsignedLong(): bigint {
        assert(this._index + 7 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readBigUInt64LE(this._index) : this._buffer.readBigUInt64BE(this._index);
        this._index += 8;
        return k;
    }

    public writeUnsignedLong(value: bigint): void {
        this._growIfRequired(8);
        if (this._endian == 'littleEndian') {
            this._buffer.writeBigUInt64LE(value, this._index);
        } else {
            this._buffer.writeBigUInt64BE(value, this._index);
        }
        this._index += 8;
    }

    public readFloat(): number {
        assert(this._index + 3 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readFloatLE(this._index) : this._buffer.readFloatBE(this._index);
        this._index += 4;
        return k;
    }

    public writeFloat(value: number): void {
        this._growIfRequired(4);
        if (this._endian == 'littleEndian') {
            this._buffer.writeFloatLE(value, this._index);
        } else {
            this._buffer.writeFloatBE(value, this._index);
        }
        this._index += 4;
    }

    public readDouble(): number {
        assert(this._index + 7 < this._length, 'Insufficient data available to read.');
        let k = this._endian == 'littleEndian' ? this._buffer.readDoubleLE(this._index) : this._buffer.readDoubleBE(this._index);
        this._index += 8;
        return k;
    }

    public writeDouble(value: number): void {
        this._growIfRequired(8);
        if (this._endian == 'littleEndian') {
            this._buffer.writeDoubleLE(value, this._index);
        } else {
            this._buffer.writeDoubleBE(value, this._index);
        }
        this._index += 8;
    }

    public readUTF8(length: number): string {
        assert(this._index + length < this._length, 'Insufficient data available to read.');
        let k = this._buffer.subarray(this._index, this._index + length);
        this._index += length;
        return k.toString('utf8');
    }

    public writeUTF8(value: string) {
        var buf = Buffer.from(value, 'utf8');
        this._growIfRequired(buf.length);
        buf.copy(this._buffer, this._index);
        this._index += buf.length;
    }

    public readBytes(length: number): ByteArray {
        assert(this._index + length < this._length, 'Insufficient data available to read.');
        let k = this._buffer.subarray(this._index, this._index + length);
        this._index += length;
        return ByteArray.from(k);
    }

    public writeBytes(value: ByteArray) {
        var buf = value.toNodejsBuffer();
        this._growIfRequired(buf.length);
        buf.copy(this._buffer, this._index);
        this._index += buf.length;
    }

    public clear(keepCapacity: boolean = false) {
        this._index = 0;
        this._length = 0;
        this._buffer = keepCapacity ? this._buffer : Buffer.allocUnsafe(ByteArray.INITIAL_CAPACITY);
    }
}