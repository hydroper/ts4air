# Configuration

This document gives an overview of the `ts4air` field of the `package.json` file. It is not neccessary to manually create it as `ts4air new` does it for you.

## Apps

Typical `ts4air` field for user-end applications.

```json
{
  "ts4air": {
    "type": "app",
    "swf": {
      "path": "target/my-app.swf",
      "framerate": 60,
      "width": 1350,
      "height": 700,
      "background": "#333"
    }
  }
}
```

## Libraries

Typical `ts4air` field for libraries. This is reserved for writting native extensions.

```json
{
  "ts4air": {
    "type": "lib"
  }
}
```

## Load Pre-compiled ActionScript

By using [FFI meta-data](ffi.md), you can reuse ActionScript code from existing SWFs.

```json
{
  "ts4air": {
    "externalActionScript": ["some.swf", "another.swf"]
  }
}
```