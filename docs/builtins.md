# Built-ins

Globals should be defined in some file global.d.ts.

```typescript
declare global {
    class Array {
        // ...
    }
}
```

Typings for globals and built-ins (including Adobe AIR API) should be included in `compilerOptions.types`: `com.adobe.air`. Globals like `Math`, `Infinity` and `isFinite()` should translate to `public::Math`, `public::Infinity` and `public::isFinite` respectively, where `public` is the global package's namespace (`namespace('packageNamespace', '')`).

Definitions inside `declare global` should be connected to their ActionScript global equivalents. Definitions elsewhere should have a suffix to not conflict with them.