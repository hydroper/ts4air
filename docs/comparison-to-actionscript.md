# Comparison to ActionScript

## Byte array

`ByteArray` is global:

```typescript
// do not import
// import {ByteArray} from 'com.adobe.air/util';

let ba = new ByteArray();
```

## Vector

The following are equivalent to `Vector`:

```typescript
let doubles = new DoubleArray();
let ints = new IntArray();
let uints = new UintArray();
```

## Embed

```typescript
let dataText: string = import.meta.embedString('./data.txt');
let byteArray: ByteArray = import.meta.embedBytes('./data.bin');
```

## Bound Methods

TypeScript under `ts4air` inherits ActionScript's bound methods, therefore there is no need for `o.f.bind(o)`.