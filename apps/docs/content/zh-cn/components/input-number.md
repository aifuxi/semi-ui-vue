---
title: '数字输入框'
description: '通过鼠标或键盘，输入范围内的数值，与 Input 不同的是它带有针对数字场景的步进器操作区，配合 Parser 使用可以展示更复杂的内容格式'
locale: 'zh-CN'
slug: 'input-number'
category: 'input'
order: 42
englishTitle: 'InputNumber'
icon: 'doc-inputnumber'
upstream: 'input/inputnumber'
---

## 代码演示

### 如何引入

```ts
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';
import '@aifuxi/semi-theme-default/input-number.css';
```

### 基本输入框

::demo-block{demo="input-number/zh-cn/Basic" title="基本输入框"}
::

::demo-block{demo="input-number/zh-cn/Defaults" title="基本输入框"}
::

### 隐藏步进器

通过innerButtons，你可以将右侧的步进器隐藏进内部，仅hover时才会显示

::demo-block{demo="input-number/zh-cn/InnerButtons" title="隐藏步进器"}
::

hideButtons设为true，彻底隐藏步进器

::demo-block{demo="input-number/zh-cn/HideButtons" title="隐藏步进器"}
::

### 尺寸

::demo-block{demo="input-number/zh-cn/Size" title="尺寸"}
::

### 自定义显示格式与解析方式

> formatter 和 parser 一对方法，一般需要同时设置，否则无法正确解析值

> **2.95.0 行为调整**
>
> - **2.94.0 及之前**：当 InputNumber 处于**受控模式**（传入 `value`）且 `value` 为 **number** 时，首次渲染阶段输入框的展示值可能不会先经过 `formatter` 处理，组件会在 mount 后（或后续更新）再应用 `formatter/parser`，从而出现首帧展示与后续不一致的现象。
> - **2.95.0 及之后**：受控模式下当 `value` 为 **number** 时，首次渲染也会应用 `formatter`（并与 `parser` 配合得到内部数值），保证首帧展示与后续一致。例如百分比场景：`value=1` 且 `formatter/parser` 使展示乘以 100 时，首帧将直接展示 `100`。

::demo-block{demo="input-number/zh-cn/Formatter" title="自定义显示格式与解析方式"}
::

### 纯数字输入框

搭配 formatter 和 @number-change（**>=v1.9.0**） 可以实现纯数字输入框。

::demo-block{demo="input-number/zh-cn/Digits" title="纯数字输入框"}
::

### 货币展示

2.77.0 版本开始支持货币展示，国际化模式下通过 currency={true} 开启，组件会自动根据 localeCode 展示对应货币种类。（注意切换语言类型后需要更新组件 key 值）
::demo-block{demo="input-number/zh-cn/CurrencyLocale" title="货币展示"}
::
也可以通过手动传 localeCode 和 currency 指定展示的货币种类
::demo-block{demo="input-number/zh-cn/Currency" title="货币展示"}
::
支持 symbol、code、name 三种展示方式，通过 currencyDisplay 属性控制，默认以货币符号展示。showCurrencySymbol 设置为 false 隐藏货币符号/代码/名称的展示
::demo-block{demo="input-number/zh-cn/CurrencyDisplay" title="货币展示"}
::

隐藏货币符号、代码或名称的展示，通过前后缀展示货币符号
::demo-block{demo="input-number/zh-cn/CurrencyAffixes" title="货币展示"}
::

### 科学计数法显示

当数字较长时，可以通过 `scientificNotation` 属性启用科学计数法显示。失去焦点时显示科学计数法，获得焦点时显示完整数字。

::demo-block{demo="input-number/zh-cn/Scientific" title="科学计数法显示"}
::

> 科学计数法仅影响显示格式，`@change` 和 `@number-change` 回调中的值仍为完整数字。该功能不支持货币模式（`currency`）。

## API 参考

### InputNumber

| 属性                      | 类型                                                      | 默认值      | 说明                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`         | `string`                                                  | `—`         | 关联描述节点 id。                                                                                                                                                                                                             |
| `ariaErrormessage`        | `string`                                                  | `—`         | 关联错误信息节点 id。                                                                                                                                                                                                         |
| `ariaInvalid`             | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'` | `—`         | ARIA 无效状态。                                                                                                                                                                                                               |
| `ariaLabel`               | `string`                                                  | `—`         | 可访问名称；模板写为 aria-label。                                                                                                                                                                                             |
| `ariaLabelledby`          | `string`                                                  | `—`         | 关联标签节点 id；模板写为 aria-labelledby。                                                                                                                                                                                   |
| `ariaRequired`            | `boolean \| 'false' \| 'true'`                            | `—`         | ARIA 必填状态。                                                                                                                                                                                                               |
| `addonAfter`              | `VNodeChild`                                              | `—`         | 后置标签                                                                                                                                                                                                                      |
| `addonBefore`             | `VNodeChild`                                              | `—`         | 前置标签                                                                                                                                                                                                                      |
| `autoFocus`               | `boolean`                                                 | `false`     | 挂载后自动聚焦。                                                                                                                                                                                                              |
| `borderless`              | `boolean`                                                 | `false`     | 无边框模式                                                                                                                                                                                                                    |
| `className`               | `HTMLAttributes['class']`                                 | `—`         | 类名                                                                                                                                                                                                                          |
| `clearIcon`               | `VNodeChild`                                              | `—`         | 可用于自定义清除按钮, showClear为true时有效                                                                                                                                                                                   |
| `composition`             | `boolean`                                                 | `false`     | 是否开启输入法模式，开启后输入法未确认期间不会触发 @change，输入法确认后触发一次 @change                                                                                                                                      |
| `defaultValue`            | `InputNumberValue`                                        | `—`         | 默认值                                                                                                                                                                                                                        |
| `disabled`                | `boolean`                                                 | `false`     | 禁用                                                                                                                                                                                                                          |
| `getValueLength`          | `(value: string) => number`                               | `—`         | 自定义计算字符串长度                                                                                                                                                                                                          |
| `hideSuffix`              | `boolean`                                                 | `false`     | 清除按钮与后缀标签并存时隐藏后缀标签，默认为false两者并列                                                                                                                                                                     |
| `id`                      | `string`                                                  | `—`         | 组件节点 id。                                                                                                                                                                                                                 |
| `inputStyle`              | `StyleValue`                                              | `—`         | 内部原生 input 样式。                                                                                                                                                                                                         |
| `insetLabel`              | `VNodeChild`                                              | `—`         | 内嵌标签，支持 insetLabel 插槽。                                                                                                                                                                                              |
| `insetLabelId`            | `string`                                                  | `—`         | 内嵌标签节点 id。                                                                                                                                                                                                             |
| `maxLength`               | `number`                                                  | `—`         | 最大输入长度；可配合 getValueLength 自定义计算方式。                                                                                                                                                                          |
| `minLength`               | `number`                                                  | `—`         | 最小输入长度；可配合 getValueLength 自定义计算方式。                                                                                                                                                                          |
| `mode`                    | `InputMode`                                               | `—`         | 输入框的模式，可选值password                                                                                                                                                                                                  |
| `modelValue`              | `InputNumberValue \| undefined`                           | `—`         | v-model 的受控值。                                                                                                                                                                                                            |
| `onlyBorder`              | `number`                                                  | `—`         | 内部兼容边框样式参数。                                                                                                                                                                                                        |
| `placeholder`             | `InputValue`                                              | `—`         | 当前的默认值                                                                                                                                                                                                                  |
| `prefix`                  | `VNodeChild`                                              | `—`         | 前缀内容                                                                                                                                                                                                                      |
| `preventScroll`           | `boolean`                                                 | `—`         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                                         |
| `readonly`                | `boolean`                                                 | `false`     | 只读                                                                                                                                                                                                                          |
| `showClear`               | `boolean`                                                 | `false`     | 是否显示清除按钮                                                                                                                                                                                                              |
| `showClearIgnoreDisabled` | `boolean`                                                 | `—`         | 内部兼容选项，禁用状态下也允许清除按钮显示。                                                                                                                                                                                  |
| `size`                    | `InputSize`                                               | `'default'` | 输入框大小，可选值："default"\                                                                                                                                                                                                |
| `suffix`                  | `VNodeChild`                                              | `—`         | 自定义后缀                                                                                                                                                                                                                    |
| `type`                    | `string`                                                  | `'text'`    | 声明input类型，同原生input标签的type属性                                                                                                                                                                                      |
| `validateStatus`          | `InputValidateStatus`                                     | `'default'` | 校验状态，可选值default、error、warning，默认default。仅影响展示样式                                                                                                                                                          |
| `value`                   | `InputNumberValue \| undefined`                           | `—`         | 当前值                                                                                                                                                                                                                        |
| `autofocus`               | `boolean`                                                 | `false`     | 自动获取焦点                                                                                                                                                                                                                  |
| `currency`                | `string \| boolean`                                       | `false`     | 货币种类，国际化模式下通过 currency={true} 开启，组件会自动根据 locale 展示对应货币种类, 也可以手动传入 localeCode 和 currency 指定展示的货币种类, currency 的可选值有 `CNY`,`EUR`,`USD`等                                    |
| `currencyDisplay`         | `InputNumberCurrencyDisplay`                              | `'symbol'`  | 货币展示方式，可选值：symbol、code、name                                                                                                                                                                                      |
| `defaultCurrency`         | `string`                                                  | `—`         | 未显式指定币种时的默认货币。                                                                                                                                                                                                  |
| `formatter`               | `(value: InputNumberValue) => string`                     | `—`         | 指定输入框展示值的格式                                                                                                                                                                                                        |
| `hideButtons`             | `boolean`                                                 | `false`     | 为 `true` 时隐藏 "上/下" 按钮                                                                                                                                                                                                 |
| `innerButtons`            | `boolean`                                                 | `false`     | 为 `true` 时 "上/下" 按钮显示在输入框内部                                                                                                                                                                                     |
| `keepFocus`               | `boolean`                                                 | `false`     | 点击按钮时保持输入框聚焦                                                                                                                                                                                                      |
| `localeCode`              | `string`                                                  | `—`         | 货币模式下用于指定国家地区代码，可选值有 `zh-CN`, `en-US`, `en-GB`, `ja-JP`, `ko-KR`, `ar`, `vi-VN`, `ru-RU`, `id-ID`, `ms-MY`, `th-TH`, `tr-TR`, `pt-BR`, `zh-TW`, `es`, `de`, `it`, `fr`, `ro`, `sv-SE`, `pl-PL`, `nl-NL`等 |
| `max`                     | `number`                                                  | `Infinity`  | 限定最大值                                                                                                                                                                                                                    |
| `maximumFractionDigits`   | `number`                                                  | `—`         | 货币格式最多小数位数。                                                                                                                                                                                                        |
| `min`                     | `number`                                                  | `-Infinity` | 限定最小值                                                                                                                                                                                                                    |
| `minimumFractionDigits`   | `number`                                                  | `—`         | 货币格式最少小数位数。                                                                                                                                                                                                        |
| `parser`                  | `(value: string) => string \| number`                     | `—`         | 指定从 `formatter` 里转换回数字串的方式，和 `formatter` 搭配使用                                                                                                                                                              |
| `precision`               | `number`                                                  | `—`         | 数值精度                                                                                                                                                                                                                      |
| `pressInterval`           | `number`                                                  | `250`       | 长按按钮时，多久触发一次点击事件，单位毫秒                                                                                                                                                                                    |
| `pressTimeout`            | `number`                                                  | `250`       | 长按按钮时，延迟多久后触发点击事件，单位毫秒                                                                                                                                                                                  |
| `scientificNotation`      | `boolean \| ScientificNotationConfig`                     | `false`     | 启用科学计数法显示，失去焦点时显示科学计数法，获得焦点时显示完整数字。可传入对象配置阈值 `threshold`，默认为 15 位有效数字。不支持货币模式                                                                                    |
| `shiftStep`               | `number`                                                  | `10`        | 按住 shift 键每次改变步数，可以为小数，v2.13 默认值由 1 调整为 10                                                                                                                                                             |
| `showCurrencySymbol`      | `boolean`                                                 | `true`      | 是否显示货币符号/代码/名称，仅货币模式下生效                                                                                                                                                                                  |
| `step`                    | `number`                                                  | `1`         | 每次改变步数，可以为小数                                                                                                                                                                                                      |

### ScientificNotationConfig

| 属性        | 类型     | 默认值 | 说明                                        |
| ----------- | -------- | ------ | ------------------------------------------- |
| `threshold` | `number` | `—`    | 启用科学计数法的有效数字位数阈值，默认 15。 |

### 事件

#### InputNumber

| 事件                | 参数                                             |
| ------------------- | ------------------------------------------------ |
| `blur`              | `event: FocusEvent`                              |
| `change`            | `value: InputNumberValue, event?: Event \| null` |
| `downClick`         | `value: string, event: MouseEvent`               |
| `focus`             | `event: FocusEvent`                              |
| `keydown`           | `event: KeyboardEvent`                           |
| `numberChange`      | `value: number, event?: Event \| null`           |
| `upClick`           | `value: string, event: MouseEvent`               |
| `update:modelValue` | `value: InputNumberValue`                        |
| `update:value`      | `value: InputNumberValue`                        |

### 插槽与类型

Input / InputNumber 提供 `#addonBefore`、`#addonAfter`、`#clearIcon`、`#insetLabel`、`#prefix`、`#suffix`。复杂 VNode 内容优先使用插槽。InputGroup 默认插槽接收输入组件。
InputNumber 继承 InputProps（重定义 value/defaultValue/modelValue/suffix/className），数值类型为 `string | number`，清空时可能为 `""`。`currencyDisplay`: `code | symbol | name`。

Vue 模板中 camelCase 事件使用 kebab-case：如 `@enter-press`、`@number-change`、`@after-change`、`@input-change`。`keydown`、`keypress`、`keyup` 保持小写。`class` 与 `style` 使用 Vue 原生属性。

## Methods

绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互

| 名称    | 描述     |
| ------- | -------- |
| blur()  | 移出焦点 |
| focus() | 获取焦点 |

## Accessibility

参考标准：https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

### ARIA

- 数字输入框具有 spinbutton role
- spinbutton 使用 aria-valuenow 表示当前值，aria-valuemax 表示可以接受的最大值，aria-valuemin 表示可以接受的最小值
- 当 InputNumber 在 Form 中使用时，输入框的 aria-labeledby 指向 Field label

### 键盘和焦点

- InputNumber 可被获取焦点，键盘用户可以使用 Tab 及 Shift + Tab 切换焦点（增加/减少按钮不可以被键盘聚焦）
- 键盘用户可以按上键 ⬆️ 或下键 ⬇️ ，输入值将增加或减少 step（默认值为 1）
- 按住 Shift + 上键 ⬆️ 或下键 ⬇️ ，输入值将增加或减少 shiftStep（默认值为 10）

## 设计变量

::token-table{component="inputNumber"}
::

## React → Vue 迁移

| React                                     | Vue                                                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                       | `@aifuxi/semi-ui-vue/input-number` + `@aifuxi/semi-theme-default/input-number.css` |
| `value` + `onChange`                      | `v-model` / `v-model:value` / `:value` + `@change`                                 |
| `defaultValue`                            | `default-value`                                                                    |
| `useState` / `useMemo`                    | `shallowRef` / `computed`                                                          |
| `className` / `style={{ ... }}`           | `class` / `:style="{ ... }"`                                                       |
| `ref.current.focus()` / `.blur()`         | 模板 ref 上的 `focus()` / `blur()`                                                 |
| `prefix={<Icon />}` / `suffix={<Node />}` | `#prefix` / `#suffix` 插槽                                                         |
| `forwardRef` / `forwardedRef`             | 模板 ref 的只读 `input`（TextArea 为 `textarea`），并可调用 `select()`             |

## FAQ

### formatter 与 parser 为什么通常成对出现？

formatter 将数值转为展示文本，parser 将展示文本还原成数字串。v2.102.0 的受控数字首帧同样执行格式化。

### 为什么更换货币语言后需要 key？

示例按上游在语言切换时更新 key，让内部格式化状态按新 LocaleProvider 重新初始化。科学计数法不支持 currency 模式，也不能突破 JavaScript Number 的精度上限。
