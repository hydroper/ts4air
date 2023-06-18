# Configuration

This document gives an overview of the `ts4air.json` file. It is not neccessary to manually create it as `ts4air` does it for you.

## Apps

Typical `ts4air.json` for user-end applications.

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

## Libraries

Typical `ts4air.json` for libraries. This is reserved for writting native extensions.

```json
{
    "type": "lib"
}
```

## Load Pre-compiled ActionScript

By using [FFI meta-data](ffi.md), you can reuse ActionScript code from existing SWFs.

```json
{
    "externalActionScript": ["some.swf", "another.swf"]
}
```