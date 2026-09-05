---
title: '单选框'
description: '用户使用单选框来从少量的选项集合中选择单个选项'
locale: 'zh-CN'
slug: 'radio'
category: 'input'
order: 44
englishTitle: 'Radio'
icon: 'doc-radio'
upstream: 'input/radio'
---

## 使用场景

单选框(Radio)也叫单选按钮，它允许用户在一组选项中选择其中一个。  
当选项很多时，单选下拉菜单（Select）可能比较适合，因为它所占用的画面空间比单选按钮来得要少。

## 代码演示

### 如何引入

```ts
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import '@aifuxi/semi-theme-default/radio.css';
```

### 基本用法

::demo-block{demo="radio/zh-cn/Basic" title="基本用法"}
::

### 带辅助文本

通过`extra`设置辅助文本，可以是任意类型的 VNodeChild

::demo-block{demo="radio/zh-cn/Extra" title="带辅助文本"}
::

### 禁用

Radio 不可用

::demo-block{demo="radio/zh-cn/Disabled" title="禁用"}
::

### 高级模式

高级模式（mode='advanced'）checked 可以通过点击转换为 unchecked。

::demo-block{demo="radio/zh-cn/Advanced" title="高级模式"}
::

### 单选组合

一组互斥的 Radio 配合使用

::demo-block{demo="radio/zh-cn/Group" title="单选组合"}
::

### 垂直排列

可通过给 RadioGroup 设置 `direction`属性来决定 组内的 radio 元素水平排列或者垂直排列

::demo-block{demo="radio/zh-cn/Vertical" title="垂直排列"}
::

### 按钮样式

可以利用 `type='button'` 来设置 button 样式类型的单选器，并且，button 类型单选器支持三种尺寸大小。

需要注意的是: button 类型的单选器暂不支持辅助文本（`extra`）和垂直排列（`direction='vertical'`）。

::demo-block{demo="radio/zh-cn/Button" title="按钮样式"}
::

### 卡片样式

可以给 `RadioGroup` 设置 `type='card'` 实现带有背景的卡片样式。

::demo-block{demo="radio/zh-cn/Card" title="卡片样式"}
::

### 无 radio 的纯卡片样式

可以给 `RadioGroup` 设置 `type='pureCard'` 实现带有背景且无 radio 的纯卡片样式。

::demo-block{demo="radio/zh-cn/PureCard" title="无 radio 的纯卡片样式"}
::

### 配置 options

通过配置 options 参数来渲染单选框

::demo-block{demo="radio/zh-cn/Options" title="配置 options"}
::

## API 参考

### Radio

| 属性             | 类型                                            | 默认值      | 说明                                                                   |
| ---------------- | ----------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `addonClassName` | `string`                                        | `—`         | 标签内容容器类名。                                                     |
| `addonId`        | `string`                                        | `—`         | 标签容器 id；未设置时由组件生成。                                      |
| `addonStyle`     | `CSSProperties`                                 | `—`         | 标签内容容器内联样式。                                                 |
| `ariaLabel`      | `string`                                        | `—`         | 可访问名称；模板写作 aria-label。                                      |
| `autoFocus`      | `boolean`                                       | `false`     | 挂载后自动聚焦。                                                       |
| `checked`        | `boolean \| undefined`                          | `—`         | 受控选中状态；在 Group 中由组值决定。                                  |
| `className`      | `string`                                        | `—`         | 兼容 className；模板优先使用 class。                                   |
| `defaultChecked` | `boolean`                                       | `false`     | 非受控初始选中状态。                                                   |
| `disabled`       | `boolean`                                       | `false`     | 禁用交互及键盘焦点；Group 对全部子项生效。                             |
| `displayMode`    | `'' \| 'vertical'`                              | `—`         | 独立 Radio 的内容排列。                                                |
| `extra`          | `VNodeChild`                                    | `—`         | 辅助文本，支持 VNodeChild 或 #extra 插槽；Radio 的 button 类型不显示。 |
| `extraId`        | `string`                                        | `—`         | 辅助文本容器 id；未设置时由组件生成。                                  |
| `mode`           | `'' \| 'advanced'`                              | `''`        | advanced 允许再次点击取消选中。                                        |
| `modelValue`     | `boolean \| undefined`                          | `—`         | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。     |
| `name`           | `string`                                        | `—`         | 组内原生 input 的 name；独立组使用不同名称。                           |
| `prefixCls`      | `string`                                        | `—`         | CSS class 前缀；自定义前缀需要提供对应样式。                           |
| `preventScroll`  | `boolean`                                       | `—`         | 聚焦时禁止自动滚动文档。                                               |
| `style`          | `CSSProperties`                                 | `—`         | Vue 内联样式。                                                         |
| `type`           | `'default' \| 'button' \| 'card' \| 'pureCard'` | `'default'` | 样式类型，枚举见类型列。                                               |
| `value`          | `string \| number \| boolean`                   | `—`         | 受控值或组内选项标识，见下方状态说明。                                 |

### RadioGroup

| 属性               | 类型                                                      | 默认值         | 说明                                                               |
| ------------------ | --------------------------------------------------------- | -------------- | ------------------------------------------------------------------ |
| `ariaDescribedby`  | `string`                                                  | `—`            | 关联描述节点 id，模板写作 aria-describedby。                       |
| `ariaErrormessage` | `string`                                                  | `—`            | 关联错误信息节点 id。                                              |
| `ariaInvalid`      | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`            | ARIA 无效状态。                                                    |
| `ariaLabel`        | `string`                                                  | `—`            | 可访问名称；模板写作 aria-label。                                  |
| `ariaLabelledby`   | `string`                                                  | `—`            | 关联标签节点 id，模板写作 aria-labelledby。                        |
| `ariaRequired`     | `boolean \| 'false' \| 'true'`                            | `—`            | ARIA 必填状态。                                                    |
| `buttonSize`       | `'small' \| 'middle' \| 'large'`                          | `'middle'`     | button 类型 Radio 的尺寸。                                         |
| `className`        | `string`                                                  | `—`            | 兼容 className；模板优先使用 class。                               |
| `defaultValue`     | `string \| number \| boolean`                             | `—`            | 非受控初始值。                                                     |
| `direction`        | `'horizontal' \| 'vertical'`                              | `'horizontal'` | 组内排列方向；Radio button 类型忽略垂直布局。                      |
| `disabled`         | `boolean`                                                 | `false`        | 禁用交互及键盘焦点；Group 对全部子项生效。                         |
| `id`               | `string`                                                  | `—`            | 组件节点 id。                                                      |
| `mode`             | `'' \| 'advanced'`                                        | `''`           | advanced 允许再次点击取消选中。                                    |
| `modelValue`       | `string \| number \| boolean \| undefined`                | `—`            | 默认 v-model 的受控值；兼容 checked/value 同时传入时优先使用后者。 |
| `name`             | `string`                                                  | `'default'`    | 组内原生 input 的 name；独立组使用不同名称。                       |
| `options`          | `Array<string \| RadioOption>`                            | `—`            | 字符串或选项对象数组；设置后优先于默认插槽。                       |
| `prefixCls`        | `string`                                                  | `—`            | CSS class 前缀；自定义前缀需要提供对应样式。                       |
| `style`            | `CSSProperties`                                           | `—`            | Vue 内联样式。                                                     |
| `type`             | `'default' \| 'button' \| 'card' \| 'pureCard'`           | `'default'`    | 样式类型，枚举见类型列。                                           |
| `value`            | `string \| number \| boolean \| undefined`                | `—`            | 受控值或组内选项标识，见下方状态说明。                             |

### RadioOption

| 属性             | 类型                          | 默认值 | 说明                                                                   |
| ---------------- | ----------------------------- | ------ | ---------------------------------------------------------------------- |
| `label`          | `VNodeChild`                  | `—`    | 选项显示内容。                                                         |
| `value`          | `string \| number \| boolean` | `—`    | 受控值或组内选项标识，见下方状态说明。                                 |
| `disabled`       | `boolean`                     | `—`    | 禁用交互及键盘焦点；Group 对全部子项生效。                             |
| `extra`          | `VNodeChild`                  | `—`    | 辅助文本，支持 VNodeChild 或 #extra 插槽；Radio 的 button 类型不显示。 |
| `style`          | `CSSProperties`               | `—`    | Vue 内联样式。                                                         |
| `className`      | `string`                      | `—`    | 兼容 className；模板优先使用 class。                                   |
| `addonId`        | `string`                      | `—`    | 标签容器 id；未设置时由组件生成。                                      |
| `addonStyle`     | `CSSProperties`               | `—`    | 标签内容容器内联样式。                                                 |
| `addonClassName` | `string`                      | `—`    | 标签内容容器类名。                                                     |
| `extraId`        | `string`                      | `—`    | 辅助文本容器 id；未设置时由组件生成。                                  |

### 事件与插槽

`Radio`: `change(event: RadioChangeEvent)`, `update:checked(checked: boolean)`, `update:modelValue(checked: boolean)`.

`RadioGroup`: `change(event: RadioChangeEvent)`, `update:value(value)`, `update:modelValue(value)`.

默认插槽提供标签或组内组件，`#extra` 提供辅助内容。

`Radio`: `mouseenter(event: MouseEvent)`, `mouseleave(event: MouseEvent)`.

事件的 `target.checked` 是下一选中状态，`target.value` 是选项值；包含 `stopPropagation()` / `preventDefault()`。Checkbox 还提供 `nativeEvent.stopImmediatePropagation()`。

Group 控制组值；无需再设置子项 checked。Checkbox 子项只有显式传入 value 才加入 Group。Radio advanced 模式取消选择时组值为 undefined。

`class`、`style` 使用 Vue 原生属性。ARIA 属性使用类型列中的 camelCase，模板可写为 `aria-label`、`aria-labelledby`、`aria-describedby` 等。

## 方法

通过模板 ref 调用 `focus()` 和 `blur()`。Checkbox / Radio 另公开只读 `input` 引用。

事件顺序：每次变更先派发 `change`，再派发 `update:checked`（Group 为 `update:value`）、`update:modelValue`。 组内交互先通知 Group，再通知 Radio 子项。

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

## 设计变量

::token-table{component="radio"}
::

## 相关物料

相关表单组合可继续查看 [Radio](/zh-cn/components/radio/)、[Switch](/zh-cn/components/switch/) 与 [Form](/zh-cn/components/form/)。

## React → Vue 迁移

| React                                                   | Vue                                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------------- |
| `import { Radio, RadioGroup } from '@douyinfe/semi-ui'` | `@aifuxi/semi-ui-vue/radio` + `@aifuxi/semi-theme-default/radio.css` |
| `useState` / `setState`                                 | `shallowRef` / `computed`                                            |
| `className` / `style={{ ... }}`                         | `class` / `:style="{ ... }"`                                         |
| `checked` + `onChange`                                  | `v-model` / `v-model:checked` / `:checked` + `@change`               |
| `defaultChecked`                                        | `default-checked`                                                    |
| `Radio.Group`                                           | `RadioGroup`                                                         |
| Group `value` + `onChange`                              | `v-model` / `v-model:value` / `:value` + `@change`                   |
| `children` / `extra={<Node />}`                         | 默认插槽 / `#extra` 插槽                                             |
| `ref.current.focus()` / `.blur()`                       | 模板 ref 的 `focus()` / `blur()`                                     |

## FAQ

### 为什么再次点击无法取消选中？

普通 Radio 是互斥的原生 radio。需要取消选择时显式设置 mode="advanced"；Group 的取消值为 undefined。独立组应配置不同 name，避免原生输入互相影响。

### 为什么绑定 checked/value 后点击状态没有变化？

受控组件只请求变更，父级必须写回新值。推荐使用 v-model；使用 @change 时注意 Checkbox/Radio 的事件对象和 Switch/Rating 的直接值签名不同。默认值仅用于初始化。
