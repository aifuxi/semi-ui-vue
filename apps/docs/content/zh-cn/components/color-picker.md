---
title: '颜色选择器'
description: '快速便捷地选择颜色，并提供滴管工具取色'
locale: 'zh-CN'
slug: 'color-picker'
category: 'input'
order: 38
englishTitle: 'ColorPicker'
icon: 'doc-colorPlatteNew'
upstream: 'input/colorpicker'
---

## 代码演示

### 如何引入

ColorPicker 从 v2.64.0 开始支持

```ts
import { ColorPicker } from '@aifuxi/semi-ui-vue/color-picker';
import '@aifuxi/semi-theme-default/color-picker.css';
```

### 基本用法

#### 放在弹层

::demo-block{demo="color-picker/zh-cn/Popover" title="放在弹层"}
::

#### 正常展示

::demo-block{demo="color-picker/zh-cn/Basic" title="正常展示"}
::

### 滴管取色器

使用 `:eye-dropper="true"` 开启滴管功能，支持从浏览器内或外部软件屏幕取色。

> **注意事项**
>
> 开启此功能需要当前网页部署在 HTTPS 或 localhost 域名等安全 context 下，否则无效果。需用户浏览器版本 Chromium > 95

::demo-block{demo="color-picker/zh-cn/EyeDropper" title="滴管取色器"}
::

### 默认值

在进行各种颜色表示格式之间相互转换时，部分格式之间存在理论误差，因此 @change 返回给你的值是同时包含了 hsva hex rgba 三种格式的色值的对象。

你传入的 defaultValue(非受控) 和 value(受控) 也应当是同样包含三种格式的对象。

我们在组件类上提供了静态工具函数 `colorStringToValue`，用于将常见颜色字符串转换为该对象，支持 rgb(57,197,187) #39c5bb hsv(176,71,77) 等字符串直接传入。

::demo-block{demo="color-picker/zh-cn/DefaultValue" title="默认值"}
::

### 受控

通过 `v-model` 双向绑定颜色值，或通过 `:value` 与 `@change` 控制。

::demo-block{demo="color-picker/zh-cn/Controlled" title="受控"}
::

### 顶部和底部渲染额外元素

使用 `#top` 和 `#bottom` 插槽在顶部和底部渲染额外元素。

::demo-block{demo="color-picker/zh-cn/Slots" title="顶部和底部渲染额外元素"}
::

## API 参考

### ColorPickerProps

| 属性            | 类型                      | 默认值                 | 说明                                                  |
| --------------- | ------------------------- | ---------------------- | ----------------------------------------------------- |
| `alpha`         | `boolean`                 | `true`                 | 是否开启透明度选择                                    |
| `bottomSlot`    | `VNodeChild`              | `—`                    | 底部额外内容；可使用 bottom 插槽。                    |
| `class`         | `HTMLAttributes['class']` | `—`                    | Vue 类名绑定。                                        |
| `className`     | `HTMLAttributes['class']` | `—`                    | 类名                                                  |
| `defaultFormat` | `ColorPickerFormat`       | `'hex'`                | 默认手动输入时的格式                                  |
| `defaultValue`  | `ColorValue`              | `#39c5bb (ColorValue)` | 非受控初始值；后续变化使用 v-model。                  |
| `eyeDropper`    | `boolean`                 | `true`                 | 是否开启滴管拾色器                                    |
| `height`        | `number`                  | `280`                  | 颜色面板高度，单位 px。                               |
| `modelValue`    | `ColorValue`              | `—`                    | 双向绑定值，使用 v-model；不要与 value 同时传入。     |
| `popoverProps`  | `PopoverProps`            | `{}`                   | usePopover=true 时的 Popover 配置。                   |
| `style`         | `StyleValue`              | `—`                    | Vue 样式对象或数组。                                  |
| `topSlot`       | `VNodeChild`              | `—`                    | 顶部额外内容；可使用 top 插槽。                       |
| `usePopover`    | `boolean`                 | `false`                | 是否放入Popover渲染                                   |
| `value`         | `ColorValue`              | `—`                    | 受控值；与 v-model:value 配合时由 update:value 同步。 |
| `width`         | `number`                  | `280`                  | 颜色面板宽度，单位 px。                               |

`—` 表示未设置独立默认值。普通 `class` / `style` 可用于 Vue 属性绑定；Boolean 默认值以当前实现为准。

### 事件

| 事件                | 参数                  | 说明                    |
| ------------------- | --------------------- | ----------------------- |
| `change`            | `[value: ColorValue]` | 选择或输入导致值变化。  |
| `update:modelValue` | `[value: ColorValue]` | 同步 v-model 值。       |
| `update:value`      | `[value: ColorValue]` | 同步 v-model:value 值。 |

通过 `@change` 监听值变化；双向绑定使用 `v-model` 或 `v-model:value`。

### 插槽

| 插槽       | 签名               | 说明                         |
| ---------- | ------------------ | ---------------------------- |
| `#bottom`  | `() => VNodeChild` | 面板底部内容。               |
| `#default` | `() => VNodeChild` | usePopover=true 时的触发器。 |
| `#top`     | `() => VNodeChild` | 面板顶部内容。               |

## Methods

颜色字符串转换是公开模块函数，同时保留静态方法；组件没有公开实例方法。

```ts
import { ColorPicker, colorStringToValue } from '@aifuxi/semi-ui-vue/color-picker';
const value = colorStringToValue('#39c5bb');
const sameValue = ColorPicker.colorStringToValue('#39c5bb');
```

## 类型定义

```ts
export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface HsvaColor extends HsvColor {
  a: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface RgbaColor extends RgbColor {
  a: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
}

export interface HslaColor extends HslColor {
  a: number;
}

export type ObjectColor = RgbColor | HslColor | HsvColor | RgbaColor | HslaColor | HsvaColor;

export type AnyColor = string | ObjectColor;

export interface ColorModel<T extends AnyColor> {
  defaultColor: T;
  toHsva(defaultColor: T): HsvaColor;
  fromHsva(hsva: HsvaColor): T;
  equal(first: T, second: T): boolean;
}

export interface ColorValue {
  hsva: HsvaColor;
  rgba: RgbaColor;
  hex: string;
}

export type ColorPickerFormat = 'hex' | 'rgba' | 'hsva';
```

## Accessibility

### ARIA、键盘和焦点

颜色区域和透明度区域提供 aria-label 与 aria-valuetext；色相、颜色和透明度拖动区域当前没有 slider 角色或方向键调整契约。颜色格式 Select 与数值输入框可通过 Tab 操作；需要完整键盘输入时应提供明确标签的颜色文本输入及校验。

滴管依赖浏览器 EyeDropper API 与用户激活，只有浏览器支持时才可用；取消选择不应被当作颜色变更。自定义 Popover 触发器应使用具有可访问名称的按钮。

## 设计变量

::token-table{component="colorPicker"}
::

## FAQ

### 如何用颜色字符串设置初值？

调用公开 colorStringToValue(raw)，或 ColorPicker.colorStringToValue(raw)，将字符串转换为同时包含 hsva、rgba 和 hex 的 ColorValue。

### 隐藏透明度会改变值格式吗？

alpha=false 隐藏透明度控件，change 仍返回完整 ColorValue；不要将返回值按字符串处理。

### 为什么看不到滴管或无法取色？

eyeDropper 只控制功能开关；实际能力取决于浏览器 EyeDropper API、用户激活及运行环境。静态编译无法证明取色能力。

## React → Vue 迁移

| React                                 | Vue                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                   | `@aifuxi/semi-ui-vue/color-picker` + `@aifuxi/semi-theme-default/color-picker.css` |
| `useState` / `useMemo`                | `ref` / `shallowRef` / `computed`                                                  |
| `value` + `onChange`                  | `v-model` / `v-model:value` / `:value` + `@change`                                 |
| `className` / `ReactNode`             | Vue `class` / `VNodeChild` 与插槽                                                  |
| `children`                            | 默认插槽作为 Popover 触发器                                                        |
| `topSlot` / `bottomSlot`              | `#top` / `#bottom`                                                                 |
| `ColorPicker.colorStringToValue(raw)` | 保留静态方法，也可直接导入 colorStringToValue                                      |
