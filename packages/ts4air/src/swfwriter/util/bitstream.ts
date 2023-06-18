// based on https://github.com/brion/wasm2swf/blob/master/src/utils.js.
import ByteArray from 'com.hydroper.util.nodejsbytearray';

export default class BitStream {
    private _bytes: ByteArray = new ByteArray();
    private accumulator: number = 0;
    private nbits: number = 0;

    constructor() {
        this._bytes.endian = 'littleEndian';
    }

    toBytes(): ByteArray {
        this.flush();
        return ByteArray.from(this._bytes);
    }

    flush() {
        if (this.nbits > 0) {
            this._bytes.writeByte(this.accumulator);
            this.nbits = 0;
            this.accumulator = 0;
        }
    }

    bit(val: number) {
        let bit = val & 1;
        this.accumulator |= bit << (7 - this.nbits);
        if (++this.nbits == 8) {
            this.flush();
        }
    }

    bits(val: number, nbits: number) {
        for (let i = 0; i < nbits; ++i) {
            this.bit((val >> (nbits - 1 - i)) & 1);
        }
    }

    ub(val: number, nbits: number) {
        this.bits(val, nbits);
    }

    sb(val: number, nbits: number) {
        this.bits(val, nbits);
    }

    fb(val: number, nbits: number) {
        this.sb(Math.round(val * 65536), nbits);
    }
}