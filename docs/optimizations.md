# Optimizations

## Compile-time constant

The following should output a plain object, but compile-time accesses translate directly to constants.

```typescript
const Q = {
    x: 10;
};
trace(Q.x); // trace(10);
```