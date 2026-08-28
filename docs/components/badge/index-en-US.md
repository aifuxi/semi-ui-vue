# Badge

Badge displays a count, status dot, or custom marker next to an avatar, icon, or other content. The implementation baseline is Semi Design React v2.102.0.

## Basic usage

```vue
<script setup lang="ts">
import { Avatar, Badge } from '@workspace/ui';
import '@workspace/theme-default/badge.css';
</script>

<template>
  <Badge :count="5"><Avatar shape="square">BM</Avatar></Badge>
  <Badge dot><Avatar shape="square">YL</Avatar></Badge>
</template>
```

`dot` wins when both `dot` and `count` are present. Numbers, strings, and numeric zero use the regular count presentation. Use the `count` slot for a custom node.

```vue
<Badge :count="120" :overflow-count="99"><Avatar>M</Avatar></Badge>
<Badge>
  <Avatar>V</Avatar>
  <template #count><strong>VIP</strong></template>
</Badge>
```

## Position and appearance

`position` accepts `leftTop`, `leftBottom`, `rightTop`, and `rightBottom`. The default is `rightTop` in LTR and `leftTop` under an RTL ConfigProvider. A standalone Badge uses block positioning instead.

```vue
<Badge count="NEW" position="leftBottom" type="danger" theme="light">
  <Avatar>A</Avatar>
</Badge>
<Badge count="NEW" theme="light" />
```

## API

| Prop             | Type            | Default         | Description                                                    |
| ---------------- | --------------- | --------------- | -------------------------------------------------------------- |
| `count`          | `VNodeChild`    | -               | Badge content                                                  |
| `dot`            | `boolean`       | `false`         | Render a status dot and hide count content                     |
| `overflowCount`  | `number`        | -               | Maximum displayed numeric value                                |
| `position`       | `BadgePosition` | direction-aware | Corner relative to the default slot                            |
| `type`           | `BadgeType`     | `primary`       | Semantic type                                                  |
| `theme`          | `BadgeTheme`    | `solid`         | `solid`, `light`, or `inverted`                                |
| `className`      | Vue class       | `''`            | Compatibility class on the outer wrapper                       |
| `style`          | `StyleValue`    | -               | Compatibility style on the inner badge; wins over `countStyle` |
| `countClassName` | Vue class       | -               | Inner badge class                                              |
| `countStyle`     | `StyleValue`    | -               | Inner badge style                                              |

Slots: `default` for the base and `count` for custom badge content. Events: `click`, `mouseenter`, and `mouseleave`, each carrying the native mouse event from the root.

See [React to Vue migration](./react-to-vue.md) and the [alignment matrix](./alignment.md).
