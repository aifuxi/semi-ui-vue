# Illustrations

`@workspace/illustrations` converts all 16 public illustrations from pinned Semi Design v2.102.0 into Vue 3 components while preserving multicolor SVG markup, theme tokens, masks, clip paths, and the default 200×200 canvas.

## Import

```vue
<script setup lang="ts">
import { IllustrationNoContent, IllustrationNoContentDark } from '@workspace/illustrations';
</script>

<template>
  <IllustrationNoContent :style="{ width: '150px', height: '150px' }" />
  <IllustrationNoContentDark :style="{ width: '150px', height: '150px' }" />
</template>
```

Each illustration also has a tree-shakeable subpath:

```ts
import IllustrationNoContent from '@workspace/illustrations/illustrations/IllustrationNoContent';
```

The public pairs are Construction, Failure, Idle, NoAccess, NoContent, NoResult, NotFound, and Success, each with a `Dark` variant.

Vue-native `class`, `style`, `aria-*`, `data-*`, and DOM listeners fall through to the root SVG. The default `focusable="false"` and `aria-hidden="true"` values can be overridden explicitly.

See the [alignment matrix](./alignment.md) for source and visual evidence and [React → Vue](./react-to-vue.md) for migration details.
