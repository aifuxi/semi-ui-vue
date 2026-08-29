# Skeleton

Skeleton shows structural placeholders while content is loading. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Skeleton } from '@workspace/ui';

const loading = shallowRef(true);
</script>

<template>
  <Skeleton :loading="loading" active>
    <template #placeholder>
      <div style="display: flex; gap: 12px">
        <Skeleton.Avatar />
        <div style="width: 240px">
          <Skeleton.Title style="width: 120px; margin-bottom: 12px" />
          <Skeleton.Paragraph :rows="3" />
        </div>
      </div>
    </template>

    <article>Loaded content</article>
  </Skeleton>
</template>
```

`loading` defaults to `true`. When explicitly set to `false`, Skeleton leaves no wrapper and renders only the default slot.

## Standalone placeholders

```vue
<div style="width: 240px; height: 120px">
  <Skeleton.Image />
</div>
<Skeleton.Avatar size="large" shape="square" />
<Skeleton.Title />
<Skeleton.Paragraph :rows="2" />
<Skeleton.Button />
```

## API

### Skeleton

| Prop                    | Description                                         | Type                    | Default |
| ----------------------- | --------------------------------------------------- | ----------------------- | ------- |
| `active`                | Enables the moving highlight animation              | `boolean`               | `false` |
| `loading`               | Shows the placeholder; false shows the default slot | `boolean`               | `true`  |
| `placeholder`           | Placeholder VNode prop; the slot is recommended     | `VNodeChild`            | —       |
| `class/className/style` | Loading-root attributes                             | matching Vue/HTML types | —       |

Slots: `#placeholder` and default. `#placeholder` takes precedence over the prop. Skeleton has no emits or `v-model`.

### Skeleton.Avatar

| Prop                    | Description              | Type                                                                                                   | Default    |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ | ---------- |
| `size`                  | Avatar placeholder size  | `'extra-extra-small' \| 'extra-small' \| 'small' \| 'default' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` |
| `shape`                 | Avatar placeholder shape | `'circle' \| 'square'`                                                                                 | `'circle'` |
| `class/className/style` | Root attributes          | matching Vue/HTML types                                                                                | —          |

`Skeleton.Image`, `Skeleton.Title`, and `Skeleton.Button` accept `class/className/style`. `Skeleton.Paragraph` additionally has `rows?: number`, defaulting to 4.

## Accessibility, theme, and SSR

- Skeleton does not impose a role or focus behaviour. If loading state must be announced, provide suitable `aria-busy` and status text on the application container.
- The default theme supplies the active animation; light/dark use `--semi-color-fill-0/1`, and RTL sets the placeholder-root direction.
- Static SSR import/render is safe. See the [alignment matrix](./alignment.md) for source evidence, DOM, animation, and visual coverage.
