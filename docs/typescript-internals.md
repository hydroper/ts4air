# TypeScript Internals

- Object initializer, just as in JavaScript, translates to plain objects whose constructor is `Object`, regardless of its associated type.
- Whenever a signature type is known, output unused parameters to the ABC. This avoids bugs such as `map()` receiving a callback that accepts only one parameter (`o.map(a => v)` vs. `o.map((a, i, arr) => v)`).
- Optional parameters are optimized if their type supports a constant value and a proper default (e.g. `NaN`, `null` or `undefined`); otherwise they'll translate to an untyped parameter, which is converted to its expected type later in the same function.
- https://github.com/airsdk/Adobe-Runtime-Support/discussions/2595
  - As for FFI matters: instead of a comment, use a separate file `srcName.ffi.json` (for a `srcName.ts` or `srcName.d.ts`) with a content like `{"Q.f": {"actionscript": "q.b::f"}}` and also decide how to resolve to static or instance properties in this FFI meta-data.
- The `number[]` type should not be optimized into a `Vector.<Number>`.
- `for..in` does not iterate keys from class instance properties.
- If a class duplicates a name, it should have another name, by appending a dollar sign. Loop appending different suffixes such as `$1`, `$2` or `$90` until it is not a duplicate. The global objects should be priorized, thus they should not have these suffixes.
- The target ECMAScript edition is ES5, since ES3 is deprecated.

## for...of

- `for...of` over a statically-typed `Array` should iterate the values like `for each`.
- `for...of` over an untyped value should iterate based on a map that maps constructor (`obj.constructor`) to its equivalent generator.
- `for...of` should use generator.

```ts
for (let [k, v] of new Map) {
    // optimized
}
```

## Generators

- Generators are useful for iterators and `for...of`. When TypeScript emits JavaScript for an edition prior to ES2015, it emits special code instead of using `yield`; this means `ts4air` can use a similiar approach, taking care to not break the control flow graph.

## Async.

- `async`-`await` should be outputted based on what `tsc` outputs for them in the ES5 target.
- `Promise` should wrap another type, `com.asprelude.util.Promise`, from the SWF of the [`actionscript-prelude` project](../actionscript-prelude).
  - Add `"then"`, `"catch"` and `"finally"` as keywords are available in the ABC format.

## Symbols

- Symbols won't be supported, so it must be unallowed to use the `Symbol` class, but it should be possible to define a `Symbol.iterator` iterator, which will map to the property or method `"$iterator"`.

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

Definitions inside `declare global` should be connected to their ActionScript global equivalents, with the **_only exception of_**:

- `Symbol` (inexistent)
- `Iterator` (inexistent interface)
- `IArguments` (specific to TypeScript)
- `RegExpMatches`

## Vector Types

Look at FFDec or swfdump to see what is the name of e.g. `Vector.<uint>`: is it the global `Vector$uint` or something like?

## Definition Names

Every top-level or namespace-level definition other than `declare global` will be defined in the package `$ts`, with suffix needed (e.g., `$ts.C`, `$ts.C2`... `$ts.CN`). A class that is totally defined from an external SWF can be re-used through a `yourScript.ffi.json` file.

## Manually Generated Globals

- `Promise`, `Map` and `Set` should be wrappers around their equivalents in `com.asprelude.util`.
  - These types can use keyword in ABC; e.g. `delete`, `try` and `finally`.

## for..of

For any type other than `Array`, `Map` and `Set`, `for..of` will try to:

- Resolve the `"$iterator"` method (from the `public` namespaces from top-level and `$ts` package) and iterate it by using `iterator.next()` calls (`next` is resolved as said in the following item).
- Resolve the `next` method (from the `public` namespaces from top-level and `$ts` package) and use it to iterate.

## Integer types

`int` and `uint` are declared as type aliases of `number`; however they _must_ be treated as different and output a reference to the `int` and `uint` classes respectively. If a type aliases `uint` or `int`, it must map to them as well and not `Number`.

## Byte embedding

`import.meta.embedBytes`, must output `DefineBinaryData` and `SymbolClass` tags to the SWF without conflicting with existing ones from previously merged SWFs.

## Statements

Properties (including functions) in the top-level of a source file map to top-level package properties. If a property has a non-constant initializer, its initializer should be post-poned (taking in consideration statements that execute before and after it).

## Non-null assertion

```ts
let o: number | undefined = undefined
o! // throw a ReferenceError
```

## Modules

Using `exports` might not be supported as it is not a priority.


## Unallowed

- [ ] Unallow using `Symbol` class object at runtime.
- [ ] Unallow using `Iterator` class object at runtime.
- [ ] Unallow using `IArguments` class object at runtime.
- [ ] Unallow using `RegExpMatches` class object at runtime.

## Property Overriding

- [ ] Properties that override another should contribute an assignment in the constructor after `super()` .
- [ ] Unallow overriding final methods from ActionScript virtual properties. For this, track a list of ActionScript final methods.

## Method Overriding

- [ ] Unallow overriding from ActionScript final methods. For this, track a list of ActionScript final methods.
- [ ] Overriding method from a `declare class` which has optional parameters requires restricted optional parameter values (e.g. must be constant and fit into the parameter type). A `declare class` comes from ActionScript. Otherwise, the method can use any kind of optional parameter initialiser, as it should be able to translate to something like `*`.

## Final Classes

- [ ] ActionScript has final classes that must not be extended. Unallow to extend those.

## Interfaces

Interfaces are erased in generated ABC.

- [ ] When a class implements an ActionScript interface, whether _directly_ or _indirectly_, add that interface to its list of interfaces. List of such interfaces:
  - [ ] ?