---
title: 'Resizable 伸缩框'
description: '根据用户的鼠标拖拽，改变组件的大小，支持单个组件伸缩与组合伸缩'
type: 'basic'
order: 21
icon: 'doc-steps'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/resizable` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Resizable 从 2.69.0 开始支持

<DemoBlock id="zh-CN-basic-resizable-1" title="如何引入" kind="code" />

### 单个组件 基本使用

通过 `defaultSize` 设置初始大小，并监听 `resizeStart`、`change`、`resizeEnd` 事件。

<DemoBlock id="zh-CN-basic-resizable-2" title="单个组件 基本使用" kind="code" />

<DemoBlock id="zh-CN-basic-resizable-3" title="单个组件 基本使用" kind="live" />

### 控制伸缩方向

通过设置`enable`的值开启/关闭特定伸缩方向，默认值均为`true`

<DemoBlock id="zh-CN-basic-resizable-4" title="控制伸缩方向" kind="code" />

<DemoBlock id="zh-CN-basic-resizable-5" title="控制伸缩方向" kind="live" />

### 设置变化比例

通过`ratio`设置拖动和实际变化的比例

<DemoBlock id="zh-CN-basic-resizable-6" title="设置变化比例" kind="live" />

### 锁定横纵比

通过`lockAspectRatio`设置锁定横纵比,可以为`boolean`或`number`,为`number`时表示横纵比为`number`,为`true`时锁定初始横纵比

<DemoBlock id="zh-CN-basic-resizable-7" title="锁定横纵比" kind="live" />

### 设置最大，最小宽高

可通过 `maxHeight`，`maxWidth`，`minHeight`，`minWidth` 设置最大，最小宽高

<DemoBlock id="zh-CN-basic-resizable-8" title="设置最大，最小宽高" kind="live" />

### 受控宽高

可通过 `size` 控制元素的宽高

<DemoBlock id="zh-CN-basic-resizable-9" title="受控宽高" kind="live" />

### 设置缩放值

通过设置 `scale`，整体缩放元素

<DemoBlock id="zh-CN-basic-resizable-10" title="设置缩放值" kind="live" />

### 根据元素限制元素宽高

通过 boundElement 设置用于限制宽高的元素，支持 string（'parent'｜'window'）

<DemoBlock id="zh-CN-basic-resizable-11" title="根据元素限制元素宽高" kind="live" />

### 自定义边角 handler 样式

可通过 handleNode 设置不同方向的拖动元素节点，可通过 handleStyle，handleClassName 设置不同方向上的样式

<DemoBlock id="zh-CN-basic-resizable-12" title="自定义边角 handler 样式" kind="code" />

<DemoBlock id="zh-CN-basic-resizable-13" title="自定义边角 handler 样式" kind="live" />

### 允许阶段性调整宽高

可通过 grid，snap 属性允许逐渐调整宽高。 grid 属性用于指定调整大小应对齐的增量。默认为 [1, 1]。 snap 属性用于指定调整大小时应对齐的绝对像素值。 x 和 y 都是可选的，允许仅包含要定义的轴。默认为空。以上两个参数可结合 snapGap 使用，该参数用于指定移动到下一个目标所需的最小间隙。默认为 0，这意味着始终使用 grid/snap 设定的目标。

<DemoBlock id="zh-CN-basic-resizable-14" title="允许阶段性调整宽高" kind="code" />

<DemoBlock id="zh-CN-basic-resizable-15" title="允许阶段性调整宽高" kind="live" />

### 组合组件 基本使用

通过 `direction` 设置伸缩方向，可选 `horizontal` 或 `vertical`；可监听 `resizeStart`、`change`、`resizeEnd` 事件，并通过 `min`、`max` 设置尺寸范围。

<DemoBlock id="zh-CN-basic-resizable-16" title="组合组件 基本使用" kind="live" />

### 嵌套使用

通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical`

<DemoBlock id="zh-CN-basic-resizable-17" title="嵌套使用" kind="live" />

<DemoBlock id="zh-CN-basic-resizable-18" title="嵌套使用" kind="live" />

### 动态方向

<DemoBlock id="zh-CN-basic-resizable-19" title="动态方向" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/resizable/types.ts`、`packages/ui/src/resizable/index.ts` 的公开类型为准。

- `v-model:size` 对应 `size` 与 `update:size`。

#### Vue 用法

- Resizable、ResizeGroup、ResizeItem、ResizeHandler 均为具名导出；组合模式按 Item / Handler / Item 顺序放入 ResizeGroup 默认插槽。
- `beforeResizeStart` 是保留的 guard callback prop；resizeStart、change、resizeEnd 是组件事件。
- class 与 style 作为 Vue 原生 attributes 透传，不是四个组件的声明式 props。
- ResizeHandler 由所在 ResizeGroup 提供方向，不公开独立 props 或事件。

#### Vue 事件

**Resizable**

| 事件        | 参数                                                                                         | 说明                 |
| ----------- | -------------------------------------------------------------------------------------------- | -------------------- |
| resizeStart | [event: ResizeStartPointer, direction: ResizeDirection]                                      | 开始调整尺寸         |
| change      | [size: ResizeSize, event: ResizeStartPointer \| ResizeMoveEvent, direction: ResizeDirection] | 调整过程中的尺寸变化 |
| resizeEnd   | [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection]                       | 结束调整尺寸         |
| update:size | [size: ResizeSize]                                                                           | 更新 v-model:size    |

**ResizeItem**

| 事件        | 参数                                                                   | 说明               |
| ----------- | ---------------------------------------------------------------------- | ------------------ |
| resizeStart | [event: ResizeStartPointer, direction: ResizeDirection]                | 所在分隔条开始拖动 |
| change      | [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection] | 组合项尺寸变化     |
| resizeEnd   | [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection] | 所在分隔条结束拖动 |

#### Vue 插槽

**Resizable**

| 插槽               | 作用域参数 | 说明       |
| ------------------ | ---------- | ---------- |
| default            | {}         | 可伸缩内容 |
| handle-top         | {}         | 顶部手柄   |
| handle-right       | {}         | 右侧手柄   |
| handle-bottom      | {}         | 底部手柄   |
| handle-left        | {}         | 左侧手柄   |
| handle-topRight    | {}         | 右上手柄   |
| handle-bottomRight | {}         | 右下手柄   |
| handle-bottomLeft  | {}         | 左下手柄   |
| handle-topLeft     | {}         | 左上手柄   |

**ResizeGroup**

| 插槽    | 作用域参数 | 说明     |
| ------- | ---------- | -------- |
| default | {}         | 组合子项 |

**ResizeItem**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 组合项内容 |

**ResizeHandler**

| 插槽    | 作用域参数 | 说明         |
| ------- | ---------- | ------------ |
| default | {}         | 自定义分隔条 |

### Resizable

单个伸缩框组件。

| 参数                       | 说明                                                                       | 类型                                             | 默认值 | 版本 |
| -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------ | ------ | ---- |
| size                       | `v-model:size` 绑定的受控宽高                                              | ResizeSize                                       | —      |      |
| defaultSize                | 非受控初始宽高                                                             | ResizeSize                                       | —      |      |
| minWidth                   | 指定伸缩框最小宽度                                                         | string \| number                                 | —      |      |
| minHeight                  | 指定伸缩框最小高度                                                         | string \| number                                 | —      |      |
| maxWidth                   | 指定伸缩框最大宽度                                                         | string \| number                                 | —      |      |
| maxHeight                  | 指定伸缩框最大高度                                                         | string \| number                                 | —      |      |
| grid                       | 指定调整大小应对齐的增量                                                   | number \| readonly [number, number]              | [1, 1] |      |
| snap                       | 指定调整大小时应对齐的绝对像素值。 x 和 y 都是可选的，允许仅包含要定义的轴 | { x?: readonly number[]; y?: readonly number[] } | null   |      |
| snapGap                    | 用于指定移动到下一个目标所需的最小间隙。                                   | number                                           | 0      |      |
| boundElement               | 限制可伸缩范围的 parent、window 或 HTMLElement                             | 'parent' \| 'window' \| HTMLElement              | —      |      |
| boundsByDirection          | —                                                                          | boolean                                          | false  |      |
| lockAspectRatio            | 设置伸缩框横纵比，当为`true`时按照初始宽高锁定                             | boolean \| number                                | false  |      |
| lockAspectRatioExtraWidth  | —                                                                          | number                                           | 0      |      |
| lockAspectRatioExtraHeight | —                                                                          | number                                           | 0      |      |
| enable                     | 各方向开关；false 关闭全部手柄                                             | ResizeEnable \| false                            | {}     |      |
| handleStyle                | 各方向手柄样式                                                             | ResizeHandleStyle                                | —      |      |
| handleClass                | 各方向手柄类名                                                             | ResizeHandleClass                                | —      |      |
| handleWrapperStyle         | —                                                                          | CSSProperties                                    | —      |      |
| handleWrapperClass         | —                                                                          | string                                           | —      |      |
| handleNode                 | 各方向手柄 VNode；对应 handle-* 插槽优先                                   | ResizeHandleNode                                 | —      |      |
| scale                      | 可伸缩元素被缩放的比例                                                     | number                                           | 1      |      |
| ratio                      | —                                                                          | number \| readonly [number, number]              | 1      |      |
| beforeResizeStart          | 开始调整前的 guard callback；返回 false 可取消本次调整                     | ResizeStartGuard                                 | —      |      |

### ResizeGroup

| 参数      | 说明                  | 类型                 | 默认值       | 版本 |
| --------- | --------------------- | -------------------- | ------------ | ---- |
| direction | 指定Group内的伸缩方向 | ResizeGroupDirection | `horizontal` |      |

### ResizeHandler

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| ---- | ---- | ---- | ------ | ---- |

### ResizeItem

| 参数        | 说明                                                                                                    | 类型             | 默认值 | 版本 |
| ----------- | ------------------------------------------------------------------------------------------------------- | ---------------- | ------ | ---- |
| min         | 指定伸缩框最小尺寸（百分比或像素值）                                                                    | string           | —      |      |
| max         | 指定伸缩框最大尺寸（百分比或像素值）                                                                    | string           | —      |      |
| defaultSize | 用于设置初始宽高，**字符串支持%和px单位，当字符串为纯数字或直接设置数字时表示按照值的比例分配剩余空间** | string \| number | —      |      |
