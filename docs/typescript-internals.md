# TypeScript Internals

- Object initializer, just as in JavaScript, translates to plain objects whose constructor is `Object`, regardless of its associated type. If the object implements an interface, it is not considered an implementor anymore after translated to ABC.
- Whenever a signature type is known, output unused parameters to the ABC. This avoids bugs such as `map()` receiving a callback that accepts only one parameter (`o.map(a => v)` vs. `o.map((a, i, arr) => v)`).
- Optional parameters are optimized if their type supports a constant value and a proper default (e.g. `NaN`, `null` or `undefined`); otherwise they'll translate to an untyped parameter, which is converted to its expected type later in the same function.
- https://github.com/airsdk/Adobe-Runtime-Support/discussions/2595
  - As for FFI matters: instead of a comment, use a separate file `srcName.ffi.json` with a content like `{"Q.f": {"exportAs": "q_f"}}` and also decide how to resolve to static or instance properties in this FFI meta-data.
- The `number[]` type should not be optimized into a `Vector.<Number>`.
- `for..in` does not iterate keys from class instance properties.
- If a class duplicates a name, it should have another name, by appending a dollar sign. Loop appending different suffixes such as `$1`, `$2` or `$90` until it is not a duplicate. The global objects should be priorized, thus they should not have these suffixes.

## Control Flow Graph

- Consider, e.g., no return after `throw` in a function that doesn't return `void`.