# Spin 加载器

Spin 用于告知用户内容正在加载，且耗时暂时无法确定。本实现以本地 Semi Design v2.102.0 为唯一对齐基线。

## 基本用法

```vue
<script setup lang="ts">
import { Spin } from '@workspace/ui';
</script>

<template>
  <Spin />
</template>
```

## 尺寸与包装内容

```vue
<template>
  <Spin size="small" />
  <Spin size="middle" />
  <Spin size="large" />

  <Spin>
    <template #tip>正在加载…</template>
    <article>等待加载的内容</article>
  </Spin>
</template>
```

## 自定义指示器与延迟

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Spin } from '@workspace/ui';

const loading = shallowRef(false);
</script>

<template>
  <button @click="loading = !loading">切换</button>
  <Spin :spinning="loading" :delay="1000">
    <template #indicator><span>↻</span></template>
  </Spin>
</template>
```

`delay` 只延迟从非加载切到加载；初始 `spinning=true` 与固定 Adapter 一样立即显示。

## API

| 属性               | 类型                             | 默认值     | 说明                                |
| ------------------ | -------------------------------- | ---------- | ----------------------------------- |
| `size`             | `'small' \| 'middle' \| 'large'` | `'middle'` | 加载器尺寸                          |
| `spinning`         | `boolean`                        | `true`     | 是否加载中                          |
| `delay`            | `number`                         | `0`        | 延迟显示毫秒数                      |
| `indicator`        | `VNodeChild`                     | -          | 自定义加载指示器，推荐 `#indicator` |
| `tip`              | `VNodeChild`                     | -          | 描述内容，推荐 `#tip`               |
| `wrapperClassName` | `string`                         | -          | 根元素兼容类名                      |
| `style`            | `StyleValue`                     | -          | 根元素样式                          |
| `childStyle`       | `StyleValue`                     | -          | 内容包装样式                        |

Slots：默认 slot、`#indicator`、`#tip`。Spin 没有 emits 或 `v-model`。

## 无障碍与主题

- 固定默认 SVG 使用 `aria-hidden="true"`；如加载状态需要播报，请在业务容器提供 `aria-busy` 与状态文案。
- 颜色使用 `--semi-color-primary`，light/dark 与 RTL 由主题和 ConfigProvider 外围 class 驱动。
- 修改图标颜色时可提高 `.semi-spin-wrapper` 的 `color` 选择器权重。
