---
title: 'Icon 图标'
description: '语义化的矢量图形。'
type: 'basic'
order: 26
icon: 'doc-icons'
---

## 图标列表

默认的图标集 `@aifuxi/semi-icons-vue` 包含面性、线性、AI 三套图标。面性图标、线性图标，以及 AI 图标中的单色图标默认不带颜色，可通过 css color 属性更改颜色。
AI 图标中的双色，多色图标有默认颜色，可以通过 fill 更改颜色。

AI 图标自 v2.86.0 提供。

`@aifuxi/semi-icons-lab-vue` 为彩色图标集，需单独安装，不可改色, lab 图标集于 v2.48 后提供

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/icon` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-basic-icon-1" title="如何引入" kind="import" />

### 基础使用

从`@aifuxi/semi-icons-vue`包中引入图标

<DemoBlock id="zh-CN-basic-icon-2" title="基础使用" kind="live" />

### 旋转

从`@aifuxi/semi-icons-vue`包中引入图标，自带尺寸、旋转、spin功能

<DemoBlock id="zh-CN-basic-icon-3" title="旋转" kind="live" />

### 尺寸

>

可以改变`font-size`来更改图标大小

>

Icon组件封装了size属性，可以更方便地定义图标尺寸，支持 `extra-small` (8x8)，`small` (12x12)， `default` (16x16)， `large` (20x20)， `extra-large` (24x24)，当size指定为`inherit`时，图标大小继承当前上下文字体大小

<DemoBlock id="zh-CN-basic-icon-4" title="尺寸" kind="live" />

### 颜色

单色图标会自动继承外部容器 CSS 的 `color` 属性
你还可以通过给 Icon 设置 style props 来修改图标的颜色。

<DemoBlock id="zh-CN-basic-icon-5" title="颜色" kind="live" />

### 双色图标

双色图标可以通过 `fill` 属性设置颜色，支持 string 以及 string[]。

<DemoBlock id="zh-CN-basic-icon-6" title="双色图标" kind="live" />

### 多色按钮

多色图标，当前的多色按钮可传入四个颜色。可以通过 `fill` 属性设置颜色，支持 string 以及 string[]。

<DemoBlock id="zh-CN-basic-icon-7" title="多色按钮" kind="live" />

### 自定义图标

可以使用自定义图标传入Icon组件。Icon组件支持 size、rotate、spin 等属性。

<DemoBlock id="zh-CN-basic-icon-8" title="自定义图标" kind="live" />

### 使用 SVG 自定义图标

如果内置图标不足以满足业务需求，可以把自定义 SVG 封装为 Vue 组件，并通过 Icon 默认插槽传入。

<DemoBlock id="zh-CN-basic-icon-9" title="使用 SVG 自定义图标" kind="code" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/icon/index.ts`、`packages/icons/src/components/Icon.ts`、`packages/icons/src/index.ts` 的公开类型为准。

#### Vue 用法

- `class`、`style`、ARIA 属性和原生事件监听器通过 attrs 传给根 span。
- 组件 ref 暴露只读 `element`，指向根 `HTMLSpanElement`；`convertIcon` 由 `@aifuxi/semi-icons-vue` 导出。

#### Vue 事件

**Icon 原生监听器**

| 事件                                | 参数                | 说明               |
| ----------------------------------- | ------------------- | ------------------ |
| click                               | [event: MouseEvent] | 点击图标           |
| mousedown / mouseup                 | [event: MouseEvent] | 按下或抬起鼠标按钮 |
| mouseenter / mouseleave / mousemove | [event: MouseEvent] | 鼠标指针事件       |

#### Vue 插槽

**Icon**

| 插槽    | 作用域参数 | 说明                                   |
| ------- | ---------- | -------------------------------------- |
| default | {}         | 自定义 SVG 内容；对应程序化 `svg` prop |

### Icon

| 属性      | 说明                                                                              | 类型       | 默认值    |
| --------- | --------------------------------------------------------------------------------- | ---------- | --------- |
| fill      | 双色，多色图标的填充颜色                                                          | IconFill   | 无        |
| prefixCls | 样式类名前缀                                                                      | string     | `semi`    |
| rotate    | 旋转度数                                                                          | number     | —         |
| size      | 尺寸，支持`inherit`，`extra-small`，`small`， `default`， `large`， `extra-large` | IconSize   | `default` |
| spin      | 旋转动画                                                                          | boolean    | false     |
| svg       | 图标内容                                                                          | VNodeChild | 无        |
| type      | 图标类型；用于类型 class 与默认 aria-label                                        | string     | —         |

## Accessibility

### ARIA

- Icon 组件 role 为 img，它的 aria-label 默认为组件的文件名。例如 IconHome 的 aria-label 为 `home`，如果你有更好的语义化名字，可以通过 aria-label 传入。

<DemoBlock id="zh-CN-basic-icon-10" title="ARIA" kind="live" />

- Icon 内部的 svg 元素为装饰元素，默认设置了 aria-hidden 以不被屏幕阅读器阅读
