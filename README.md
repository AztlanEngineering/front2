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
- Caveats :
    - renderer is compiled on client build, should limit client build to some files, or refactor main folder with two entries. -> otherwise renderer has import not found
    - dev server and watcher not pipeing properly stdout

Changeset
- `bun changeset`
- `bun changeset version`
- `bun changeset tag`
- `bun changeset publish`
