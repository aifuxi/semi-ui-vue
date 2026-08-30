# Progress

Progress displays the current completion of an operation or task. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <div style="width: 240px">
    <Progress :percent="50" aria-label="File download progress" />
    <Progress :percent="80" show-info size="large" aria-label="File download progress" />
  </div>
</template>
```

## Vertical and circular

```vue
<div style="height: 100px">
  <Progress :percent="60" direction="vertical" aria-label="Disk usage" />
</div>

<Progress :percent="75" type="circle" show-info :width="100" aria-label="Disk usage">
  <template #format="{ percent }">{{ percent }} days</template>
</Progress>
```

## Custom colours

```vue
<script setup lang="ts">
const stroke = [
  { percent: 0, color: '#f93920' },
  { percent: 50, color: '#46259e' },
  { percent: 100, color: 'hsla(125, 50%, 46% / 1)' },
];
</script>

<template>
  <Progress :percent="65" :stroke="stroke" stroke-gradient show-info type="circle" />
</template>
```

## API

| Prop                                        | Description                                                                                | Type                              | Default              |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------- | -------------------- |
| `percent`                                   | Completion percentage; rendering clamps it to 0–100                                        | `number`                          | `0`                  |
| `type`                                      | Shape                                                                                      | `'line' \| 'circle'`              | `'line'`             |
| `direction`                                 | Line direction                                                                             | `'horizontal' \| 'vertical'`      | `'horizontal'`       |
| `size`                                      | Size                                                                                       | `'default' \| 'small' \| 'large'` | `'default'`          |
| `showInfo`                                  | Shows percentage text; small circles suppress it                                           | `boolean`                         | `false`              |
| `format`                                    | Formats the displayed text                                                                 | `(percent: number) => VNodeChild` | `` `${percent}%` ``  |
| `motion`                                    | Enables the 300ms number animation; object/function forms preserve migration compatibility | `boolean \| object \| function`   | `true`               |
| `stroke`                                    | Progress colour or colour stops                                                            | `string \| ProgressStrokePoint[]` | CSS Token            |
| `strokeGradient`                            | Interpolates between colour stops                                                          | `boolean`                         | `false`              |
| `orbitStroke`                               | Track colour                                                                               | `string`                          | CSS Token            |
| `strokeLinecap`                             | Circle line cap                                                                            | `'round' \| 'square'`             | `'round'`            |
| `strokeWidth`                               | Circle stroke width                                                                        | `number`                          | `4`                  |
| `width`                                     | Circle width and height                                                                    | `number`                          | default 72; small 24 |
| `id/class/className/style`                  | Root attributes                                                                            | matching Vue/HTML types           | —                    |
| `aria-label/aria-labelledby/aria-valuetext` | Accessible progress description                                                            | `string`                          | —                    |

Slot: `#format="{ percent }"`, which takes precedence over the function prop. Progress has no emits or `v-model`.

## Accessibility, theme, and SSR

- The root has `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, and a clamped `aria-valuenow`.
- Progress creates no keyboard or focus interaction. Describe its meaning with `aria-label` or `aria-labelledby`.
- The default theme supplies light/dark tokens; RTL mirrors line-text spacing and circle-text positioning.
- Static SSR import/render is safe. See the [alignment matrix](./alignment.md) for source evidence, animation, and visual coverage.
