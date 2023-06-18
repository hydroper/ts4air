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
  "C.f": {"actionscript": "f2"},
  "C#x": {"actionscript": "y"}
}
```

`C.f` means `f` property from `C` and `C#x` means `x` instance property from `C`. `q.b::C` is `C` in the `public` namespace of the package `q.b`.