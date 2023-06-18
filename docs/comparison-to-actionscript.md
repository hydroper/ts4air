# Comparison to ActionScript

## Byte array

The `ByteArray` type is global:

```typescript
// do not import
// import {ByteArray} from 'com.adobe.air/util';

let ba = new ByteArray();
```

## Vector

Types similiar to JavaScript's typed arrays are present globally, however they are exactly vector types.

```typescript
let doubles = new Float64Array();
doubles.push(10);

let ints = new Int32Array();

let uints = new Uint32Array();
```

## Embed

```typescript
// UTF-8
let dataText: string = import.meta.embedString('./data.txt');

// Octets
let byteArray: ByteArray = import.meta.embedBytes('./data.bin');
```

## Bound Methods

TypeScript, in the case of TS4AIR, supports implicit bound methods just like ActionScript.