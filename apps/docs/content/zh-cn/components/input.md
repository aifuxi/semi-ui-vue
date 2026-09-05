---
title: '输入框'
description: '输入框是最基本的接收用户文本输入的组件'
locale: 'zh-CN'
slug: 'input'
category: 'input'
order: 41
englishTitle: 'Input'
icon: 'doc-input'
upstream: 'input/input'
---

## 代码演示

### 如何引入

```ts
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
```

### 基本

基本使用

::demo-block{demo="input/zh-cn/Basic" title="基本"}
::

### 三种大小

默认定义了三种尺寸：大、默认、小

::demo-block{demo="input/zh-cn/Size" title="三种大小"}
::

### 不可用

设定 `disabled` 属性为 `true`

::demo-block{demo="input/zh-cn/Disabled" title="不可用"}
::

### 前缀/后缀

在输入框上增加前缀、后缀图标，可以是 VNodeChild

当 prefix、suffix 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0

::demo-block{demo="input/zh-cn/Affixes" title="前缀/后缀"}
::

### 前置/后置标签

在输入框上增加前置/后置标签

当 addonBefore、addonAfter 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0

::demo-block{demo="input/zh-cn/Addons" title="前置/后置标签"}
::

### 带移除图标

点击图标删除所有内容

::demo-block{demo="input/zh-cn/Clear" title="带移除图标"}
::

### 密码模式

隐藏输入的具体内容

::demo-block{demo="input/zh-cn/Password" title="密码模式"}
::

### 校验状态

可设置不同校验状态，展示不同样式

::demo-block{demo="input/zh-cn/Validation" title="校验状态"}
::

### 受控组件

`Input` 值完全取决于传入的 `value` 值，配合 `@change` 回调函数使用

::demo-block{demo="input/zh-cn/Controlled" title="受控组件"}
::

### 输入框组合

可以将多个输入框放入 InputGroup 的容器中，通过设置 `size` ，`disabled` 可统一设置组合中的输入框属性，支持输入框类型包括： `Input`， `InputNumber`， `Select`， `AutoComplete`、`TreeSelect`、`Cascader`、`DatePicker`

> **注意事项**
>
> InputGroup 不推荐插入非支持元素，Form.InputGroup 会对支持的元素进行错误聚合，而不会自定义元素进行处理。

::demo-block{demo="input/zh-cn/Group" title="输入框组合"}
::

::demo-block{demo="input/zh-cn/GroupTree" title="输入框组合"}
::

### 多行输入框

用于多行输入。通过设置 `maxCount` 属性可以进行字数限制并显示字数统计。支持 `showClear`。

::demo-block{demo="input/zh-cn/TextArea" title="多行输入框"}
::

### 设置 TextArea 高度

通过 `textareaStyle` 可以设置内部 textarea 元素的样式，如高度、背景色等。

::demo-block{demo="input/zh-cn/TextAreaHeight" title="设置 TextArea 高度"}
::

### 行号

通过设置 `showLineNumber` 展示行号。可用 `lineNumberStart` 设置起始行号，或通过 `lineNumberStyle`/`lineNumberClassName` 自定义行号区样式。

::demo-block{demo="input/zh-cn/LineNumbers" title="行号"}
::

### 使用 Shift + Enter 换行的多行输入框

TextArea 默认情况下 Enter 回车与 Shift + Enter 均可实现换行  
通过适当的事件监听与禁用默认行为，你可以实现禁用 Enter 换行，仅 Shift + Enter 才能换行

::demo-block{demo="input/zh-cn/ShiftEnter" title="使用 Shift + Enter 换行的多行输入框"}
::

### 自动扩展的多行输入框

通过设置 `autosize` 属性可设置只有高度自动随内容增加而变化。

::demo-block{demo="input/zh-cn/Autosize" title="自动扩展的多行输入框"}
::

### 自定义计算字符串长度

通过设置 `getValueLength` 属性可以自定义计算字符串长度。搭配 maxLength 和 minLength 可以支持 emoji 长度按照可见长度计算。

传入 getValueLength 时，Semi 内部做了什么：

- maxLength：不直接透传 maxLength 给原生 input。如果输入长度超出最大限制，则使用上一次输入的合法长度字符。
- minLength：动态切换 minLength 的长度，emoji 按照一个长度计算。
- maxCount：使用 getValueLength 获取的值与 maxCount 进行比较

::demo-block{demo="input/zh-cn/ValueLength" title="自定义计算字符串长度"}
::

一些问题的回答：

> 为何不直接引入 `grapheme-splitter` 包？这个包未压缩体积为 200+kB，对于不需要把 emoji 按照可见长度计算的用户来说，这个体积有点过大了。因此 Semi 选择把长度计算函数作为参数让用户传入。

> 为何不动态修改 maxLength？动态修改 maxLength 在输入操作完成以后，计算剩余可以输入的字符长度。 如 maxLength 设置为 1，想输入一个 length 为 2 的 '💖'，但是由于 input maxLength 的限制，这里根本就输入不进去，也就无法更新 maxLength。

### 输入法模式

通过设置 `composition` 属性为 `true`，可以开启输入法模式。在该模式下，使用输入法（如中文拼音）输入时，`@change` 不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次。适用于实时搜索等场景，避免在拼音输入过程中触发不必要的请求。

Input 和 TextArea 均支持该属性。

::demo-block{demo="input/zh-cn/Composition" title="输入法模式"}
::

## API 参考

### Input

| 属性                      | 类型                                                      | 默认值      | 说明                                                                                     |
| ------------------------- | --------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `ariaDescribedby`         | `string`                                                  | `—`         | 关联描述节点 id。                                                                        |
| `ariaErrormessage`        | `string`                                                  | `—`         | 关联错误信息节点 id。                                                                    |
| `ariaInvalid`             | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA 无效状态。                                                                          |
| `ariaLabel`               | `string`                                                  | `—`         | 可访问名称；模板写为 aria-label。                                                        |
| `ariaLabelledby`          | `string`                                                  | `—`         | 关联标签节点 id；模板写为 aria-labelledby。                                              |
| `ariaRequired`            | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA 必填状态。                                                                          |
| `addonAfter`              | `VNodeChild`                                              | `—`         | 后置标签                                                                                 |
| `addonBefore`             | `VNodeChild`                                              | `—`         | 前置标签                                                                                 |
| `autoFocus`               | `boolean`                                                 | `false`     | 挂载后自动聚焦。                                                                         |
| `borderless`              | `boolean`                                                 | `false`     | 无边框模式                                                                               |
| `className`               | `HTMLAttributes['class']`                                 | `—`         | 组的类名                                                                                 |
| `clearIcon`               | `VNodeChild`                                              | `—`         | 可用于自定义清除按钮, showClear为true时有效                                              |
| `composition`             | `boolean`                                                 | `false`     | 是否开启输入法模式，开启后输入法未确认期间不会触发 @change，输入法确认后触发一次 @change |
| `defaultValue`            | `InputValue`                                              | `—`         | 输入框内容默认值                                                                         |
| `disabled`                | `boolean`                                                 | `false`     | 禁用                                                                                     |
| `getValueLength`          | `(value: string) => number`                               | `—`         | 自定义计算字符串长度                                                                     |
| `hideSuffix`              | `boolean`                                                 | `false`     | 清除按钮与后缀标签并存时隐藏后缀标签，默认为false两者并列                                |
| `id`                      | `string`                                                  | `—`         | 组件节点 id。                                                                            |
| `inputStyle`              | `StyleValue`                                              | `—`         | 内部原生 input 样式。                                                                    |
| `insetLabel`              | `VNodeChild`                                              | `—`         | 内嵌标签，支持 insetLabel 插槽。                                                         |
| `insetLabelId`            | `string`                                                  | `—`         | 内嵌标签节点 id。                                                                        |
| `maxLength`               | `number`                                                  | `—`         | 最大输入长度；可配合 getValueLength 自定义计算方式。                                     |
| `minLength`               | `number`                                                  | `—`         | 最小输入长度；可配合 getValueLength 自定义计算方式。                                     |
| `mode`                    | `InputMode`                                               | `—`         | 输入框的模式，可选值password                                                             |
| `modelValue`              | `InputValue \| undefined`                                 | `—`         | v-model 的受控值。                                                                       |
| `onlyBorder`              | `number`                                                  | `—`         | 内部兼容边框样式参数。                                                                   |
| `placeholder`             | `InputValue`                                              | `—`         | 当前的默认值                                                                             |
| `prefix`                  | `VNodeChild`                                              | `—`         | 前缀标签                                                                                 |
| `preventScroll`           | `boolean`                                                 | `—`         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                    |
| `readonly`                | `boolean`                                                 | `false`     | 只读                                                                                     |
| `showClear`               | `boolean`                                                 | `false`     | 支持清除                                                                                 |
| `showClearIgnoreDisabled` | `boolean`                                                 | `—`         | 内部兼容选项，禁用状态下也允许清除按钮显示。                                             |
| `size`                    | `InputSize`                                               | `'default'` | 输入框大小，large、default、small                                                        |
| `suffix`                  | `VNodeChild`                                              | `—`         | 后缀标签                                                                                 |
| `type`                    | `string`                                                  | `'text'`    | 声明input类型，同原生input标签的type属性                                                 |
| `validateStatus`          | `InputValidateStatus`                                     | `'default'` | 校验状态，可选值default、error、warning，默认default。仅影响展示样式                     |
| `value`                   | `InputValue \| undefined`                                 | `—`         | 输入框内容                                                                               |

### TextArea

| 属性                        | 类型                                                      | 默认值      | 说明                                                                                       |
| --------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `ariaDescribedby`           | `string`                                                  | `—`         | 关联描述节点 id。                                                                          |
| `ariaErrormessage`          | `string`                                                  | `—`         | 关联错误信息节点 id。                                                                      |
| `ariaInvalid`               | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA 无效状态。                                                                            |
| `ariaLabel`                 | `string`                                                  | `—`         | 可访问名称；模板写为 aria-label。                                                          |
| `ariaLabelledby`            | `string`                                                  | `—`         | 关联标签节点 id；模板写为 aria-labelledby。                                                |
| `ariaRequired`              | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA 必填状态。                                                                            |
| `autoFocus`                 | `boolean`                                                 | `false`     | 挂载后自动聚焦。                                                                           |
| `autosize`                  | `boolean \| AutosizeRows`                                 | `false`     | 是否随着自动适应内容高度，可写成对象配置最小最大行数`{minRows?: number, maxRows?: number}` |
| `borderless`                | `boolean`                                                 | `false`     | 无边框模式                                                                                 |
| `className`                 | `HTMLAttributes['class']`                                 | `—`         | 组的类名                                                                                   |
| `cols`                      | `number`                                                  | `20`        | 默认列数                                                                                   |
| `composition`               | `boolean`                                                 | `false`     | 是否开启输入法模式，开启后输入法未确认期间不会触发 @change，输入法确认后触发一次 @change   |
| `defaultValue`              | `string`                                                  | `—`         | 输入框内容默认值                                                                           |
| `disabled`                  | `boolean`                                                 | `false`     | 禁用                                                                                       |
| `disabledEnterStartNewLine` | `boolean`                                                 | `false`     | 阻止 Enter 新增行，保留 Shift + Enter。                                                    |
| `getValueLength`            | `(value: string) => number`                               | `—`         | 自定义计算字符串长度                                                                       |
| `id`                        | `string`                                                  | `—`         | 组件节点 id。                                                                              |
| `lineNumberClassName`       | `HTMLAttributes['class']`                                 | `—`         | 行号区域 className                                                                         |
| `lineNumberStart`           | `number`                                                  | `1`         | 行号起始值                                                                                 |
| `lineNumberStyle`           | `StyleValue`                                              | `—`         | 行号区域样式                                                                               |
| `maxCount`                  | `number`                                                  | `—`         | 设置字数限制并显示字数统计                                                                 |
| `maxLength`                 | `number`                                                  | `—`         | 最大输入长度；可配合 getValueLength 自定义计算方式。                                       |
| `minLength`                 | `number`                                                  | `—`         | 最小输入长度；可配合 getValueLength 自定义计算方式。                                       |
| `modelValue`                | `string \| undefined`                                     | `—`         | v-model 的受控值。                                                                         |
| `placeholder`               | `string`                                                  | `—`         | 当前的默认值                                                                               |
| `preventScroll`             | `boolean`                                                 | `—`         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                      |
| `readonly`                  | `boolean`                                                 | `false`     | 只读                                                                                       |
| `resize`                    | `TextAreaResize`                                          | `—`         | 是否允许用户拖拽调整尺寸，及调整方向。可选值：`none` \                                     |
| `rows`                      | `number`                                                  | `4`         | 默认行数                                                                                   |
| `showClear`                 | `boolean`                                                 | `false`     | 支持清除                                                                                   |
| `showCounter`               | `boolean`                                                 | `false`     | 显示 TextArea 字符计数。                                                                   |
| `showLineNumber`            | `boolean`                                                 | `false`     | 是否展示行号                                                                               |
| `textareaStyle`             | `StyleValue`                                              | `—`         | textarea 元素的样式，可用于设置 textarea 的高度等样式                                      |
| `validateStatus`            | `InputValidateStatus`                                     | `'default'` | 校验状态，可选值default、error、warning，默认default。仅影响展示样式                       |
| `value`                     | `string \| undefined`                                     | `—`         | 输入框内容                                                                                 |

### InputGroup

| 属性            | 类型                        | 默认值      | 说明                              |
| --------------- | --------------------------- | ----------- | --------------------------------- |
| `className`     | `HTMLAttributes['class']`   | `—`         | 组的类名                          |
| `disabled`      | `boolean`                   | `—`         | 禁用                              |
| `label`         | `InputGroupLabelProps`      | `—`         | InputGroup 的 label 属性          |
| `labelPosition` | `'top' \| 'left' \| string` | `—`         | label 位置，可选 top 或 left      |
| `size`          | `InputSize`                 | `'default'` | 输入框大小，large、default、small |
| `style`         | `StyleValue`                | `—`         | 组的样式                          |

### InputGroupLabel

| 属性        | 类型                          | 默认值 | 说明               |
| ----------- | ----------------------------- | ------ | ------------------ |
| `align`     | `'left' \| 'right' \| string` | `—`    | 标签对齐方式。     |
| `className` | `HTMLAttributes['class']`     | `—`    | 组的类名           |
| `disabled`  | `boolean`                     | `—`    | 禁用               |
| `extra`     | `VNodeChild`                  | `—`    | 标签附加说明。     |
| `id`        | `string`                      | `—`    | 组件节点 id。      |
| `name`      | `string`                      | `—`    | 标签关联控件名称。 |
| `optional`  | `boolean`                     | `—`    | 显示可选字段提示。 |
| `required`  | `boolean`                     | `—`    | 显示必填标记。     |
| `style`     | `CSSProperties`               | `—`    | 组的样式           |
| `text`      | `VNodeChild`                  | `—`    | 标签显示内容。     |
| `width`     | `number \| string`            | `—`    | 标签区域宽度。     |

### AutosizeRows

| 属性      | 类型     | 默认值 | 说明                 |
| --------- | -------- | ------ | -------------------- |
| `minRows` | `number` | `—`    | 自动高度的最少行数。 |
| `maxRows` | `number` | `—`    | 自动高度的最多行数。 |

### 事件

#### Input

| 事件                | 参数                          |
| ------------------- | ----------------------------- |
| `blur`              | `event: FocusEvent`           |
| `change`            | `value: string, event: Event` |
| `clear`             | `event: Event`                |
| `compositionEnd`    | `event: CompositionEvent`     |
| `compositionStart`  | `event: CompositionEvent`     |
| `compositionUpdate` | `event: CompositionEvent`     |
| `enterPress`        | `event: KeyboardEvent`        |
| `focus`             | `event: FocusEvent`           |
| `input`             | `event: Event`                |
| `keydown`           | `event: KeyboardEvent`        |
| `keypress`          | `event: KeyboardEvent`        |
| `keyup`             | `event: KeyboardEvent`        |
| `update:modelValue` | `value: string`               |
| `update:value`      | `value: string`               |

#### TextArea

| 事件                | 参数                          |
| ------------------- | ----------------------------- |
| `blur`              | `event: FocusEvent`           |
| `change`            | `value: string, event: Event` |
| `clear`             | `event: Event`                |
| `compositionEnd`    | `event: CompositionEvent`     |
| `compositionStart`  | `event: CompositionEvent`     |
| `compositionUpdate` | `event: CompositionEvent`     |
| `enterPress`        | `event: KeyboardEvent`        |
| `focus`             | `event: FocusEvent`           |
| `input`             | `event: Event`                |
| `keydown`           | `event: KeyboardEvent`        |
| `keypress`          | `event: KeyboardEvent`        |
| `keyup`             | `event: KeyboardEvent`        |
| `resize`            | `data: TextAreaResizeData`    |
| `update:modelValue` | `value: string`               |
| `update:value`      | `value: string`               |

#### InputGroup

| 事件    | 参数                |
| ------- | ------------------- |
| `blur`  | `event: FocusEvent` |
| `focus` | `event: FocusEvent` |

### 插槽与类型

Input / InputNumber 提供 `#addonBefore`、`#addonAfter`、`#clearIcon`、`#insetLabel`、`#prefix`、`#suffix`。复杂 VNode 内容优先使用插槽。InputGroup 默认插槽接收输入组件。
`InputValue = string | number`；`InputSize = small | default | large`；`InputValidateStatus = default | error | warning | success`（success 为兼容值）；TextArea resize 支持 none、both、horizontal、vertical、block、inline。

Vue 模板中 camelCase 事件使用 kebab-case：如 `@enter-press`、`@number-change`、`@after-change`、`@input-change`。`keydown`、`keypress`、`keyup` 保持小写。`class` 与 `style` 使用 Vue 原生属性。

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移出焦点 |
| focus() | 获取焦点 |

## Accessibility

### ARIA

- 当 validateStatus 为 error 时，输入框的 aria-invalid 为 true
- 在 Form 中使用时，field label 是 Input 的 aria-label

### 键盘和焦点

- Input 可被获取焦点，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点
- 密码按钮可以被聚焦，聚焦后使用 Enter 或者空格键激活

## 设计变量

::token-table{component="input"}
::

## 相关物料

相关组合可查看 [Form](/zh-cn/components/form/)。

## React → Vue 迁移

| React                                     | Vue                                                                    |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                       | `@aifuxi/semi-ui-vue/input` + `@aifuxi/semi-theme-default/input.css`   |
| `value` + `onChange`                      | `v-model` / `v-model:value` / `:value` + `@change`                     |
| `defaultValue`                            | `default-value`                                                        |
| `useState` / `useMemo`                    | `shallowRef` / `computed`                                              |
| `className` / `style={{ ... }}`           | `class` / `:style="{ ... }"`                                           |
| `ref.current.focus()` / `.blur()`         | 模板 ref 上的 `focus()` / `blur()`                                     |
| `prefix={<Icon />}` / `suffix={<Node />}` | `#prefix` / `#suffix` 插槽                                             |
| `forwardRef` / `forwardedRef`             | 模板 ref 的只读 `input`（TextArea 为 `textarea`），并可调用 `select()` |
| `Input.TextArea` / `Input.Group`          | `TextArea` / `InputGroup` 命名导出                                     |
| `Form.Input` / `Select.Option`            | `FormInput` / `SelectOption`                                           |
| `grapheme-splitter`                       | `Intl.Segmenter` 按字素计数；演示不新增依赖                            |

自定义长度演示使用 Chromium 原生 `Intl.Segmenter` 计算字素；示例中的 💖 和家庭 emoji 均计为 1。英文 autosize 演示按上游保留两个输入框，中文另外包含 minRows/maxRows 场景。

## FAQ

### 为什么中文拼音过程中会触发变更？

默认 composition 为 false。开启 composition 后，Input 和 TextArea 在 IME 确认后派发一次 change，适合搜索建议。

### textareaStyle 和 style 有什么区别？

style 作用于外层容器，textareaStyle 作用于原生 textarea。autosize 开启时管理内容高度并忽略 resize。
