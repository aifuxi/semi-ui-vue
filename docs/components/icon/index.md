# Icon 图标

语义化的矢量图形。实现固定对齐 Semi Design v2.102.0，并保留 `.semi-icon-*`、尺寸、旋转、动画、颜色和 SVG DOM 契约。

## 基础使用

```vue
<script setup lang="ts">
import { IconHome } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon.css';
</script>

<template>
  <IconHome aria-label="首页" />
</template>
```

## 旋转、动画与尺寸

```vue
<script setup lang="ts">
import { IconEmoji, IconHome, IconSpin } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <IconHome size="small" />
  <IconEmoji :rotate="180" />
  <IconSpin spin />
</template>
```

支持 `extra-small`（8px）、`small`（12px）、`default`（16px）、`large`（20px）、`extra-large`（24px）和继承上下文字号的 `inherit`。

## 颜色与 AI 多色图标

单色图标继承 CSS `color`。AI 双色、四色图标可用 `fill` 传入一个颜色或颜色数组。

```vue
<script setup lang="ts">
import { IconAIFilledLevel2, IconAIWandLevel3, IconLikeHeart } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <IconLikeHeart size="extra-large" style="color: #e91e63" />
  <IconAIFilledLevel2 fill="var(--semi-color-success)" size="extra-large" />
  <IconAIWandLevel3 :fill="['#f93920', '#15c39a', '#0064fa', '#ffb219']" size="extra-large" />
</template>
```

## Lab 彩色图标

```vue
<script setup lang="ts">
import { IconAvatar, IconCard } from '@aifuxi/semi-icons-lab-vue';
</script>

<template>
  <IconAvatar size="extra-large" aria-label="头像" />
  <IconCard size="extra-large" aria-label="卡片" />
</template>
```

Lab 图标使用固定颜色，不支持通过 `fill` 改色。

## 自定义图标

```vue
<script setup lang="ts">
import Icon from '@aifuxi/semi-icons-vue';
</script>

<template>
  <Icon type="custom-avatar" :rotate="180" aria-label="自定义头像">
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
    </svg>
  </Icon>
</template>
```

## API

| 属性        | 类型                 | 默认值    | 说明                           |
| ----------- | -------------------- | --------- | ------------------------------ |
| `fill`      | `string \| string[]` | -         | 稳定 AI 双色/多色图标填充色    |
| `prefixCls` | `string`             | `semi`    | class 前缀                     |
| `rotate`    | `number`             | -         | 旋转角度，仅 safe integer 生效 |
| `size`      | `IconSize`           | `default` | 图标尺寸                       |
| `spin`      | `boolean`            | `false`   | 是否持续旋转                   |
| `type`      | `string`             | -         | 类型 class 与默认无障碍名称    |

| 插槽      | 说明            |
| --------- | --------------- |
| `default` | 自定义 SVG 内容 |

## React→Vue 迁移

| React                                                 | Vue                            |
| ----------------------------------------------------- | ------------------------------ |
| `<Icon svg={<CustomIcon />} />`                       | `<Icon><CustomIcon /></Icon>`  |
| `className`                                           | `class`                        |
| `ref<HTMLSpanElement>`                                | 组件 ref 的 `element` 只读引用 |
| 其余 `size / spin / rotate / fill / prefixCls / type` | 保留同名 prop                  |
