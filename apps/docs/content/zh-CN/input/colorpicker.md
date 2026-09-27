---
title: 'ColorPicker 颜色选择器'
description: '快速便捷地选择颜色，并提供滴管工具取色'
type: 'input'
order: 38
icon: 'doc-colorPlatteNew'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/color-picker` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

ColorPicker 从 v2.64.0 开始支持

<DemoBlock id="zh-CN-input-colorpicker-1" title="如何引入" kind="import" />

### 基本用法

#### 放在弹层

<DemoBlock id="zh-CN-input-colorpicker-2" title="放在弹层" kind="live" />

#### 正常展示

<DemoBlock id="zh-CN-input-colorpicker-3" title="正常展示" kind="live" />

### 滴管取色器

使用 `eyeDropper={true}` 开启滴管功能，支持从浏览器内或外部软件屏幕取色。

<DemoBlock id="zh-CN-input-colorpicker-4" title="滴管取色器" kind="live" />

### 默认值

在不同颜色格式之间转换时可能存在理论误差，因此 `change` 事件返回同时包含 hsva、hex、rgba 三种格式的 `ColorValue`。

`defaultValue` 与 `v-model` / `v-model:value` 也应使用同时包含三种格式的 `ColorValue`。

我们在组件类上提供了静态工具函数 `colorStringToValue`，用于将常见颜色字符串转换为该对象，支持 rgb(57,197,187) #39c5bb hsv(176,71,77) 等字符串直接传入。

<DemoBlock id="zh-CN-input-colorpicker-5" title="默认值" kind="live" />

### 受控

使用 `v-model` 双向绑定，也可使用兼容的 `v-model:value`。

<DemoBlock id="zh-CN-input-colorpicker-6" title="受控" kind="live" />

### 顶部和底部渲染额外元素

使用 `#top` 和 `#bottom` 插槽在顶部和底部渲染额外内容；也保留同名 VNode props。

<DemoBlock id="zh-CN-input-colorpicker-7" title="顶部和底部渲染额外元素" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/color-picker/types.ts`、`packages/ui/src/color-picker/index.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。

#### Vue 用法

- `popoverProps` 是传给 Popover 的嵌套配置，其中回调字段保持 callback prop 语义。
- `topSlot`、`bottomSlot` 保留 VNode prop 入口；同名 Vue 插槽优先。
- 默认插槽只在 `usePopover` 为 true 时作为触发元素。

#### Vue 静态方法

**ColorPicker**

| 方法                             | 签名                           | 说明                                                    |
| -------------------------------- | ------------------------------ | ------------------------------------------------------- |
| `ColorPicker.colorStringToValue` | (raw: string) =&gt; ColorValue | 将常见颜色字符串转换为 ColorValue；也可直接导入同名函数 |

#### Vue 事件

**ColorPicker**

| 事件              | 参数                | 说明                |
| ----------------- | ------------------- | ------------------- |
| change            | [value: ColorValue] | 用户选择的颜色变化  |
| update:modelValue | [value: ColorValue] | 更新默认 v-model    |
| update:value      | [value: ColorValue] | 更新兼容 value 绑定 |

#### Vue 插槽

**ColorPicker**

| 插槽    | 作用域参数 | 说明                 |
| ------- | ---------- | -------------------- |
| default | {}         | Popover 模式触发元素 |
| top     | {}         | 面板顶部额外内容     |
| bottom  | {}         | 面板底部额外内容     |

| 参数          | 说明                                  | 类型                    | 默认值                      |
| ------------- | ------------------------------------- | ----------------------- | --------------------------- |
| alpha         | 是否开启透明度选择                    | boolean                 | true                        |
| bottomSlot    | 底部 VNode 内容；bottom 插槽优先      | VNodeChild              | -                           |
| class         | Vue 原生类名                          | HTMLAttributes['class'] | —                           |
| className     | 样式类名                              | HTMLAttributes['class'] | -                           |
| defaultFormat | 默认手动输入时的格式                  | ColorPickerFormat       | `hex`                       |
| defaultValue  | 默认值                                | ColorValue              | `#39c5bb` 对应的 ColorValue |
| eyeDropper    | 是否开启滴管拾色器                    | boolean                 | true                        |
| height        | 高度                                  | number                  | 280                         |
| modelValue    | `v-model` 绑定值                      | ColorValue              | —                           |
| popoverProps  | 放入 Popover 时，Popover 传入的 props | PopoverProps            | {}                          |
| style         | 样式                                  | StyleValue              | -                           |
| topSlot       | 顶部 VNode 内容；top 插槽优先         | VNodeChild              | -                           |
| usePopover    | 是否放入Popover渲染                   | boolean                 | false                       |
| value         | 兼容受控值                            | ColorValue              | —                           |
| width         | 宽度                                  | number                  | 280                         |
