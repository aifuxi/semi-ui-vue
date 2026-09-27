---
title: 'Pagination 翻页器'
description: '分页器帮助用户在多个页之间进行导航'
type: 'navigation'
order: 58
icon: 'doc-pagination'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/pagination` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-navigation-pagination-1" title="如何引入" kind="import" />

### 基本

基础分页，通过 `total` 设置总条数，`pageSize` 设置每页容量

<DemoBlock id="zh-CN-navigation-pagination-2" title="基本" kind="live" />

### 禁用

通过 `disabled` 设置禁用

<DemoBlock id="zh-CN-navigation-pagination-3" title="禁用" kind="live" />

### 总页数显示

通过 `showTotal` 属性控制是否展示总页数

<DemoBlock id="zh-CN-navigation-pagination-4" title="总页数显示" kind="live" />

### 指定当前页码

可以通过 `defaultCurrentPage` 指定当前激活的页码

<DemoBlock id="zh-CN-navigation-pagination-5" title="指定当前页码" kind="live" />

### 每页容量切换

通过设置 `showSizeChanger` 为 `true`，允许通过 Select 组件快速切换每页容量

<DemoBlock id="zh-CN-navigation-pagination-6" title="每页容量切换" kind="live" />

### 快速跳转至某页

通过设置 `showQuickJumper` 为 `true`, 允许通过Input控件输入页码，快速跳转
当Input失去焦点时，若Input中为有效数字，会直接进行跳转。你亦可在Input聚焦时，输入期望跳转的页码后直接敲击回车进行跳转
若你输入页码大于分页器总页数，我们会自动为你跳转至最后一页
showQuickJumper于 v1.31后提供

<DemoBlock id="zh-CN-navigation-pagination-7" title="快速跳转至某页" kind="live" />

### 页码受控

传入 `currentPage` 后分页器受控，推荐使用 `v-model:currentPage`，也可以监听 `pageChange` 事件更新当前页码。

<DemoBlock id="zh-CN-navigation-pagination-8" title="页码受控" kind="live" />

### 预设每页容量可选值

传入 `pageSizeOpts` 数组，指定切换每页容量的可选值

<DemoBlock id="zh-CN-navigation-pagination-9" title="预设每页容量可选值" kind="live" />

### 迷你版本

`size` 设置为 `small`

<DemoBlock id="zh-CN-navigation-pagination-10" title="迷你版本" kind="live" />

开启 hoverShowPageSelect，可以 hover 页码快速切换（v1.27.0后提供）

<DemoBlock id="zh-CN-navigation-pagination-11" title="迷你版本" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/pagination/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`；也支持 `v-model:currentPage` 与 `v-model:pageSize`。

#### Vue 事件

**Pagination**

| 事件           | 参数                                    | 说明               |
| -------------- | --------------------------------------- | ------------------ |
| change         | [currentPage: number, pageSize: number] | 页码或每页条数变化 |
| pageChange     | [currentPage: number]                   | 页码变化           |
| pageSizeChange | [pageSize: number]                      | 每页条数变化       |

#### Vue 插槽

**Pagination**

| 插槽 | 作用域参数 | 说明             |
| ---- | ---------- | ---------------- |
| prev | {}         | 自定义上一页内容 |
| next | {}         | 自定义下一页内容 |

| 属性                              | 说明                                                                                                                                                            | 类型                    | 默认值            | 版本   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------- | ------ |
| class                             | —                                                                                                                                                               | HTMLAttributes['class'] | —                 |        |
| className                         | 类名                                                                                                                                                            | string                  | —                 |        |
| currentPage                       | 当前页码                                                                                                                                                        | number                  | —                 |        |
| defaultCurrentPage                | 默认的当前页码                                                                                                                                                  | number                  | —                 |        |
| disabled                          | 禁用                                                                                                                                                            | boolean                 | false             | 2.37.0 |
| hideOnSinglePage                  | 总页数小于 2 时，是否自动隐藏分页器，当 showSizeChanger 为true时，此开关不再生效                                                                                | boolean                 | false             |        |
| hoverShowPageSelect               | hover 页码时是否展示切换页数的Select控件，仅当 size = 'small'时生效                                                                                             | boolean                 | false             | 1.27.0 |
| modelValue                        | —                                                                                                                                                               | number                  | —                 |        |
| nextText                          | 下一页文本                                                                                                                                                      | VNodeChild              | —                 |        |
| pageSize                          | 每页条数                                                                                                                                                        | number                  | 10                |        |
| pageSizeOpts                      | 指定每页显示多少条                                                                                                                                              | number[]                | [10, 20, 40, 100] |        |
| popoverPosition                   | 浮层方向，具体可见 [Popover·API 参考·position](/zh-CN/show/popover#API参考)                                                                                     | TooltipPosition         | "bottomLeft"      |        |
| popoverZIndex                     | 浮层 z-index 值                                                                                                                                                 | number                  | 1030              |        |
| preventPageChangeOnPageSizeChange | 切换 pageSize 时是否阻止自动调整 currentPage。默认情况下，切换 pageSize 时组件会自动计算新的 currentPage 以保持当前数据位置，设为 true 后由用户自行控制页码变化 | boolean                 | false             | -      |
| prevText                          | 上一页文本                                                                                                                                                      | VNodeChild              | —                 |        |
| showQuickJumper                   | 是否显示切换页码的 Input                                                                                                                                        | boolean                 | false             | 1.31.0 |
| showSizeChanger                   | 是否显示切换页容量的 Select，size为small时不生效                                                                                                                | boolean                 | false             |        |
| showTotal                         | 是否显示总页数                                                                                                                                                  | boolean                 | —                 |        |
| size                              | 尺寸                                                                                                                                                            | PaginationSize          | —                 |        |
| style                             | 样式                                                                                                                                                            | CSSProperties           | —                 |        |
| total                             | 总条数                                                                                                                                                          | number                  | 1                 |        |

## Accessibility

### ARIA

- `aria-label`: 描述组件内页码、前一页、后一页等元素的标签
- `aria-current`: 指向当前页的页码元素

## FAQ

- **为什么页数下拉选择器最多只有`1,000,000`条？**
  因为创建列表时, 浏览器对Array.from()创建数组的大小存在[限制](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Errors/Invalid_array_length); 同时为了兼顾Array.from()的开销，我们设定了`1,000,000`这个阈值。
