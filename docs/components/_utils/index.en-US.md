# `_utils` public utilities

`_utils` is the Vue mapping of the public infrastructure helpers from Semi v2.102.0. Utilities
are available through tree-shakable subpaths, while the package root continues to expose the same
`semiGlobal` singleton.

```ts
import {
  cloneDeep,
  getDefaultPropsFromGlobalConfig,
  getFocusableElements,
  registerMediaQuery,
  stopPropagation,
} from '@aifuxi/semi-ui-vue/_utils';
```

Key behavior:

- `cloneDeep` clones ordinary data while preserving functions, Vue VNodes, and Error instances.
- `registerMediaQuery` supports initial match/unmatch callbacks and cleanup; SSR returns a no-op.
- Focus helpers retain the pinned selector list and do not add visibility filtering.
- `getDefaultPropsFromGlobalConfig` returns a dynamic Proxy, so later `semiGlobal.config` updates
  are immediately visible.
- `runAfterTicks` delays by the requested number of macrotasks and runs immediately for non-positive
  values.

## Subpaths

- `/_utils/use-prev-focus`: readonly shallow ref plus setter, with blur on replacement/unmount.
- `/_utils/vue-render`: Vue imperative `render/unmount`, `resolveDOM`, and `getRef`.
- `/_utils/semi-global`: the exact singleton exported by ConfigProvider and the package root.

The utilities own no visual styles, and every DOM API is guarded at call time for SSR.
