# Optimizations

## Compile-time constant

The following should output a plain object, but compile-time accesses translate directly to constants.

```typescript
const Q = {
    x: 10;
};
trace(Q.x); // trace(10);
```

## Subtype

Example 1:

```typescript
let v = o instanceof RegExp ? o.source : ''; // new local for RegExp
if (v instanceof Date && v.getSeconds() > 0) {
    // new local for Date
}
```

Example 2:

```typescript
function f(a: number | string) {
    if (typeof a == 'number') {
        // new local for Number (note the "return")
        return;
    }
    // new local for String
}
```

Example 3:

```ts
try {
    //
} catch (error) {
    if (!(error instanceof ReferenceError)) {
        throw error;
    }
    // new local for ReferenceError
}
```

## Integer types

- Not sure if AVM2 does this, but if needed, convert from `number` to `uint` or `int` ahead-of-time whenever possible.