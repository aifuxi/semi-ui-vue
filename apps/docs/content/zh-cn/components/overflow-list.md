---
title: '折叠列表'
description: 'OverflowList 是一个行为组件，用于展示列表，并支持自适应来展示尽可能多的项目。因过长而溢出项目将折叠为一个元素。当检测到调整大小时，可见项将被重新计算。'
locale: 'zh-CN'
slug: 'overflow-list'
category: 'show'
order: 77
englishTitle: 'OverflowList'
icon: 'doc-overflowList'
upstream: 'show/overflowlist'
---

OverflowList 是纯布局行为组件：它根据真实可用宽度保留尽可能多的项目，并把其余项目交给 `overflow` 作用域插槽。

## 引入

```ts
import { OverflowList } from '@aifuxi/semi-ui-vue/overflow-list';
import '@aifuxi/semi-theme-default/overflow-list.css';
```

## 代码演示

### 折叠模式 - 默认

`renderMode="collapse"` 为默认模式。拖动滑块调整列表容器的宽度，放不下的项目会从末尾折叠为 `+N` 标签；恢复宽度后重新显示。六个图标标签与固定上游一致。

::demo-block{demo="overflow-list/zh-CN/Collapse" title="折叠模式 - 默认"}
::

### 折叠模式 - 方向

`collapseFrom="start"` 从数组开头折叠，保留末尾项目，并把 `+N` 标签放在列表前方。拖动滑块观察与默认方向的区别。

::demo-block{demo="overflow-list/zh-CN/CollapseFromStart" title="折叠模式 - 方向"}
::

### 折叠模式 - 最小展示的数目

`:min-visible-items="3"` 至少保留三个可见项目，即使容器宽度不足也不会继续折叠这三个项目。拖动滑块缩小宽度，观察最少可见项目与溢出数量。

::demo-block{demo="overflow-list/zh-CN/MinVisibleItems" title="折叠模式 - 最小展示的数目"}
::

### 滚动模式

通过 `renderMode="scroll"` 保留全部项目并横向滚动。缩小容器后在列表中横向滚动，两端标签显示各自溢出的项目数；与固定上游一样，没有溢出时也显示 `+0`。

::demo-block{demo="overflow-list/zh-CN/Scroll" title="滚动模式"}
::

scroll 模式要求每项具有稳定 `key`，也可用 `itemKey` 指定字段名或 getter。最终可观察元素带有 `data-scrollkey`；若要把某项滚入视图，可在当前示例容器内选取 `.item-cls[data-scrollkey="folder"]`，再调用 `scrollIntoView({ block: 'nearest', inline: 'nearest' })`。

四项示例分别使用独立 SFC，可在示例编辑器中修改并运行；当前已建立双语映射，严格视觉与行为验收另行推进。

## API

| 属性                                | 类型                                | 默认值       | 说明                     |
| ----------------------------------- | ----------------------------------- | ------------ | ------------------------ |
| `items`                             | `OverflowItem[]`                    | `[]`         | 项目数据                 |
| `collapseFrom`                      | `'start' \| 'end'`                  | `'end'`      | collapse 折叠方向        |
| `minVisibleItems`                   | `number`                            | `0`          | 最少可见项数             |
| `renderMode`                        | `'collapse' \| 'scroll'`            | `'collapse'` | 渲染模式                 |
| `threshold`                         | `number`                            | `0.75`       | scroll 相交阈值          |
| `itemKey`                           | `string \| number \| (item) => key` | `'key'`      | 稳定键策略               |
| `wrapperClassName` / `wrapperStyle` | `string` / `StyleValue`             | -            | scroll wrapper 属性      |
| `overflowRenderDirection`           | `'both' \| 'start' \| 'end'`        | `'both'`     | scroll overflow 控件位置 |

## 插槽与事件

- `#visibleItem="{ item, index }"`：渲染可见项目。
- `#overflow="{ items, position }"`：渲染折叠项目；scroll 模式分别收到 start/end 数组。
- `@overflow(items)`：collapse 的 overflow pivot 改变时触发。
- `@visibleStateChange(map)`、`@intersect(entries)`：scroll 相交批次更新后依次触发。

## React → Vue

| React v2.102.0                                | Vue                                              |
| --------------------------------------------- | ------------------------------------------------ |
| `visibleItemRenderer={(item, index) => ...}`  | `#visibleItem="{ item, index }"`                 |
| `overflowRenderer={items => ...}`             | `#overflow="{ items, position }"`                |
| `onOverflow={handler}`                        | `@overflow="handler"`                            |
| `onIntersect={handler}`                       | `@intersect="handler"`                           |
| `onVisibleStateChange={handler}`              | `@visibleStateChange="handler"`                  |
| scroll renderer 接收 `[startItems, endItems]` | `#overflow` 按 `position` 分别接收一侧的 `items` |
| `className`                                   | `class`（也兼容 `className`）                    |

其余枚举值和自然可保留的 prop 名保持一致。scroll 模式下，React 要求 renderer 返回可 clone 的单个 ReactElement；Vue 单根元素会直接获得 `data-scrollkey`，多根 slot 会由内部 `.semi-overflow-list-scroll-item` 包装，这是唯一已接受的框架结构差异。
