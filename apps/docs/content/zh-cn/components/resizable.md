---
title: '伸缩框'
description: '根据用户的鼠标拖拽，改变组件的大小，支持单个组件伸缩与组合伸缩'
locale: 'zh-CN'
slug: 'resizable'
category: 'basic'
order: 21
englishTitle: 'Resizable'
icon: 'doc-steps'
upstream: 'basic/resizable'
---

## 代码演示

### 如何引入

Resizable 从 2.69.0 开始支持

```vue
<script setup lang="ts">
import { Resizable, ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
</script>
```

### 单个组件 基本使用

通过`defaultSize`设置初始大小，可以通过`@resize-start`、`@change`、`@resize-end`设置拖拽的回调

```ts
interface Size {
  width?: string | number;
  height?: string | number;
}
```

::demo-block{demo="resizable/zh-cn/Basic" title="单个组件 基本使用"}
::

### 控制伸缩方向

通过设置`enable`的值开启/关闭特定伸缩方向，默认值均为`true`

```ts
interface Enable {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
}
```

::demo-block{demo="resizable/zh-cn/Direction" title="控制伸缩方向"}
::

### 设置变化比例

通过`ratio`设置拖动和实际变化的比例

::demo-block{demo="resizable/zh-cn/Ratio" title="设置变化比例"}
::

### 锁定横纵比

通过`lockAspectRatio`设置锁定横纵比,可以为`boolean`或`number`,为`number`时表示横纵比为`number`,为`true`时锁定初始横纵比

::demo-block{demo="resizable/zh-cn/AspectRatio" title="锁定横纵比"}
::

### 设置最大，最小宽高

可通过 `maxHeight`，`maxWidth`，`minHeight`，`minWidth` 设置最大，最小宽高

::demo-block{demo="resizable/zh-cn/Limits" title="设置最大，最小宽高"}
::

### 受控宽高

可通过 `size` 控制元素的宽高

::demo-block{demo="resizable/zh-cn/Controlled" title="受控宽高"}
::

### 设置缩放值

通过设置 `scale`，整体缩放元素

::demo-block{demo="resizable/zh-cn/Scale" title="设置缩放值"}
::

### 根据元素限制元素宽高

通过 boundElement 设置用于限制宽高的元素，支持 string（'parent'｜'window'）

::demo-block{demo="resizable/zh-cn/Bounds" title="根据元素限制元素宽高"}
::

### 自定义边角 handler 样式

可通过 handleNode 设置不同方向的拖动元素节点，可通过 handleStyle，handleClass 设置不同方向上的样式

```ts
import type { CSSProperties, VNodeChild } from 'vue';
type HandleNode = {
  left?: VNodeChild;
  right?: VNodeChild;
  top?: VNodeChild;
  bottom?: VNodeChild;
  topLeft?: VNodeChild;
  topRight?: VNodeChild;
  bottomLeft?: VNodeChild;
  bottomRight?: VNodeChild;
};

type HandleStyle = {
  left?: CSSProperties;
  right?: CSSProperties;
  top?: CSSProperties;
  bottom?: CSSProperties;
  topLeft?: CSSProperties;
  topRight?: CSSProperties;
  bottomLeft?: CSSProperties;
  bottomRight?: CSSProperties;
};

type HandleClass = {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
};
```

::demo-block{demo="resizable/zh-cn/Handle" title="自定义边角 handler 样式"}
::

### 允许阶段性调整宽高

可通过 grid ，snap 属性允许逐渐调整宽高。 grid 属性用于指定调整大小应对齐的增量。默认为 [1, 1]。 snap 属性用于指定调整大小时应对齐的绝对像素值。 x 和 y 都是可选的，允许仅包含要定义的轴。默认为空。以上两个参数可结合 snapGap 使用，该参数用于指定移动到下一个目标所需的最小间隙。默认为 0，这意味着始终使用 grid/snap 设定的目标。

```ts
interface Snap {
  x?: number[];
  y?: number[];
}
```

::demo-block{demo="resizable/zh-cn/Grid" title="允许阶段性调整宽高"}
::

### 组合组件 基本使用

> **注意事项**
>
> `ResizeGroup` 的父元素需要具有主轴方向上的尺寸。
>
> 最好不要为 `ResizeItem` 设置 `padding`，会导致最小尺寸不符合预期，可以为子元素设置 `padding`。

通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical` 支持`@resize-start`、`@change`、`@resize-end`回调，支持`min`、`max`设置最大最小宽高

::demo-block{demo="resizable/zh-cn/Group" title="组合组件 基本使用"}
::

### 嵌套使用

通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical`

::demo-block{demo="resizable/zh-cn/Nested" title="嵌套使用"}
::

::demo-block{demo="resizable/zh-cn/ComplexNested" title="嵌套使用"}
::

### 动态方向

::demo-block{demo="resizable/zh-cn/DynamicDirection" title="动态方向"}
::

## API 参考

### Resizable

| 属性                         | 说明                                                                       | 类型                                               | 默认值   |
| ---------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------- | -------- |
| `size`                       | 控制伸缩框的大小，支持数字和字符串（px/vw/vh/%）两种格式                   | `ResizeSize`                                       | `—`      |
| `defaultSize`                | 用于设置初始宽高，支持数字和字符串（px/vw/vh/%）两种格式                   | `ResizeSize`                                       | `—`      |
| `minWidth`                   | 指定伸缩框最小宽度                                                         | `string \| number`                                 | `—`      |
| `minHeight`                  | 指定伸缩框最小高度                                                         | `string \| number`                                 | `—`      |
| `maxWidth`                   | 指定伸缩框最大宽度                                                         | `string \| number`                                 | `—`      |
| `maxHeight`                  | 指定伸缩框最大高度                                                         | `string \| number`                                 | `—`      |
| `grid`                       | 指定调整大小应对齐的增量                                                   | `number \| readonly [number, number]`              | `[1, 1]` |
| `snap`                       | 指定调整大小时应对齐的绝对像素值。 x 和 y 都是可选的，允许仅包含要定义的轴 | `{ x?: readonly number[]; y?: readonly number[] }` | `—`      |
| `snapGap`                    | 用于指定移动到下一个目标所需的最小间隙。                                   | `number`                                           | `0`      |
| `boundElement`               | 用于限制可伸缩元素宽高的元素,传入 `parent` 设置父节点为限制节点            | `'parent' \| 'window' \| HTMLElement`              | `—`      |
| `boundsByDirection`          | 按拖动方向应用边界限制                                                     | `boolean`                                          | `false`  |
| `lockAspectRatio`            | 设置伸缩框横纵比，当为`true`时按照初始宽高锁定                             | `boolean \| number`                                | `false`  |
| `lockAspectRatioExtraWidth`  | 锁定比例之外的额外宽度                                                     | `number`                                           | `0`      |
| `lockAspectRatioExtraHeight` | 锁定比例之外的额外高度                                                     | `number`                                           | `0`      |
| `enable`                     | 指定伸缩框可以伸缩的方向，没有设置为 false，则默认允许该方向的拖动         | `ResizeEnable \| false`                            | `{}`     |
| `handleStyle`                | 用于设置拖拽处理元素各个方向的样式                                         | `ResizeHandleStyle`                                | `—`      |
| `handleClass`                | 用于设置拖拽处理元素各个方向的类名称                                       | `ResizeHandleClass`                                | `—`      |
| `handleWrapperStyle`         | 拖动手柄容器样式                                                           | `CSSProperties`                                    | `—`      |
| `handleWrapperClass`         | 拖动手柄容器类名                                                           | `string`                                           | `—`      |
| `handleNode`                 | 用于设置拖拽处理元素各个方向的自定义节点                                   | `ResizeHandleNode`                                 | `—`      |
| `scale`                      | 可伸缩元素被缩放的比例                                                     | `number`                                           | `1`      |
| `ratio`                      | 拖动距离与尺寸变化的比例；数组分别指定横纵轴                               | `number \| readonly [number, number]`              | `1`      |
| `beforeResizeStart`          | 开始前守卫；返回 false 取消本次拖动                                        | `ResizeStartGuard`                                 | `—`      |

### ResizeSize

| 属性     | 说明                          | 类型               | 默认值 |
| -------- | ----------------------------- | ------------------ | ------ |
| `width`  | 宽度，支持像素数字或 CSS 单位 | `string \| number` | `—`    |
| `height` | 高度，支持像素数字或 CSS 单位 | `string \| number` | `—`    |

### ResizeGroup

| 属性        | 说明                  | 类型                   | 默认值       |
| ----------- | --------------------- | ---------------------- | ------------ |
| `direction` | 指定Group内的伸缩方向 | `ResizeGroupDirection` | `horizontal` |

### ResizeHandler

通过 class/style 原生属性和默认插槽自定义分隔手柄。

### ResizeItem

| 属性          | 说明                                                       | 类型               | 默认值 |
| ------------- | ---------------------------------------------------------- | ------------------ | ------ |
| `min`         | 指定伸缩框最小尺寸（百分比或像素值）                       | `string`           | `—`    |
| `max`         | 指定伸缩框最大尺寸（百分比或像素值）                       | `string`           | `—`    |
| `defaultSize` | % 或 px 表示固定尺寸；数字或纯数字字符串按权重分配剩余空间 | `string \| number` | `—`    |

Resizable 支持 v-model:size 与默认插槽，方向插槽为 #handle-top、#handle-right、#handle-bottom、#handle-left、#handle-topRight、#handle-bottomRight、#handle-bottomLeft、#handle-topLeft。handleNode 接收 Vue 节点，也可使用对应插槽。

Resizable 与 ResizeItem 派发 `@resize-start(event, direction)`、`@change(size, event, direction)`、`@resize-end(size, event, direction)`，事件载荷为 MouseEvent 或触摸输入；beforeResizeStart 是可返回 false 取消的函数 prop。ResizeItem 没有受控 size 或 v-model。

ResizeGroup、ResizeItem、ResizeHandler 通过默认插槽接收内容，根节点使用 class/style 原生属性。ResizeItem 的百分比和 px 为固定尺寸，数字或纯数字字符串代表剩余空间的分配权重。enable 未指定方向保持可用，enable=false 禁用全部手柄。

## 设计变量

::token-table{component="resizable"}
::

## Accessibility

拖动手柄保留上游指针交互，不应假定任意手柄自动支持键盘缩放。需要键盘等价操作时应在业务中提供有标签的尺寸输入，并保证缩放后内容可读。

## 文案规范

用简洁文字说明可调整区域和尺寸限制。

## FAQ

**为什么未指定方向仍能伸缩？** 只有显式 false 的 enable 字段被禁用。

**组合项为什么同时变化？** 数字 defaultSize 按权重分配剩余空间。

**如何取消开始拖动？** beforeResizeStart 返回 false。

## React → Vue

| React                         | Vue                                     |
| ----------------------------- | --------------------------------------- |
| `size + onChange`             | `v-model:size`                          |
| `onResizeStart / onResizeEnd` | `@resize-start / @resize-end`           |
| `onResizeStart return false`  | `beforeResizeStart function prop`       |
| `handleNode ReactNode`        | `VNodeChild / directional handle slots` |
| `children`                    | `default slot`                          |
| `className`                   | `class native attribute`                |
