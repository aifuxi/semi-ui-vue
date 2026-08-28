# Badge 徽章

用于在头像、图标或其它内容旁展示数量、状态点和自定义标记。实现基线为 Semi Design React v2.102.0。

## 基本用法

```vue
<script setup lang="ts">
import { Avatar, Badge } from '@workspace/ui';
import '@workspace/theme-default/badge.css';
</script>

<template>
  <Badge :count="5">
    <Avatar shape="square" color="blue">BM</Avatar>
  </Badge>
  <Badge dot>
    <Avatar shape="square" color="blue">YL</Avatar>
  </Badge>
</template>
```

`dot` 与 `count` 同时存在时优先显示圆点。数字、字符串和数字 `0` 使用普通徽标样式；自定义节点使用 `#count`。

```vue
<Badge :count="120" :overflow-count="99"><Avatar>M</Avatar></Badge>
<Badge>
  <Avatar>V</Avatar>
  <template #count><strong>VIP</strong></template>
</Badge>
```

## 位置与样式

`position` 支持 `leftTop`、`leftBottom`、`rightTop`、`rightBottom`。缺省值在 LTR 中为 `rightTop`，在 RTL ConfigProvider 中为 `leftTop`。独立使用时不应用角落定位。

```vue
<Badge count="NEW" position="leftBottom" type="danger" theme="light">
  <Avatar>A</Avatar>
</Badge>
<Badge count="NEW" theme="light" />
```

## API

| 属性             | 类型            | 默认值    | 说明                                              |
| ---------------- | --------------- | --------- | ------------------------------------------------- |
| `count`          | `VNodeChild`    | -         | 徽标内容                                          |
| `dot`            | `boolean`       | `false`   | 使用状态点并隐藏 count 内容                       |
| `overflowCount`  | `number`        | -         | 数字内容的显示上限                                |
| `position`       | `BadgePosition` | 按方向    | 相对默认 slot 的四角位置                          |
| `type`           | `BadgeType`     | `primary` | 六种语义类型                                      |
| `theme`          | `BadgeTheme`    | `solid`   | `solid`、`light`、`inverted`                      |
| `className`      | Vue class       | `''`      | 外层兼容 class                                    |
| `style`          | `StyleValue`    | -         | 按上游兼容语义作用于内部徽标，优先于 `countStyle` |
| `countClassName` | Vue class       | -         | 内部徽标 class                                    |
| `countStyle`     | `StyleValue`    | -         | 内部徽标样式                                      |

Slots：`default` 为基底，`count` 为自定义徽标内容。事件：`click`、`mouseenter`、`mouseleave`，均从根节点派发原生鼠标事件。

## React → Vue

完整映射与差异说明见 [迁移说明](./react-to-vue.md)，固定源码证据与验收矩阵见 [对齐矩阵](./alignment.md)。
