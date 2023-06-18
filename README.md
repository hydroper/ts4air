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

## Overview

```typescript
import {Rectangle} from 'com.adobe.air/geom';
```

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

### Documentation

- [Optimizations](docs/optimizations.md)
- [Built-ins](docs/builtins.md)
- [FFI](docs/ffi.md)
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
- Use `swfdump` or FFDec to examine ABC and SWF.
  - http://www.swftools.org
- SWF and ABC writing
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/write.rs
  - https://github.com/ruffle-rs/ruffle/blob/master/swf/src/avm2/write.rs
  - https://github.com/brion/wasm2swf
    - Output SWF based on https://github.com/brion/wasm2swf/blob/0457dc2a3d188f21446de98282a3267d381ccc10/src/wasm2swf.js#L2059