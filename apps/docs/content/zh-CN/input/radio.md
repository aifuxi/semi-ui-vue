---
title: 'Radio 单选框'
description: '用户使用单选框来从少量的选项集合中选择单个选项'
type: 'input'
order: 44
icon: 'doc-radio'
---

## 使用场景

单选框(Radio)也叫单选按钮，它允许用户在一组选项中选择其中一个。
当选项很多时，单选下拉菜单（Select）可能比较适合，因为它所占用的画面空间比单选按钮来得要少。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/radio` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-radio-1" title="如何引入" kind="import" />

### 基本用法

<DemoBlock id="zh-CN-input-radio-2" title="基本用法" kind="live" />

### 带辅助文本

通过`extra`设置辅助文本，可以是任意类型的 VNodeChild

<DemoBlock id="zh-CN-input-radio-3" title="带辅助文本" kind="live" />

### 禁用

Radio 不可用

<DemoBlock id="zh-CN-input-radio-4" title="禁用" kind="live" />

### 高级模式

高级模式（mode='advanced'）checked 可以通过点击转换为 unchecked。

<DemoBlock id="zh-CN-input-radio-5" title="高级模式" kind="live" />

### 单选组合

一组互斥的 Radio 配合使用

<DemoBlock id="zh-CN-input-radio-6" title="单选组合" kind="live" />

### 垂直排列

可通过给 RadioGroup 设置 `direction`属性来决定 组内的 radio 元素水平排列或者垂直排列

<DemoBlock id="zh-CN-input-radio-7" title="垂直排列" kind="live" />

### 按钮样式

可以利用 `type='button'` 来设置 button 样式类型的单选器，并且，button 类型单选器支持三种尺寸大小。

需要注意的是: button 类型的单选器暂不支持辅助文本（`extra`）和垂直排列（`direction='vertical'`）。

<DemoBlock id="zh-CN-input-radio-8" title="按钮样式" kind="live" />

### 卡片样式

可以给 `RadioGroup` 设置 `type='card'` 实现带有背景的卡片样式。

<DemoBlock id="zh-CN-input-radio-9" title="卡片样式" kind="live" />

### 无 radio 的纯卡片样式

可以给 `RadioGroup` 设置 `type='pureCard'` 实现带有背景且无 radio 的纯卡片样式。

<DemoBlock id="zh-CN-input-radio-10" title="无 radio 的纯卡片样式" kind="live" />

### 配置 options

通过配置 options 参数来渲染单选框

<DemoBlock id="zh-CN-input-radio-11" title="配置 options" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/radio/types.ts` 的公开类型为准。

- `Radio`：`v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。
- `Radio.Group`：`v-model` 对应 `modelValue`，同时支持 `v-model:value`。

#### Vue 事件

**Radio**

| 事件                    | 参数                      | 说明               |
| ----------------------- | ------------------------- | ------------------ |
| change                  | [event: RadioChangeEvent] | 选中状态变化       |
| mouseenter / mouseleave | [event: MouseEvent]       | 指针进入或离开选项 |

**Radio.Group**

| 事件   | 参数                      | 说明         |
| ------ | ------------------------- | ------------ |
| change | [event: RadioChangeEvent] | 组选中值变化 |

#### Vue 插槽

**Radio**

| 插槽    | 作用域参数 | 说明       |
| ------- | ---------- | ---------- |
| default | {}         | 单选框内容 |
| extra   | {}         | 辅助文本   |

**Radio.Group**

| 插槽    | 作用域参数 | 说明         |
| ------- | ---------- | ------------ |
| default | {}         | Radio 子组件 |

### Radio

| 属性           | 说明                                                                                                                                                                                                   | 类型                 | 默认值    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------- |
| addonClassName | 包裹内容容器的样式类名                                                                                                                                                                                 | string               | —         |
| addonId        | addon 节点 id，aria-labelledby 指向这个 id，若无设置会随机生成一个 id **v2.11.0 后提供**                                                                                                               | string               | —         |
| addonStyle     | 包裹内容容器的内联样式                                                                                                                                                                                 | CSSProperties        | —         |
| ariaLabel      | Radio 的 label                                                                                                                                                                                         | string               | -         |
| autoFocus      | 自动获取焦点                                                                                                                                                                                           | boolean              | false     |
| checked        | 指定当前是否选中                                                                                                                                                                                       | boolean \| undefined | false     |
| className      | 样式类名                                                                                                                                                                                               | string               | —         |
| defaultChecked | 初始是否选中                                                                                                                                                                                           | boolean              | false     |
| disabled       | 禁选单选框                                                                                                                                                                                             | boolean              | false     |
| displayMode    | —                                                                                                                                                                                                      | RadioDisplayMode     | —         |
| extra          | 副文本，只对type='default'生效                                                                                                                                                                         | VNodeChild           | -         |
| extraId        | 副文本的 id，aria-describedby 指向这个 id，若无设置会随机生成一个 id **v2.11.0 后提供**                                                                                                                | string               | -         |
| mode           | 高级和普通模式，高级模式可以在 checked 时点击变成 unchecked，可选值 advanced                                                                                                                           | RadioMode            | -         |
| modelValue     | —                                                                                                                                                                                                      | boolean \| undefined | —         |
| name           | Radio组件中`input[type="radio"]`的`name`属性，具有相同`name`的Radio属于同一个RadioGroup，`name`属性可参考 [MDN Radio](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/radio#%E5%80%BC) | string               | -         |
| prefixCls      | —                                                                                                                                                                                                      | string               | —         |
| preventScroll  | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                  | boolean              | —         |
| style          | 内联样式                                                                                                                                                                                               | CSSProperties        | —         |
| type           | 设置 radio的样式类型，可选值为：`default`、`button`、`card`、`pureCard` **该 api 在 v2.18.0 后提供**                                                                                                   | RadioType            | `default` |
| value          | 根据 value 进行比较，判断是否选中                                                                                                                                                                      | RadioValue           | -         |

### RadioGroup

单选框组合，用于包裹一组 `Radio`。

| 属性             | 说明                                                                       | 类型                                                    | 默认值       |
| ---------------- | -------------------------------------------------------------------------- | ------------------------------------------------------- | ------------ |
| ariaDescribedby  | —                                                                          | string                                                  | —            |
| ariaErrormessage | —                                                                          | string                                                  | —            |
| ariaInvalid      | —                                                                          | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling' | —            |
| ariaLabel        | RadioGroup 的 label                                                        | string                                                  | -            |
| ariaLabelledby   | —                                                                          | string                                                  | —            |
| ariaRequired     | —                                                                          | boolean \| 'false' \| 'true'                            | —            |
| buttonSize       | type='button'的radio的尺寸大小，可选值为：`small`、`middle`、`large`       | RadioButtonSize                                         | `middle`     |
| className        | 样式类名                                                                   | string                                                  | —            |
| defaultValue     | 默认选中的值                                                               | RadioValue                                              | -            |
| direction        | radio 排列方向, 只对type='default'生效，可选值`horizontal`、`vertical`     | RadioDirection                                          | `horizontal` |
| disabled         | 禁选所有子单选器                                                           | boolean                                                 | false        |
| id               | —                                                                          | string                                                  | —            |
| mode             | 高级和普通模式，可以在 checked 时点击变成 unchecked，可选值 advanced       | RadioMode                                               | -            |
| modelValue       | —                                                                          | RadioValue \| undefined                                 | —            |
| name             | RadioGroup 下所有 `input[type="radio"]` 的 `name` 属性                     | string                                                  | -            |
| options          | 以配置形式设置子元素                                                       | Array&lt;string \| RadioOption&gt;                      | -            |
| prefixCls        | —                                                                          | string                                                  | —            |
| style            | 内联样式                                                                   | CSSProperties                                           | —            |
| type             | 设置所有radio的样式类型，可选值为：`default`、`button`、`card`、`pureCard` | RadioType                                               | `default`    |
| value            | 用于设置当前选中的值                                                       | RadioValue \| undefined                                 | -            |

## Methods

### Radio

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移除焦点 |
| focus() | 获取焦点 |

## Accessibility

### ARIA

- `aria-label`：用于解释 Radio 或 RadioGroup 的作用
- `aria-labelledby` 默认指向 addon 节点，用于解释 Radio 的内容
- `aria-describedby` 默认指向 extra 节点，用于补充解释 Radio 的内容

### 键盘和焦点

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/

- RadioGroup 可以被获取焦点，初始焦点设置：
- 当 RadioGroup 中没有被选择项时，初始焦点为第一个 Radio 项上
- 当 RadioGroup 中有选中项时，初始焦点为选中的 Radio 项上
- 在同一个 radiogroup 内
- 可以通过 `右箭头` 或 `下箭头` 将焦点移动到下一个 Radio 项上，同时取消先前的 Radio 项的选中状态，并选中当前聚焦的 Radio 项
- 可以通过 `左箭头` 或 `上箭头` 将焦点移动到上一个 Radio 项上，同时取消先前的 Radio 项的选中状态，并选中当前聚焦的 Radio 项
- 若 RadioGroup 中没有选中项，可以 `Space` 键选中初始焦点

## 文案规范

- 首字母大写
- 不使用标点符号
