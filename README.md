# TypeScript for Adobe AIR

Create Adobe AIR apps with the TypeScript language.

## Work in progress

This is a work-in-progress. To-do:

- [ ] ts4air.json
- [ ] TypeScript transformer
- [ ] `ts4air` command
  - [ ] `ts4air new --app`: Create new application project
  - [ ] `ts4air new --lib`: Create new library
  - [ ] When creating new projects, create a conventional `tsconfig.json` with best pratices, such as `"noFallthroughCasesInSwitch": true` and strict nullability checks.
  - [ ] `ts4air ts2swf`
  - [ ] `ts4air ts2abc`
  - [ ] `ts4air doc` for running TypeDoc.

#### ts4air.json

There should be a command to create new projects, but the settings file for `ts4air`
should also be documented. It should be similiar to the `asconfigc` tool by Josh Tynjala.

Support something in the form:

```json
{
  "type": "app",
  "swf": {
    "path": "target/my-app.swf",
    "framerate": 60,
    "width": 1350,
    "height": 700
  }
}
```

## TypeScript Plans

- Object initializer, just as in JavaScript, translates to plain objects whose constructor is `Object`, regardless of its associated type. If the object implements an interface, it is not considered an implementor anymore after translated to ABC.
- Whenever a signature type is known, output unused parameters to the ABC. This avoids bugs such as `map()` receiving a callback that accepts only one parameter (`o.map(a => v)` vs. `o.map((a, i, arr) => v)`).
- Optional parameters must have a type that supports a constant value. The default value should be handled in different ways: if it is a non-constant value, it is assigned later in the method body. If the optional parameter's type has a non-ideal default constant value, e.g. `boolean`, it should be unsupported. For `number`, a `NaN` will be used as the initial constant value.
- https://github.com/airsdk/Adobe-Runtime-Support/discussions/2595
  - As for FFI matters: instead of a comment, use a separate file `srcName.ffi.json` with a content like `{"Q.f": {"exportAs": "q_f"}}` and also decide how to resolve to static or instance properties in this FFI meta-data.
- The `number[]` type should not be optimized into a `Vector.<Number>`.
- `for..in` does not iterate keys from class instance properties.
- If a class duplicates a name, it should have another name, by appending a dollar sign. Loop appending different suffixes such as `$1`, `$2` or `$90` until it is not a duplicate. The global objects should be priorized, thus they should not have these suffixes.

## ABC generation

- Control flow graph: consider, e.g., no return after `throw` in a function that doesn't return `void`.

## Research

- [AVM2 Overview](https://web.archive.org/web/20211021025012/https://jmendeth.com/snapshot/4d9475cfb10af8142e331551dc9b91e1217dc8c6/media/2014-05-17-reverse-engineering-flash/avm2overview.pdf)
- [AS3 Specification](research/ActionScript%203%20Language%20Specification.pdf)
- [ECMA-262](research/ECMA-262_3rd_edition_december_1999.pdf)
- [ECMA-357](research/ECMA-357_2nd_edition_december_2005.pdf)
- [SWF Specification](research/swf-spec-19.pdf)
- TypeScript Compiler API
  - https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
  - https://github.com/microsoft/TypeScript/blob/7c14aff09383f3814d7aae1406b5b2707b72b479/lib/typescript.d.ts#L78
    - Symbols are mixed with nodes.
- Use `swfdump` or FFDec to examine ABC and SWF.
  - http://www.swftools.org
- SWF and ABC writing
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/write.rs
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/avm2/write.rs
  - https://github.com/brion/wasm2swf
    - Output SWF based on https://github.com/brion/wasm2swf/blob/0457dc2a3d188f21446de98282a3267d381ccc10/src/wasm2swf.js#L2059