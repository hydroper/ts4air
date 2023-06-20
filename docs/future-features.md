# Future features

Future features planned after finishing the tool.

## E4X operators

Support an `E4X` namespace with operation functions.

```ts
E4X.get(node, qname)
E4X.set(node, qname, v)
E4X.delete(node, qname)
E4X.has(node, qname)
E4X.filter(node, callback)
E4X.descendants(node, qname)
```