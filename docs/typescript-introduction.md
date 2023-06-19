# TypeScript Introduction

## Byte array

```typescript
import {ByteArray} from 'com.adobe.air/util';

let ba = new ByteArray();
```

## Vector

The following are equivalent to ActionScript's `Vector`:

```typescript
import {DoubleVector, IntVector, UintVector} from 'com.adobe.air/util';

let doubles = new DoubleVector();
let ints = new IntVector();
let uints = new UintVector();
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

## Nullability

The TypeScript `!` operator can be used to assert an expression is not `undefined` or `null`. It will throw a `ReferenceError` if it fails.

## NPM

Not all packages from the NPM ecosystem may be reused because of some features, including:

- Use of features beyond ECMA-262 3rd edition
- Use of Node.js `exports`. It might be supported later.