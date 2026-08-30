# Pagination 分页器

Pagination 用于在大量数据页之间导航。本实现只以本地 Semi Design v2.102.0 为对齐基线。

## 引入

```ts
import { Pagination } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/pagination.css';
```

## 基础用法

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';
import { Pagination } from '@aifuxi/semi-ui-vue';

const page = shallowRef(1);
</script>

<template>
  <Pagination v-model="page" :total="200" show-total />
</template>
```

`total` 是数据条数；页数按 `Math.ceil(total / pageSize)` 计算。未传 `pageSize` 时优先使用 `pageSizeOpts[0]`，最终回退到 10。

## 容量切换与快速跳页

```vue
<Pagination
  :default-current-page="5"
  :page-size-opts="[10, 20, 40, 100]"
  show-size-changer
  show-quick-jumper
  :total="300"
  @page-change="(page) => console.log(page)"
  @page-size-change="(size) => console.log(size)"
  @change="(page, size) => console.log(page, size)"
/>
```

容量变化默认按当前页第一条数据的位置重算页码。设置 `prevent-page-change-on-page-size-change` 后保留原页码。快速跳页在 blur 或 Enter 时提交，并把超出范围的值钳制到第一页或末页。

## 迷你、禁用与自定义按钮

```vue
<Pagination size="small" hover-show-page-select :total="90" />
<Pagination disabled :total="30" />

<Pagination :total="80">
  <template #prev>上一页</template>
  <template #next>下一页</template>
</Pagination>
```

small 模式不显示容量选择。`hoverShowPageSelect` 只在 small 且非 disabled 时显示窗口化页码 Popover。

## ConfigProvider、Locale 与 RTL

```vue
<ConfigProvider
  direction="rtl"
  :locale="{
    code: 'en-US',
    Pagination: {
      pageSize: 'Items per page: ${pageSize}',
      total: 'Total pages: ${total}',
      jumpTo: 'Jump to',
      page: ' page',
    },
  }"
>
  <Pagination show-size-changer show-quick-jumper :total="200" />
</ConfigProvider>
```

Popover 和 Select 使用 ConfigProvider 的稳定 `getPopupContainer`。容器应在分页器首次打开浮层前存在。

## API

| 属性                                | 说明                             | 类型                       | 默认值                   |
| ----------------------------------- | -------------------------------- | -------------------------- | ------------------------ |
| `total`                             | 数据总条数                       | `number`                   | `1`                      |
| `pageSize`                          | 每页条数                         | `number`                   | `pageSizeOpts[0]` / `10` |
| `pageSizeOpts`                      | 容量选项                         | `number[]`                 | `[10, 20, 40, 100]`      |
| `currentPage`                       | 受控当前页                       | `number`                   | -                        |
| `modelValue`                        | Vue `v-model` 当前页             | `number`                   | -                        |
| `defaultCurrentPage`                | 非受控初始页                     | `number`                   | `1`                      |
| `size`                              | 尺寸                             | `'default'                 | 'small'`                 | `'default'` |
| `showTotal`                         | 显示总页数                       | `boolean`                  | `false`                  |
| `showSizeChanger`                   | 显示容量 Select                  | `boolean`                  | `false`                  |
| `showQuickJumper`                   | 显示快速跳页 InputNumber         | `boolean`                  | `false`                  |
| `hideOnSinglePage`                  | 单页时隐藏；容量选择开启时不生效 | `boolean`                  | `false`                  |
| `hoverShowPageSelect`               | small 模式 hover 选择页码        | `boolean`                  | `false`                  |
| `disabled`                          | 禁用全部交互                     | `boolean`                  | `false`                  |
| `preventPageChangeOnPageSizeChange` | 容量变化时保留当前页             | `boolean`                  | `false`                  |
| `prevText` / `nextText`             | 前后按钮内容                     | `VNodeChild`               | Chevron Icon             |
| `popoverPosition`                   | Popover/Select placement         | `TooltipPosition`          | 按场景/方向              |
| `popoverZIndex`                     | 浮层层级                         | `number`                   | `1030`                   |
| `className` / `style`               | 根样式                           | `string` / `CSSProperties` | -                        |

事件：`pageChange(page)`、`pageSizeChange(size)`、`change(page, size)`、`update:currentPage`、`update:modelValue`、`update:pageSize`。插槽：`#prev`、`#next`。

## React → Vue 迁移

| React v2.102.0                    | Vue                                            |
| --------------------------------- | ---------------------------------------------- |
| `currentPage` + `onPageChange`    | `v-model`，或 `:current-page` + `@page-change` |
| `onPageSizeChange`                | `@page-size-change`                            |
| `onChange`                        | `@change`                                      |
| `prevText` / `nextText` ReactNode | 同名 VNodeChild prop，或 `#prev` / `#next`     |
| `className`                       | `class`；兼容 `className`                      |

SSR 会输出稳定的分页 DOM，不创建 Portal。固定上游未实现数字页键盘导航，Vue 不额外发明不同的 tabindex/快捷键契约；Select 与 InputNumber 保留各自键盘能力。
