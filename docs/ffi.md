# FFI

A TypeScript source can have FFI meta-data attached to it. Here is an example:

`program.ts`

```typescript
export declare class C {
    public x: number;

    public static f(): void;
}
```

`program.ffi.json`

```json
{
    "C": {"actionscript": "q.b::C"},
    "foo.C": {"actionscript": "q.b::C2"},
    "C.f": {},
    "C#x": {}
}
```

`C.f` means `f` property from `C` and `C#x` means `x` instance property from `C`. `q.b::C` is `C` in the `public` namespace of the package `q.b`.

The `"actionscript"` property is used to map a TypeScript class to an existing ActionScript class.