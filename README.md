# TypeScript for Adobe AIR

Create Adobe AIR apps with the TypeScript language.

## Work in progress

This is a work-in-progress. To-do:

- [ ] Command for managing ts4air projects, including creating blank projects, compiling SWF and more.
  - [ ] Subcommand `ts4air doc` for running TypeDoc.

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