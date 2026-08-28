# Illustrations 插画

`@workspace/illustrations` 将固定 Semi Design v2.102.0 的全部 16 个公开插画转换为 Vue 3 组件，保留原始多色 SVG、主题 Token、mask、clipPath 和 200×200 默认画布。

## 引入

```vue
<script setup lang="ts">
import { IllustrationNoContent, IllustrationNoContentDark } from '@workspace/illustrations';
</script>

<template>
  <IllustrationNoContent :style="{ width: '150px', height: '150px' }" />
  <IllustrationNoContentDark :style="{ width: '150px', height: '150px' }" />
</template>
```

也可以使用逐插画子路径：

```ts
import IllustrationNoContent from '@workspace/illustrations/illustrations/IllustrationNoContent';
```

## 公开插画

- `IllustrationConstruction` / `IllustrationConstructionDark`
- `IllustrationFailure` / `IllustrationFailureDark`
- `IllustrationIdle` / `IllustrationIdleDark`
- `IllustrationNoAccess` / `IllustrationNoAccessDark`
- `IllustrationNoContent` / `IllustrationNoContentDark`
- `IllustrationNoResult` / `IllustrationNoResultDark`
- `IllustrationNotFound` / `IllustrationNotFoundDark`
- `IllustrationSuccess` / `IllustrationSuccessDark`

所有组件都把 Vue 原生 `class`、`style`、`aria-*`、`data-*` 和 DOM 监听器透传到根 SVG。默认包含 `focusable="false"` 和 `aria-hidden="true"`；显式 attrs 可以覆盖默认值。

完整源码和视觉证据见[对齐矩阵](./alignment.md)，React 迁移方式见 [React → Vue](./react-to-vue.md)。
