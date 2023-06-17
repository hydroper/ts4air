import {assert} from 'console';

export type Endian = 'littleEndian' | 'bigEndian';

export default class ByteArray {
    private static INITIAL_CAPACITY: number = 8;
    private _buffer: Buffer;
    private _index: number = 0;
    private _length: number = 0;
    private _endian: Endian = 'littleEndian';

    constructor(initialCapacityArg: undefined | number = undefined) {
        var initialCapacity = initialCapacityArg === undefined ? ByteArray.INITIAL_CAPACITY : initialCapacityArg;
        assert(initialCapacity >= 2, 'ByteArray initial capacity must be >= 2.');
        this._buffer = Buffer.allocUnsafe(initialCapacity);
    }

    public static withCapacity(length: number): ByteArray {
        return new ByteArray(length);
    }

    public static withZeroes(length: number): ByteArray {
        var r = new ByteArray();
        r._buffer = Buffer.alloc(length);
        r._length = length;
        return r;
    }

    public static from(arg: ByteArray | Buffer): ByteArray {
        var r = new ByteArray();
        if (arg instanceof ByteArray) {
            r._buffer = arg.toNodejsBuffer();
            r._length = r._buffer.byteLength;
        } else {
            r._buffer = Buffer.from(arg);
            r._length = arg.byteLength;
        }
        return r;
    }

    public toNodejsBuffer(): Buffer {
        return Buffer.from(this._buffer.subarray(0, this._length));
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

    public at(position: number): number {
        return position < this._length ? this._buffer.readUInt8(position) : 0;
    }

    private _growIfRequired(length: number): void {
        var ipl = this._index + length;
        // double buffer capacity as needed
        while (ipl > this._buffer.byteLength) {
            this._buffer = Buffer.concat([this._buffer, Buffer.allocUnsafe(this._buffer.byteLength)]);
        }
        if (this._index == this._length) {
            this._length += length;
        } else {
            while (ipl >= this._length) {
                ++this._length;
            }
        }
    }

    *[Symbol.iterator]() {
        for (let i = 0; i < this._length; ++i) {
            yield this._buffer.readUInt8(i);
        }
    }

    public readByte(): number {
        assert(this._index < this._length, 'Insufficient data available to read.');
        return this._buffer.readUInt8(this._index);
    }

    public writeByte(value: number): void {
        this._growIfRequired(1);
        this._buffer.writeUInt8(value, this._index);
    }
}