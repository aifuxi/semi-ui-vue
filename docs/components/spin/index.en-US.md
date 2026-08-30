# Spin

Spin informs users that content is loading for an uncertain amount of time. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Spin } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Spin />
</template>
```

## Sizes and wrapped content

```vue
<template>
  <Spin size="small" />
  <Spin size="middle" />
  <Spin size="large" />

  <Spin>
    <template #tip>Loading…</template>
    <article>Content being loaded</article>
  </Spin>
</template>
```

## Custom indicator and delay

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Spin } from '@aifuxi/semi-ui-vue';

const loading = shallowRef(false);
</script>

<template>
  <button @click="loading = !loading">Toggle</button>
  <Spin :spinning="loading" :delay="1000">
    <template #indicator><span>↻</span></template>
  </Spin>
</template>
```

`delay` only delays a transition from idle to loading. An initially true `spinning` value is shown immediately, matching the pinned Adapter.

## API

| Property           | Type                             | Default    | Description                           |
| ------------------ | -------------------------------- | ---------- | ------------------------------------- |
| `size`             | `'small' \| 'middle' \| 'large'` | `'middle'` | Indicator size                        |
| `spinning`         | `boolean`                        | `true`     | Whether loading is active             |
| `delay`            | `number`                         | `0`        | Delay before showing, in milliseconds |
| `indicator`        | `VNodeChild`                     | -          | Custom indicator; prefer `#indicator` |
| `tip`              | `VNodeChild`                     | -          | Description content; prefer `#tip`    |
| `wrapperClassName` | `string`                         | -          | Compatibility class on the root       |
| `style`            | `StyleValue`                     | -          | Root style                            |
| `childStyle`       | `StyleValue`                     | -          | Wrapped-content style                 |

Slots: default, `#indicator`, and `#tip`. Spin has no emits or `v-model`.

## Accessibility and theme

- The pinned default SVG has `aria-hidden="true"`. Add `aria-busy` and status text to the application container when loading must be announced.
- Color comes from `--semi-color-primary`; light/dark and RTL follow the surrounding theme and ConfigProvider classes.
- Override `.semi-spin-wrapper` with a higher-specificity `color` rule to customize the icon color.
