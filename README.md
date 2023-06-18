# TypeScript for Adobe AIR

Create Adobe AIR apps with the TypeScript language.

This is a work-in-progress still beginning. [Roadmap](docs/roadmap.md).

## Example

```typescript
import {Rectangle} from 'com.adobe.air/geom';
```

Blank projects will be created through `ts4air new`.

### Documentation

- [Configuration](docs/config.md)
- [Comparison to ActionScript](docs/comparison-to-actionscript.md)
- [FFI](docs/ffi.md)
- [Optimizations](docs/optimizations.md)
- [TypeScript Internals](docs/typescript-internals.md)

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
- Use `swfdump` or FFDec to get an idea of what ABC and SWF files contain.
  - http://www.swftools.org
- SWF and ABC writing
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/write.rs
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/avm2/write.rs
  - https://github.com/brion/wasm2swf
    - Output SWF based on https://github.com/brion/wasm2swf/blob/0457dc2a3d188f21446de98282a3267d381ccc10/src/wasm2swf.js#L2059