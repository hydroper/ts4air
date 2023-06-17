import { assert } from 'console';

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

    static withCapacity(length: number): ByteArray {
        return new ByteArray(length);
    }
    
    private _growIfRequired(length: number): void {
        var ipl = this._index + length;
        // double buffer capacity as needed
        while (ipl > this._buffer.byteLength) {
            this._buffer = Buffer.concat([this._buffer, Buffer.allocUnsafe(this._buffer.byteLength)]);
        }
    }
}