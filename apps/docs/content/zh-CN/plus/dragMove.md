---
title: 'DragMove 拖拽移动'
description: '可通过拖拽改变位置'
type: 'plus'
order: 31
icon: 'doc-dragmove'
---

## 使用场景

用于设置元素可被拖动改变位置，支持限制拖拽范围，支持自定义触发拖动的元素。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/drag-move` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

DragMove 从 v2.71.0 开始支持

<DemoBlock id="zh-CN-plus-dragMove-1" title="如何引入" kind="code" />

### 基本用法

被 `DragMove` 包裹的元素将能够通过拖拽改变位置。

_**注意**_

1. DragMove 默认会将可拖拽的元素设置为 absolute 定位；需要保留元素原有布局位置（例如居中的 Modal）时，可设置 `positionStrategy="relative"`
2. DragMove 会把 DOM 事件监听器合并到默认插槽的根元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。支持以下内容：
3. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件
4. 能够把 attrs 和事件监听器传递给原生元素的函数式组件
5. 原生 DOM 元素，例如 `span`、`div`、`p`

<DemoBlock id="zh-CN-plus-dragMove-2" title="基本用法" kind="live" />

### 限制拖动范围

传入 `constrainer`, 该函数返回限制可拖拽范围的元素。

_**注意：constrainer 设置的元素需要为 relative 定位**_

<DemoBlock id="zh-CN-plus-dragMove-3" title="限制拖动范围" kind="live" />

### 自定义触发拖动的元素

可通过 `handler` 自定义触发拖动的元素。如果不设置, 则点击任意位置均可拖动；如果设置，则仅点击 handler 部分可拖动。

<DemoBlock id="zh-CN-plus-dragMove-4" title="自定义触发拖动的元素" kind="live" />

### 自定义拖动后的位置处理

可通过 `customMove` 自定义拖动后的位置处理，该参数设置后，DragMove 组件内部将仅通过参数返回计算后的位置，不做设置，用户按需自行设置新位置。

<DemoBlock id="zh-CN-plus-dragMove-5" title="自定义拖动后的位置处理" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/drag-move/types.ts` 的公开类型为准。

#### Vue 用法

- `allowMove`、`constrainer`、`customMove` 和 `handler` 是拖拽配置 callback props，不转换为 emits。
- 默认插槽应提供单个可接收 attrs 和 DOM 事件的根元素。

#### Vue 事件

**DragMove**

| 事件        | 参数                | 说明         |
| ----------- | ------------------- | ------------ |
| mouseDown   | [event: MouseEvent] | 鼠标拖拽开始 |
| mouseMove   | [event: MouseEvent] | 鼠标拖拽移动 |
| mouseUp     | [event: MouseEvent] | 鼠标拖拽结束 |
| touchStart  | [event: TouchEvent] | 触摸拖拽开始 |
| touchMove   | [event: TouchEvent] | 触摸拖拽移动 |
| touchEnd    | [event: TouchEvent] | 触摸拖拽结束 |
| touchCancel | [event: TouchEvent] | 触摸拖拽取消 |

#### Vue 插槽

**DragMove**

| 插槽    | 作用域参数 | 说明               |
| ------- | ---------- | ------------------ |
| default | {}         | 可拖拽的单个根元素 |

| 属性             | 说明                                                | 类型                                      | 默认值     |
| ---------------- | --------------------------------------------------- | ----------------------------------------- | ---------- |
| allowInputDrag   | 点击原生 input/textarea 时是否允许拖动              | boolean                                   | false      |
| allowMove        | 点击/触摸时是否允许拖动的判断函数                   | DragMoveAllowMove                         | -          |
| constrainer      | 返回限制可拖拽的范围的元素                          | DragMoveConstrainer                       | -          |
| customMove       | 自定义拖动后的位置处理                              | DragMoveCustomMove                        | -          |
| handler          | 返回触发拖动的元素                                  | () =&gt; HTMLElement \| null \| undefined | -          |
| positionStrategy | 拖拽元素的定位策略，relative 可保留元素原有布局位置 | DragMovePositionStrategy                  | `absolute` |
