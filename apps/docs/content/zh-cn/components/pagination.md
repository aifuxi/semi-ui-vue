---
title: '翻页器'
description: '分页器帮助用户在多个页之间进行导航'
locale: 'zh-CN'
slug: 'pagination'
category: 'navigation'
order: 58
englishTitle: 'Pagination'
icon: 'doc-pagination'
upstream: 'navigation/pagination'
---

## 代码演示

### 如何引入

```ts
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
```

### 基本

基础分页，通过 `total` 设置总条数，`pageSize` 设置每页容量

::demo-block{demo="pagination/zh-cn/Basic" title="基本"}
::

### 禁用

通过 `disabled` 设置禁用

::demo-block{demo="pagination/zh-cn/Disabled" title="禁用"}
::

### 总页数显示

通过 `showTotal` 属性控制是否展示总页数

::demo-block{demo="pagination/zh-cn/Total" title="总页数显示"}
::

### 指定当前页码

可以通过 `defaultCurrentPage` 指定当前激活的页码

::demo-block{demo="pagination/zh-cn/DefaultPage" title="指定当前页码"}
::

### 每页容量切换

通过设置 `showSizeChanger` 为 `true`，允许通过 Select 组件快速切换每页容量

::demo-block{demo="pagination/zh-cn/SizeChanger" title="每页容量切换"}
::

### 快速跳转至某页

通过设置 `showQuickJumper` 为 `true`, 允许通过Input控件输入页码，快速跳转  
当Input失去焦点时，若Input中为有效数字，会直接进行跳转。你亦可在Input聚焦时，输入期望跳转的页码后直接敲击回车进行跳转  
若你输入页码大于分页器总页数，我们会自动为你跳转至最后一页  
showQuickJumper于 v1.31后提供

::demo-block{demo="pagination/zh-cn/QuickJumper" title="快速跳转至某页"}
::

### 页码受控

传入 `currentPage` 后，分页器即为受控组件，一般配合 `@page-change` 使用，也可使用 `v-model:current-page`。当前激活页码完全取决于传入的 `currentPage`的 值

::demo-block{demo="pagination/zh-cn/Controlled" title="页码受控"}
::

### 预设每页容量可选值

传入 `pageSizeOpts` 数组，指定切换每页容量的可选值

::demo-block{demo="pagination/zh-cn/PageSizeOptions" title="预设每页容量可选值"}
::

### 迷你版本

`size` 设置为 `small`

::demo-block{demo="pagination/zh-cn/Mini" title="迷你版本"}
::

开启 hoverShowPageSelect，可以 hover 页码快速切换（v1.27.0后提供）

::demo-block{demo="pagination/zh-cn/MiniSelect" title="迷你版本"}
::

## API 参考

| 属性                              | 说明                                                                                                                                                            | 类型                                            | 默认值              | 版本   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------- | ------ |
| class                             | 类名                                                                                                                                                            | string                                          |                     |
| currentPage                       | 当前页码                                                                                                                                                        | number                                          |                     |
| defaultCurrentPage                | 默认的当前页码                                                                                                                                                  | number                                          |                     |
| disabled                          | 禁用                                                                                                                                                            | boolean                                         | false               | 2.37.0 |
| hideOnSinglePage                  | 总页数小于 2 时，是否自动隐藏分页器，当 showSizeChanger 为true时，此开关不再生效                                                                                | boolean                                         | false               |
| hoverShowPageSelect               | hover 页码时是否展示切换页数的Select控件，仅当 size = 'small'时生效                                                                                             | boolean                                         | false               | 1.27.0 |
| nextText                          | 下一页文本                                                                                                                                                      | string\|VNodeChild                              |                     |
| pageSize                          | 每页条数                                                                                                                                                        | number                                          | 10                  |
| pageSizeOpts                      | 指定每页显示多少条                                                                                                                                              | array                                           | \[10, 20, 40, 100\] |
| popoverPosition                   | 浮层方向，具体可见 [Popover·API 参考·position](/zh-cn/components/popover/#api)                                                                                  | string                                          | "bottomLeft"        |
| popoverZIndex                     | 浮层 z-index 值                                                                                                                                                 | number                                          | 1030                |
| prevText                          | 上一页文本                                                                                                                                                      | string\|VNodeChild                              |                     |
| preventPageChangeOnPageSizeChange | 切换 pageSize 时是否阻止自动调整 currentPage。默认情况下，切换 pageSize 时组件会自动计算新的 currentPage 以保持当前数据位置，设为 true 后由用户自行控制页码变化 | boolean                                         | false               | -      |
| style                             | 样式                                                                                                                                                            | object                                          |                     |
| size                              | 尺寸                                                                                                                                                            | string                                          |                     |
| showTotal                         | 是否显示总页数                                                                                                                                                  | boolean                                         |                     |
| showSizeChanger                   | 是否显示切换页容量的 Select，size为small时不生效                                                                                                                | boolean                                         | false               |
| showQuickJumper                   | 是否显示切换页码的 Input                                                                                                                                        | boolean                                         | false               | 1.31.0 |
| total                             | 总条数                                                                                                                                                          | number                                          | 1                   |
| @change                           | 页码、每页容量变化时的回调函数                                                                                                                                  | function(currentPage: number, pageSize: number) |                     |
| @page-change                      | 页码变化的回调函数                                                                                                                                              | function(currentPage: number)                   |                     |
| @page-size-change                 | 每页容量变化时的回调函数                                                                                                                                        | function(pageSize: number)                      |                     |

## Accessibility

### ARIA

- `aria-label`: 描述组件内页码、前一页、后一页等元素的标签
- `aria-current`: 指向当前页的页码元素

## 设计变量

::token-table{component="pagination"}
::

## FAQ

- **为什么页数下拉选择器最多只有`1,000,000`条？**  
  因为创建列表时, 浏览器对Array.from()创建数组的大小存在[限制](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Invalid_array_length); 同时为了兼顾Array.from()的开销，我们设定了`1,000,000`这个阈值。

## React → Vue 迁移

| React                             | Vue                                                         |
| --------------------------------- | ----------------------------------------------------------- |
| `currentPage` / `onPageChange`    | `v-model:current-page`，或 `:current-page` + `@page-change` |
| 当前页状态                        | 同时支持 `v-model`（modelValue），优先于 currentPage        |
| `pageSize` / `onPageSizeChange`   | `v-model:page-size`，或 `:page-size` + `@page-size-change`  |
| `onChange(page, size)`            | `@change`                                                   |
| `prevText` / `nextText` ReactNode | `prev` / `next` 插槽，或对应 VNodeChild prop                |
| `className`                       | 原生 `class`，兼容 className                                |

不传当前页时由组件内部维护，`defaultCurrentPage` 默认 1；传入 `currentPage` 或 modelValue 后由调用方更新。普通翻页依次触发 pageChange 与 change。`preventPageChangeOnPageSizeChange` 为 true 时，切换每页容量不再自动推算新的页码；需要时在 pageSizeChange 中自行设置当前页。

初始 pageSize 优先使用传入值，否则使用 pageSizeOpts 第一项，再回退到 10。`size` 默认 `default`，showTotal 默认 false。英文示例使用 ConfigProvider 的 locale.code=en-US 提供分页文案。API 表的版本号指固定上游功能版本。
