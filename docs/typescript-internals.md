# TypeScript Internals

- Object initializer, just as in JavaScript, translates to plain objects whose constructor is `Object`, regardless of its associated type. If the object implements an interface, it is not considered an implementor anymore after translated to ABC.
- Whenever a signature type is known, output unused parameters to the ABC. This avoids bugs such as `map()` receiving a callback that accepts only one parameter (`o.map(a => v)` vs. `o.map((a, i, arr) => v)`).
- Optional parameters are optimized if their type supports a constant value and a proper default (e.g. `NaN`, `null` or `undefined`); otherwise they'll translate to an untyped parameter, which is converted to its expected type later in the same function.
- https://github.com/airsdk/Adobe-Runtime-Support/discussions/2595
  - As for FFI matters: instead of a comment, use a separate file `srcName.ffi.json` with a content like `{"Q.f": {"exportAs": "q_f"}}` and also decide how to resolve to static or instance properties in this FFI meta-data.
- The `number[]` type should not be optimized into a `Vector.<Number>`.
- `for..in` does not iterate keys from class instance properties.
- If a class duplicates a name, it should have another name, by appending a dollar sign. Loop appending different suffixes such as `$1`, `$2` or `$90` until it is not a duplicate. The global objects should be priorized, thus they should not have these suffixes.
- The target ECMAScript edition is ES5, since ES3 is deprecated.

## for...of

- `for...of` over a statically-typed `Array` should iterate the values like `for each`.
- `for...of` over an untyped value should iterate based on a map that maps constructor (`obj.constructor`) to its equivalent generator.
- `for...of` should use generator.

## Generators

- Generators are useful for iterators and `for...of`. When TypeScript emits JavaScript for an edition prior to ES2015, it emits special code instead of using `yield`; this means `ts4air` can use a similiar approach, taking care to not break the control flow graph.

## Async.

- `async`-`await` should be outputted based on what `tsc` outputs for them in the ES5 target.
- `Promise` should wrap another type, `com.asextra.util.Promise`, from the SWF of the [`actionscript-extra` project](../actionscript-extra).
  - Add `"then"`, `"catch"` and `"finally"` as keywords are available in the ABC format.

## Symbols

- Symbols may be supported by creating global static maps using `Dictionary` with _**weak keys**_.

## Control Flow Graph

- Consider, e.g., no return after `throw` in a function that doesn't return `void`.

## Built-ins

Globals should be defined in some file global.d.ts.

```typescript
declare global {
    class Array {
        // ...
    }

    // declare import.meta.embedT() methods here
    interface ImportMeta {
    }

    // declare assertion functions to use
    // from actionscript-extra.swf
}
```

Typings for globals and built-ins (including Adobe AIR API) should be included in `compilerOptions.types`: `com.adobe.air`. Globals like `Math`, `Infinity` and `isFinite()` should translate to `public::Math`, `public::Infinity` and `public::isFinite` respectively, where `public` is the global package's namespace (`namespace('packageNamespace', '')`).

Definitions inside `declare global` should be connected to their ActionScript global equivalents, with the _**only**_ exception of:

- The `ByteArray` class. It is equivalent to `flash.utils.ByteArray`.

Definitions other than `declare global` should have a suffix to not conflict with them.

## Manually Generated Globals

- `Promise`, `Map`, `WeakMap`, `Set` and `WeakSet` should be wrappers around their equivalents in `com.asextra.util`.
  - These types can use keyword in ABC; e.g. `delete`, `try` and `finally`.
  - Iterating these requires careful mapping.

## Integer types

Internal tweaks may be neccessary since there is no `int` and `uint` in TypeScript.