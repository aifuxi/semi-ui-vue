# Pagination

Pagination navigates large data sets page by page. The pinned local Semi Design v2.102.0 source is the sole parity baseline.

## Import

```ts
import { Pagination } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/pagination.css';
```

## Basic usage

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

`total` is the item count. The page count is `Math.ceil(total / pageSize)`. When `pageSize` is omitted, the first `pageSizeOpts` value is used, then 10 as the final fallback.

## Page size and quick jump

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

A size change normally preserves the first visible item's position by recalculating the page. `prevent-page-change-on-page-size-change` keeps the page unchanged. Quick jump commits on blur or Enter and clamps values to the valid range.

## Small, disabled, and custom controls

```vue
<Pagination size="small" hover-show-page-select :total="90" />
<Pagination disabled :total="30" />

<Pagination :total="80">
  <template #prev>Previous</template>
  <template #next>Next</template>
</Pagination>
```

Small mode does not render the size selector. `hoverShowPageSelect` opens the windowed page Popover only for an enabled small Pagination.

## ConfigProvider, locale, and RTL

`ConfigProvider.locale.Pagination` supplies `pageSize`, `total`, `jumpTo`, and `page`. The built-in fallback follows `locale.code` for zh-CN/en-US. Popover and Select use the provider's stable `getPopupContainer`, which must exist before the first open.

## API

| Property                            | Description                                       | Type                       | Default                  |
| ----------------------------------- | ------------------------------------------------- | -------------------------- | ------------------------ |
| `total`                             | Total item count                                  | `number`                   | `1`                      |
| `pageSize`                          | Items per page                                    | `number`                   | `pageSizeOpts[0]` / `10` |
| `pageSizeOpts`                      | Size options                                      | `number[]`                 | `[10, 20, 40, 100]`      |
| `currentPage`                       | Controlled page                                   | `number`                   | -                        |
| `modelValue`                        | Vue `v-model` page                                | `number`                   | -                        |
| `defaultCurrentPage`                | Uncontrolled initial page                         | `number`                   | `1`                      |
| `size`                              | Size                                              | `'default'                 | 'small'`                 | `'default'` |
| `showTotal`                         | Show total pages                                  | `boolean`                  | `false`                  |
| `showSizeChanger`                   | Show the size Select                              | `boolean`                  | `false`                  |
| `showQuickJumper`                   | Show the quick-jump InputNumber                   | `boolean`                  | `false`                  |
| `hideOnSinglePage`                  | Hide for one page unless size selector is visible | `boolean`                  | `false`                  |
| `hoverShowPageSelect`               | Hover page picker in small mode                   | `boolean`                  | `false`                  |
| `disabled`                          | Disable all interactions                          | `boolean`                  | `false`                  |
| `preventPageChangeOnPageSizeChange` | Keep page when size changes                       | `boolean`                  | `false`                  |
| `prevText` / `nextText`             | Control content                                   | `VNodeChild`               | Chevron Icon             |
| `popoverPosition`                   | Popover/Select placement                          | `TooltipPosition`          | scenario/direction based |
| `popoverZIndex`                     | Overlay z-index                                   | `number`                   | `1030`                   |
| `className` / `style`               | Root styling                                      | `string` / `CSSProperties` | -                        |

Events: `pageChange(page)`, `pageSizeChange(size)`, `change(page, size)`, `update:currentPage`, `update:modelValue`, and `update:pageSize`. Slots: `#prev` and `#next`.

## React to Vue migration

| React v2.102.0                    | Vue                                            |
| --------------------------------- | ---------------------------------------------- |
| `currentPage` + `onPageChange`    | `v-model`, or `:current-page` + `@page-change` |
| `onPageSizeChange`                | `@page-size-change`                            |
| `onChange`                        | `@change`                                      |
| `prevText` / `nextText` ReactNode | same VNodeChild prop, or `#prev` / `#next`     |
| `className`                       | `class`; `className` remains compatible        |

SSR renders stable pagination DOM without a Portal. The pinned upstream leaves page-item keyboard navigation unimplemented, so Vue does not invent a different tabindex or shortcut contract; Select and InputNumber retain their own keyboard behavior.
