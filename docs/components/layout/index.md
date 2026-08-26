# Layout 布局

用于快速划分页面整体结构。实现基线为 Semi Design v2.102.0，并保留 `.semi-layout*` 与 `--semi-*` 样式兼容契约。

## 引入

```ts
import { Layout, LayoutHeader, LayoutContent, LayoutFooter, LayoutSider } from '@workspace/ui';
import '@workspace/theme-default/layout.css';
```

## 三行布局

```vue
<template>
  <Layout>
    <LayoutHeader>Header</LayoutHeader>
    <LayoutContent>Content</LayoutContent>
    <LayoutFooter>Footer</LayoutFooter>
  </Layout>
</template>
```

## 侧边栏与嵌套布局

```vue
<template>
  <Layout>
    <LayoutSider style="width: 120px">Sider</LayoutSider>
    <Layout>
      <LayoutHeader>Header</LayoutHeader>
      <LayoutContent>Content</LayoutContent>
      <LayoutFooter>Footer</LayoutFooter>
    </Layout>
  </Layout>
</template>
```

直接或嵌套 Sider 会让最近的 Layout 增加 `semi-layout-has-sider`。SSR 时可显式传入 `has-sider`，确保无法从动态 slot 判断结构时也不会闪动。

## 响应式 Sider

```vue
<script setup lang="ts">
import type { LayoutBreakpoint } from '@workspace/ui';

function handleBreakpoint(screen: LayoutBreakpoint, match: boolean) {
  console.log(screen, match);
}
</script>

<template>
  <Layout>
    <LayoutSider :breakpoint="['xs', 'md']" @breakpoint="handleBreakpoint"> Sider </LayoutSider>
    <LayoutContent>Content</LayoutContent>
  </Layout>
</template>
```

## API

### Layout

| 属性        | 类型                          | 默认值        | 说明                             |
| ----------- | ----------------------------- | ------------- | -------------------------------- |
| `prefixCls` | `string`                      | `semi-layout` | class 前缀                       |
| `hasSider`  | `boolean`                     | -             | 提前声明子树含 Sider，常用于 SSR |
| `tagName`   | `keyof HTMLElementTagNameMap` | `section`     | 根语义标签                       |

### LayoutHeader / LayoutContent / LayoutFooter

| 属性        | 类型                          | 默认值               | 说明       |
| ----------- | ----------------------------- | -------------------- | ---------- |
| `prefixCls` | `string`                      | `semi-layout`        | class 前缀 |
| `tagName`   | `keyof HTMLElementTagNameMap` | `header/main/footer` | 根语义标签 |

### LayoutSider

| 属性         | 类型                 | 默认值        | 说明               |
| ------------ | -------------------- | ------------- | ------------------ |
| `prefixCls`  | `string`             | `semi-layout` | class 前缀         |
| `breakpoint` | `LayoutBreakpoint[]` | `[]`          | 要监听的响应式断点 |

| 事件         | 参数              | 说明                         |
| ------------ | ----------------- | ---------------------------- |
| `breakpoint` | `(screen, match)` | 初始匹配和媒体查询变化时触发 |

全部组件使用默认 slot。Layout 和三个分区接受原生 class、style、role、aria、data 与事件 attrs；Sider 与固定 Adapter 一致，只透传 class、style、`aria-label` 和 `data-*`。

## React → Vue 迁移

| React             | Vue                      |
| ----------------- | ------------------------ |
| `Layout.Header`   | `LayoutHeader`           |
| `Layout.Content`  | `LayoutContent`          |
| `Layout.Footer`   | `LayoutFooter`           |
| `Layout.Sider`    | `LayoutSider`            |
| `children`        | 默认 slot                |
| `className/style` | 原生 `class/style` attrs |
| `onBreakpoint`    | `@breakpoint`            |
| React ref         | Vue template ref         |

`Layout.Header/Content/Footer/Sider` 静态成员也保留在脚本导出对象上，但 Vue 模板推荐使用具名组件。
