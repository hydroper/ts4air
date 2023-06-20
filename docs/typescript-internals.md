# TypeScript Internals

- Object initializer, just as in JavaScript, translates to plain objects whose constructor is `Object`, regardless of its associated type. If the object implements an interface, it is not considered an implementor anymore after translated to ABC.
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

Internal tweaks may be neccessary since there is no `int` and `uint` in TypeScript.

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

## Multiple signature functions

- [ ] When a method of an interface has multiple signatures, it translates to `function(...rest)`.
- [ ] When a method of a class is the implementor of an interface's method with multiple signatures, it translates to `function(...rest)`.

Example:

```ts
interface IFoo {
    f(n: number): void
    f(s: string): void
}

class C implements IFoo {
    f(r: RegExp) {}
}

new C().f(/(?:)/)
```

## Property Overriding

- [ ] Properties that override another should contribute an assignment in the constructor after `super()` .

## Method Overriding

- [ ] Overriding method from a `declare class` may require mapping `number` type to `uint` or `int` depending on which ActionScript method it is (and outputting any default parameter values converting from `number` to `uint` or `int` before writting to ABC). We can do that by simply checking for specific TypeScript methods, but currently I don't know of any cases for now.
  - [ ] Remember that an overrider may override another overrider, so do that transformation recursively.
- [ ] Overriding method from a `declare class` which has optional parameters requires restricted optional parameter values (e.g. must be constant and fit into the parameter type). A `declare class` comes from ActionScript. Otherwise, the method can use any kind of optional parameter initialiser, as it should be able to translate to something like `*`.

## Final Classes

- [ ] ActionScript has final classes that must not be extended. Unallow to extend those.

## Implementing interface's fields and methods in different ways

Consider the following example:

```ts
interface I {
    get x(): number;
}

class C implements I {
    x: number = 10;
}
```

Another example:

```ts
interface I {
    x: number;
}

class C implements I {
    get x(): number { return 10 }
}
```

Another example:

```ts
interface I {
    x: () => number;
}

class C implements I {
    x() {return 10}
}
```

These are all valid TypeScript programs. This will be complex to handle, so `ts4air` won't allow some forms of this for now.

- [ ] Allow implementing a virtual property as a field, as in the first example. The reverse should also be possible.
- [ ] Unallow implementing a specific property from an interface in another form (e.g., a field cannot be implemented as a method)