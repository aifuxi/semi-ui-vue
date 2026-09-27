---
title: 'Input 输入框'
description: '输入框是最基本的接收用户文本输入的组件'
type: 'input'
order: 41
icon: 'doc-input'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/input` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-input-1" title="如何引入" kind="import" />

### 基本

基本使用

<DemoBlock id="zh-CN-input-input-2" title="基本" kind="live" />

### 三种大小

默认定义了三种尺寸：大、默认、小

<DemoBlock id="zh-CN-input-input-3" title="三种大小" kind="live" />

### 不可用

设定 `disabled` 属性为 `true`

<DemoBlock id="zh-CN-input-input-4" title="不可用" kind="live" />

### 前缀/后缀

在输入框上增加前缀、后缀图标，可以是 VNodeChild

当 prefix、suffix 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0

<DemoBlock id="zh-CN-input-input-5" title="前缀/后缀" kind="live" />

### 前置/后置标签

在输入框上增加前置/后置标签

当 addonBefore、addonAfter 传入的内容为文本或者 Semi Icon 时，会自动带上左右间隔，若为自定义 VNodeChild，则左右间隔为 0

<DemoBlock id="zh-CN-input-input-6" title="前置/后置标签" kind="live" />

### 带移除图标

点击图标删除所有内容

<DemoBlock id="zh-CN-input-input-7" title="带移除图标" kind="live" />

### 密码模式

隐藏输入的具体内容

<DemoBlock id="zh-CN-input-input-8" title="密码模式" kind="live" />

### 校验状态

可设置不同校验状态，展示不同样式

<DemoBlock id="zh-CN-input-input-9" title="校验状态" kind="live" />

### 受控组件

`Input` 可通过 `v-model` 双向绑定，也可使用 `modelValue` 并监听 `change` 事件。

<DemoBlock id="zh-CN-input-input-10" title="受控组件" kind="live" />

### 输入框组合

可以将多个输入框放入 InputGroup 的容器中，通过设置 `size`，`disabled` 可统一设置组合中的输入框属性，支持输入框类型包括： `Input`， `InputNumber`， `Select`， `AutoComplete`、`TreeSelect`、`Cascader`、`DatePicker`

<DemoBlock id="zh-CN-input-input-11" title="输入框组合" kind="live" />

<DemoBlock id="zh-CN-input-input-12" title="输入框组合" kind="live" />

### 多行输入框

用于多行输入。通过设置 `maxCount` 属性可以进行字数限制并显示字数统计。支持 `showClear`。

<DemoBlock id="zh-CN-input-input-13" title="多行输入框" kind="live" />

### 设置 TextArea 高度

通过 `textareaStyle` 可以设置内部 textarea 元素的样式，如高度、背景色等。

<DemoBlock id="zh-CN-input-input-14" title="设置 TextArea 高度" kind="live" />

### 行号

通过设置 `showLineNumber` 展示行号。可用 `lineNumberStart` 设置起始行号，或通过 `lineNumberStyle`/`lineNumberClassName` 自定义行号区样式。

<DemoBlock id="zh-CN-input-input-15" title="行号" kind="live" />

### 使用 Shift + Enter 换行的多行输入框

TextArea 默认情况下 Enter 回车与 Shift + Enter 均可实现换行
通过适当的事件监听与禁用默认行为，你可以实现禁用 Enter 换行，仅 Shift + Enter 才能换行

<DemoBlock id="zh-CN-input-input-16" title="使用 Shift + Enter 换行的多行输入框" kind="live" />

### 自动扩展的多行输入框

通过设置 `autosize` 属性可设置只有高度自动随内容增加而变化。

<DemoBlock id="zh-CN-input-input-17" title="自动扩展的多行输入框" kind="live" />

### 自定义计算字符串长度

通过设置 `getValueLength` 属性可以自定义计算字符串长度。搭配 maxLength 和 minLength 可以支持 emoji 长度按照可见长度计算。

传入 getValueLength 时，Semi 内部做了什么：

- maxLength：不直接透传 maxLength 给原生 input。如果输入长度超出最大限制，则使用上一次输入的合法长度字符。
- minLength：动态切换 minLength 的长度，emoji 按照一个长度计算。
- maxCount：使用 getValueLength 获取的值与 maxCount 进行比较

<DemoBlock id="zh-CN-input-input-18" title="自定义计算字符串长度" kind="live" />

一些问题的回答：

> 为何不直接引入 `grapheme-splitter` 包？这个包未压缩体积为 200+kB，对于不需要把 emoji 按照可见长度计算的用户来说，这个体积有点过大了。因此 Semi 选择把长度计算函数作为参数让用户传入。

> 为何不动态修改 maxLength？动态修改 maxLength 在输入操作完成以后，计算剩余可以输入的字符长度。 如 maxLength 设置为 1，想输入一个 length 为 2 的 '💖'，但是由于 input maxLength 的限制，这里根本就输入不进去，也就无法更新 maxLength。

### 输入法模式

通过设置 `composition` 属性为 `true`，可以开启输入法模式。在该模式下，使用输入法（如中文拼音）输入时，`change` 事件不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次。适用于实时搜索等场景，避免在拼音输入过程中触发不必要的请求。

Input 和 TextArea 均支持该属性。

<DemoBlock id="zh-CN-input-input-19" title="输入法模式" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/input/types.ts` 的公开类型为准。

- Input / TextArea：`v-model` 对应 `modelValue`；同时保留 `value` 兼容入口。

#### Vue 事件

**Input**

| 事件                                                  | 参数                          | 说明            |
| ----------------------------------------------------- | ----------------------------- | --------------- |
| change                                                | [value: string, event: Event] | 输入值变化      |
| input                                                 | [event: Event]                | 原生 input 事件 |
| clear                                                 | [event: Event]                | 点击清除按钮    |
| enterPress                                            | [event: KeyboardEvent]        | 按下 Enter      |
| focus / blur                                          | [event: FocusEvent]           | 获得或失去焦点  |
| keydown / keypress / keyup                            | [event: KeyboardEvent]        | 键盘事件        |
| compositionStart / compositionUpdate / compositionEnd | [event: CompositionEvent]     | 输入法组合事件  |

**TextArea**

| 事件                                                  | 参数                                       | 说明           |
| ----------------------------------------------------- | ------------------------------------------ | -------------- |
| change                                                | [value: string, event: Event]              | 输入值变化     |
| resize                                                | [data: { height: number; width?: number }] | 文本域尺寸变化 |
| clear / enterPress / focus / blur                     | 见 Input 对应事件                          | 交互事件       |
| keydown / keypress / keyup                            | [event: KeyboardEvent]                     | 键盘事件       |
| compositionStart / compositionUpdate / compositionEnd | [event: CompositionEvent]                  | 输入法组合事件 |

**InputGroup**

| 事件         | 参数                | 说明                     |
| ------------ | ------------------- | ------------------------ |
| focus / blur | [event: FocusEvent] | 组内输入框获得或失去焦点 |

#### Vue 插槽

**Input**

| 插槽                     | 作用域参数 | 说明             |
| ------------------------ | ---------- | ---------------- |
| addonBefore / addonAfter | {}         | 前置或后置标签   |
| prefix / suffix          | {}         | 输入框前缀或后缀 |
| clearIcon                | {}         | 清除图标         |
| insetLabel               | {}         | 内嵌标签         |

**InputGroup**

| 插槽    | 作用域参数 | 说明             |
| ------- | ---------- | ---------------- |
| default | {}         | 组合内的输入控件 |

### Input

> 其他属性与html input 标签保持一致

| 属性                    | 说明                                                                                             | 类型                         | 默认值    |
| ----------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------- | --------- |
| addonAfter              | 后置标签                                                                                         | VNodeChild                   | —         |
| addonBefore             | 前置标签                                                                                         | VNodeChild                   | —         |
| autoFocus               | —                                                                                                | boolean                      | —         |
| borderless              | 无边框模式 &gt;=2.33.0                                                                           | boolean                      | —         |
| className               | 类名                                                                                             | HTMLAttributes['class']      | —         |
| clearIcon               | 可用于自定义清除按钮, showClear为true时有效 **&gt;=2.25.0**                                      | VNodeChild                   | —         |
| composition             | 是否开启输入法模式，开启后输入法未确认期间不会触发 change 事件，输入法确认后触发一次 change 事件 | boolean                      | false     |
| defaultValue            | 输入框内容默认值                                                                                 | InputValue                   | —         |
| disabled                | 是否禁用，默认为false                                                                            | boolean                      | false     |
| getValueLength          | 自定义计算字符串长度                                                                             | (value: string) =&gt; number | —         |
| hideSuffix              | 清除按钮与后缀标签并存时隐藏后缀标签，默认为false两者并列                                        | boolean                      | false     |
| id                      | —                                                                                                | string                       | —         |
| inputStyle              | —                                                                                                | StyleValue                   | —         |
| insetLabel              | —                                                                                                | VNodeChild                   | —         |
| insetLabelId            | —                                                                                                | string                       | —         |
| maxLength               | —                                                                                                | number                       | —         |
| minLength               | —                                                                                                | number                       | —         |
| mode                    | 输入框的模式，可选值password                                                                     | InputMode                    | —         |
| modelValue              | —                                                                                                | InputValue \| undefined      | —         |
| onlyBorder              | —                                                                                                | number                       | —         |
| placeholder             | —                                                                                                | InputValue                   | —         |
| prefix                  | 前缀标签                                                                                         | VNodeChild                   | —         |
| preventScroll           | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                            | boolean                      | —         |
| readonly                | —                                                                                                | boolean                      | —         |
| showClear               | 输入框有内容且 hover 或 focus 时展示清除按钮                                                     | boolean                      | false     |
| showClearIgnoreDisabled | —                                                                                                | boolean                      | —         |
| size                    | 输入框大小，large、default、small                                                                | InputSize                    | 'default' |
| suffix                  | 后缀标签                                                                                         | VNodeChild                   | —         |
| type                    | 声明input类型，同原生input标签的type属性                                                         | string                       | text      |
| validateStatus          | 校验状态，可选值default、error、warning，默认default。仅影响展示样式                             | InputValidateStatus          | 'default' |
| value                   | 输入框内容                                                                                       | InputValue \| undefined      | —         |

### TextArea

> 其他属性与 html textarea 标签保持一致

| 属性                      | 说明                                                                                                                                                                                                                                                                                                    | 类型                         | 默认值 |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------ |
| autoFocus                 | —                                                                                                                                                                                                                                                                                                       | boolean                      | —      |
| autosize                  | 是否随着自动适应内容高度，可写成对象配置最小最大行数`{minRows?: number, maxRows?: number}` **从2.45.0版本起支持对象参数**                                                                                                                                                                               | boolean \| AutosizeRows      | false  |
| borderless                | 无边框模式 &gt;=2.33.0                                                                                                                                                                                                                                                                                  | boolean                      | —      |
| className                 | 类名                                                                                                                                                                                                                                                                                                    | HTMLAttributes['class']      | -      |
| cols                      | 默认列数                                                                                                                                                                                                                                                                                                | number                       | 无     |
| composition               | 是否开启输入法模式，开启后输入法未确认期间不会触发 change 事件，输入法确认后触发一次 change 事件                                                                                                                                                                                                        | boolean                      | false  |
| defaultValue              | —                                                                                                                                                                                                                                                                                                       | string                       | —      |
| disabled                  | 禁用状态                                                                                                                                                                                                                                                                                                | boolean                      | false  |
| disabledEnterStartNewLine | —                                                                                                                                                                                                                                                                                                       | boolean                      | —      |
| getValueLength            | 自定义计算字符串长度                                                                                                                                                                                                                                                                                    | (value: string) =&gt; number | —      |
| id                        | —                                                                                                                                                                                                                                                                                                       | string                       | —      |
| lineNumberClassName       | 行号区域 className                                                                                                                                                                                                                                                                                      | HTMLAttributes['class']      | -      |
| lineNumberStart           | 行号起始值                                                                                                                                                                                                                                                                                              | number                       | 1      |
| lineNumberStyle           | 行号区域样式                                                                                                                                                                                                                                                                                            | StyleValue                   | -      |
| maxCount                  | 设置字数限制并显示字数统计                                                                                                                                                                                                                                                                              | number                       | 无     |
| maxLength                 | —                                                                                                                                                                                                                                                                                                       | number                       | —      |
| minLength                 | —                                                                                                                                                                                                                                                                                                       | number                       | —      |
| modelValue                | —                                                                                                                                                                                                                                                                                                       | string \| undefined          | —      |
| placeholder               | 当前的默认值                                                                                                                                                                                                                                                                                            | string                       | 无     |
| preventScroll             | —                                                                                                                                                                                                                                                                                                       | boolean                      | —      |
| readonly                  | 只读                                                                                                                                                                                                                                                                                                    | boolean                      | false  |
| resize                    | 是否允许用户拖拽调整尺寸，及调整方向。可选值：`none` \| `both` \| `horizontal` \| `vertical` \| `block` \| `inline`。当 `autosize` 开启时该属性会被忽略。**仅当显式传入该属性时才会生效**（默认不干预，以保持历史宽度/样式行为；如需仍使用原生方式可通过 `textareaStyle.resize` 控制），**&gt;=2.97.0** | TextAreaResize               | -      |
| rows                      | 默认行数                                                                                                                                                                                                                                                                                                | number                       | 4      |
| showClear                 | 支持清除                                                                                                                                                                                                                                                                                                | boolean                      | false  |
| showCounter               | —                                                                                                                                                                                                                                                                                                       | boolean                      | —      |
| showLineNumber            | 是否展示行号                                                                                                                                                                                                                                                                                            | boolean                      | false  |
| textareaStyle             | textarea 元素的样式，可用于设置 textarea 的高度等样式 **&gt;=2.94.0**                                                                                                                                                                                                                                   | StyleValue                   | -      |
| validateStatus            | —                                                                                                                                                                                                                                                                                                       | InputValidateStatus          | —      |
| value                     | —                                                                                                                                                                                                                                                                                                       | string \| undefined          | —      |

### InputGroup

通用属性将设置到 InputGroup 的子级元素上，例如 disabled、onFocus 等。如果你在子级设置了 onFocus、onBlur 或 disabled，会覆盖掉 InputGroup 对应属性值。

| 属性          | 说明                              | 类型                      | 默认值    |
| ------------- | --------------------------------- | ------------------------- | --------- |
| className     | 组的类名                          | HTMLAttributes['class']   | -         |
| disabled      | 禁用                              | boolean                   | -         |
| label         | InputGroup 的 label 属性          | InputGroupLabelProps      | -         |
| labelPosition | label 位置，可选 top 或 left      | 'top' \| 'left' \| string | -         |
| size          | 输入框大小，large、default、small | InputSize                 | 'default' |
| style         | 组的样式                          | StyleValue                | -         |

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
