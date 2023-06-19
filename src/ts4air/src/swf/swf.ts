import ByteArray from 'com.hydroper.util.nodejsbytearray';

export type Swf = {
    version: number,
    fileLength: { compressed: number, uncompressed: number },
    frameSize: { width: number, height: number },
    frameRate: number,
    frameCount: number,
    backgroundColor: string,
    fileAttributes: {
        useNetwork: boolean,
        as3: boolean,
        hasMetaData: boolean,
        useGPU: boolean,
        useDirectBlit,
    },
    metadata: string,
    tags: SwfTag[],
};

// For tag data:
// https://github.com/rafaeldias/swf-reader/blob/master/index.js#L30

export type SwfTag = {
    code: number,
    length: number,

    data?: Buffer,

    /**
     * Used by SymbolClass.
     */
    numSymbols?: number,

    /**
     * Used by SymbolClass.
     */
    symbols?: ({id: number, name: string})[],
};

export type SwfBinaryData = {
    tag: number,
    data: ByteArray,
};

export type SwfDoABC = {
    flags: number,
    name: string,
    data: ByteArray,
};