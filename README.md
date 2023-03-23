# TypeScript for Adobe AIR

This tool allows to write Adobe AIR apps with the TypeScript language.

Features:

- Command for managing ts4air projects, including scaffolding, compilation and more.
  - The tool includes a subcommand for running TypeDoc.

## Work in progress

This is a work-in-progress. The learning of the TypeScript Compiler API can be done by examining the following items:

- https://github.com/roblox-ts/roblox-ts
  - Build command: https://github.com/roblox-ts/roblox-ts/blob/master/src/CLI/commands/build.ts#L117
- https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
- https://github.com/microsoft/TypeScript/blob/main/src/compiler/types.ts#L2725

The SWF writting process is based on:

- https://github.com/brion/wasm2swf/blob/master/src/wasm2swf.js#L121
- https://web.archive.org/web/20211021025012/https://jmendeth.com/snapshot/4d9475cfb10af8142e331551dc9b91e1217dc8c6/media/2014-05-17-reverse-engineering-flash/avm2overview.pdf