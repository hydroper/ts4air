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
let doubles = new Float64Array();
doubles.push(10);
let ints = new Int32Array();
let uints = new Uint32Array();
```

## Embed

```typescript
let dataText: string = import.meta.embedString('./data.txt');
let byteArray: ByteArray = import.meta.embedBytes('./data.bin');
```

## Bound Methods

TypeScript under `ts4air` inherits ActionScript's bound methods, therefore there is no need for `o.f.bind(o)`.

## Symbol

It is possible to define a custom iterator with `Symbol.iterator`, but using the ES2015 symbol type isn't supported.

## BigInt

The ES2015 bigint type isn't supported.

## Callbacks

In ActionScript, omitting parameters in a callback causes a runtime error without compile-time advice. In TypeScript under `ts4air`, parameters should be created automatically if possible (e.g. for a typed lambda).

## Reflection

- `for..in` does not iterate keys from, for example, instance properties, but it does still iterate plain object keys.