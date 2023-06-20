# TypeScript Introduction

## Byte array

```typescript
import {ByteArray} from 'com.adobe.air/util';
const ba = new ByteArray();
```

## Vector

The following are equivalent to ActionScript's `Vector`:

```typescript
import {Vector, DoubleVector, IntVector, UintVector} from 'com.adobe.air/util';
const anyVector = new Vector();
const doubles = new DoubleVector();
const ints = new IntVector();
const uints = new UintVector();
```

## Embed

```typescript
const text: string = import.meta.embedString('./data.txt');
const bytes: ByteArray = import.meta.embedBytes('./data.bin');
const obj: any = import.meta.embedJSON('./data.json');
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

## Type conversion

- If `as` is given a concrete type (ignoring type arguments), it is equivalent to ActionScript's `as`.
- TypeScript's `(v as C)!` is equivalent to ActionScript's `C(v)`.

## Assertion

Global assertion functions exist, which throw `AssertionError` on failure.

```ts
assert(false, 'Error!');
assertEq(x, y, 'Error!');
assertNeq(x, y, 'Error!');
```

## Formatting

TypeScript supports template literals:

```ts
trace(`Attribute: ${10}`);
```

`ts4air` also ships a global minimal formatting function for formatting dynamic string arguments:

```ts
minimalFormat('$a', {a: 10})
minimalFormat('$<hyphens-n_Underscores>', {'hyphens-n_Underscores': 10})
minimalFormat('$$', {})
```

## Final classes

TypeScript doesn't have final classes. You might run into issues if you extend an ActionScript class that is marked final. If necessary this tool will report an error for such cases, but I guess there are few final classes (e.g. `Number`).

## NPM

Not all packages from the NPM ecosystem may be reused because of some features, including:

- Use of features beyond ECMA-262 3rd edition, including:
  - `this` on class static method will return the class from the current class definition, not the one from the method scope itself.
- Use of Node.js `exports`. It might be supported later.
- Relying on `constructor.name`, which does not exist in ActionScript classes.
- Extending ActionScript final classes.