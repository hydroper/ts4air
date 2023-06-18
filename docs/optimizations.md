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

```typescript
let v = o instanceof RegExp ? o.source : ''; // new local for RegExp
if (v instanceof Date && v.getSeconds() > 0) {
    // new local for Date
}
```