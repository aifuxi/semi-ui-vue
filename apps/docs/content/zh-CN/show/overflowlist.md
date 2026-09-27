---
title: 'OverflowList 折叠列表'
description: 'OverflowList 是一个行为组件，用于展示列表，并支持自适应来展示尽可能多的项目。因过长而溢出项目将折叠为一个元素。当检测到调整大小时，可见项将被重新计算。'
type: 'show'
order: 77
icon: 'doc-overflowList'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/overflow-list` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-overflowlist-1" title="如何引入" kind="import" />

### 折叠模式 - 默认

通过 `renderMode="collapse"` (默认) 来实现内容的折叠。

<DemoBlock id="zh-CN-show-overflowlist-2" title="折叠模式 - 默认" kind="live" />

### 折叠模式 - 方向

`collapse` 模式下支持 `collapseFrom` 设置折叠方向。

<DemoBlock id="zh-CN-show-overflowlist-3" title="折叠模式 - 方向" kind="live" />

### 折叠模式 - 最小展示的数目

`collapse` 模式下支持 `minVisibleItems` 设置最小展示数目。

<DemoBlock id="zh-CN-show-overflowlist-4" title="折叠模式 - 最小展示的数目" kind="live" />

### 滚动模式

通过 `renderMode="scroll"` 来使用滚动模式的折叠列表。如果需要 `scrollIntoView`，可以通过选择器： ``document.querySelector(`.item-cls[data-scrollkey="${key}"]`` 来选取。

<DemoBlock id="zh-CN-show-overflowlist-5" title="滚动模式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/overflow-list/types.ts` 的公开类型为准。

#### Vue 用法

- `visibleItem` 和 `overflow` 是作用域插槽，不再使用上游 renderer props。
- `itemKey` 同时支持固定键和取键函数；滚动模式的 item 仍需提供稳定 key。

#### Vue 事件

**OverflowList**

| 事件               | 参数                                                       | 说明               |
| ------------------ | ---------------------------------------------------------- | ------------------ |
| overflow           | [items: OverflowItem[]]                                    | 折叠项集合变化     |
| intersect          | [entries: Record&lt;string, IntersectionObserverEntry&gt;] | 滚动项相交状态变化 |
| visibleStateChange | [visibleState: Map&lt;string, boolean&gt;]                 | 滚动项可见状态变化 |

#### Vue 插槽

**OverflowList**

| 插槽        | 作用域参数          | 说明                   |
| ----------- | ------------------- | ---------------------- |
| visibleItem | { item, index }     | 渲染可见项             |
| overflow    | { items, position } | 渲染起始或末尾的折叠项 |

| 属性       | 说明               | 类型                                                    | 默认值     | 版本 |
| ---------- | ------------------ | ------------------------------------------------------- | ---------- | ---- |
| renderMode | 渲染模式           | OverflowListRenderMode                                  | `collapse` | -    |
| class      | Vue 原生类名       | unknown                                                 | -          | -    |
| className  | 样式类名           | string                                                  | -          | -    |
| style      | OverflowList的样式 | StyleValue                                              | -          | -    |
| itemKey    | —                  | OverflowListKey \| ((item: Item) =&gt; OverflowListKey) | —          |      |

### renderMode='collapse'

| 属性            | 说明                 | 类型                     | 默认值 | 版本 |
| --------------- | -------------------- | ------------------------ | ------ | ---- |
| items           | 渲染项目             | readonly Item[]          | -      | -    |
| collapseFrom    | 折叠方向             | OverflowListCollapseFrom | `end`  | -    |
| minVisibleItems | 最小展示的可见项数目 | number                   | 0      | -    |

### renderMode='scroll'

| 属性                    | 说明                          | 类型                        | 默认值 | 版本 |
| ----------------------- | ----------------------------- | --------------------------- | ------ | ---- |
| items                   | 渲染项目，**要求必含 key 项** | readonly Item[]             | -      | -    |
| threshold               | 触发溢出回调的阈值            | number                      | 0.75   | -    |
| wrapperClassName        | 滚动 wrapper 的类名           | string                      | -      | -    |
| wrapperStyle            | 滚动 wrapper 的样式           | StyleValue                  | -      | -    |
| overflowRenderDirection | —                             | OverflowListRenderDirection | `both` |      |
