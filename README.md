# front2

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Caveats
- we cannot use bun to load the server because of the reliance of swc for relay compat
- reasons not to use vike :
  - too much magic
  - forces in the router
  - several wrappers around renderer fn, undocummented stream apis
