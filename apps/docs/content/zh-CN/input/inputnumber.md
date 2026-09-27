---
title: 'InputNumber 数字输入框'
description: '通过鼠标或键盘，输入范围内的数值，与 Input 不同的是它带有针对数字场景的步进器操作区，配合 Parser 使用可以展示更复杂的内容格式'
type: 'input'
order: 42
icon: 'doc-inputnumber'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/input-number` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-inputnumber-1" title="如何引入" kind="import" />

### 基本输入框

<DemoBlock id="zh-CN-input-inputnumber-2" title="基本输入框" kind="live" />

<DemoBlock id="zh-CN-input-inputnumber-3" title="基本输入框" kind="live" />

### 隐藏步进器

通过innerButtons，你可以将右侧的步进器隐藏进内部，仅hover时才会显示

<DemoBlock id="zh-CN-input-inputnumber-4" title="隐藏步进器" kind="live" />

hideButtons设为true，彻底隐藏步进器

<DemoBlock id="zh-CN-input-inputnumber-5" title="隐藏步进器" kind="live" />

### 尺寸

<DemoBlock id="zh-CN-input-inputnumber-6" title="尺寸" kind="live" />

### 自定义显示格式与解析方式

> formatter 和 parser 一对方法，一般需要同时设置，否则无法正确解析值

<DemoBlock id="zh-CN-input-inputnumber-7" title="自定义显示格式与解析方式" kind="live" />

### 纯数字输入框

搭配 `formatter` 和 `numberChange` 事件（**>=v1.9.0**）可以实现纯数字输入框。

<DemoBlock id="zh-CN-input-inputnumber-8" title="纯数字输入框" kind="live" />

### 货币展示

2.77.0 版本开始支持货币展示，国际化模式下通过 `:currency="true"` 开启，组件会自动根据 localeCode 展示对应货币种类。（注意切换语言类型后需要更新组件 key 值）

<DemoBlock id="zh-CN-input-inputnumber-9" title="货币展示" kind="live" />

也可以通过手动传 localeCode 和 currency 指定展示的货币种类

<DemoBlock id="zh-CN-input-inputnumber-10" title="货币展示" kind="live" />

支持 symbol、code、name 三种展示方式，通过 currencyDisplay 属性控制，默认以货币符号展示。showCurrencySymbol 设置为 false 隐藏货币符号/代码/名称的展示

<DemoBlock id="zh-CN-input-inputnumber-11" title="货币展示" kind="live" />

隐藏货币符号、代码或名称的展示，通过前后缀展示货币符号

<DemoBlock id="zh-CN-input-inputnumber-12" title="货币展示" kind="live" />

### 科学计数法显示

当数字较长时，可以通过 `scientificNotation` 属性启用科学计数法显示。失去焦点时显示科学计数法，获得焦点时显示完整数字。

<DemoBlock id="zh-CN-input-inputnumber-13" title="科学计数法显示" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/input-number/types.ts`、`packages/ui/src/input/types.ts` 的公开类型为准。

- `v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `value` 优先。

#### Vue 用法

- `formatter`、`parser` 与 `getValueLength` 是保留的 callback props，不是组件事件。
- addonBefore、addonAfter、clearIcon、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽，插槽优先。
- 模板 ref 还公开只读 `input: HTMLInputElement | null`。

#### Vue 实例方法

**InputNumberExposed**

| 方法     | 签名          | 说明           |
| -------- | ------------- | -------------- |
| `focus`  | () =&gt; void | 聚焦输入框     |
| `blur`   | () =&gt; void | 让输入框失焦   |
| `select` | () =&gt; void | 选中输入框内容 |

#### Vue 事件

**InputNumber**

| 事件              | 参数                                             | 说明                |
| ----------------- | ------------------------------------------------ | ------------------- |
| blur              | [event: FocusEvent]                              | 输入框失焦          |
| change            | [value: InputNumberValue, event?: Event \| null] | 输入值变化          |
| downClick         | [value: string, event: MouseEvent]               | 点击向下步进按钮    |
| focus             | [event: FocusEvent]                              | 输入框聚焦          |
| keydown           | [event: KeyboardEvent]                           | 输入框键盘事件      |
| numberChange      | [value: number, event?: Event \| null]           | 解析后的数字变化    |
| upClick           | [value: string, event: MouseEvent]               | 点击向上步进按钮    |
| update:modelValue | [value: InputNumberValue]                        | 更新默认 v-model    |
| update:value      | [value: InputNumberValue]                        | 更新兼容 value 绑定 |

#### Vue 插槽

**InputNumber**

| 插槽        | 作用域参数 | 说明       |
| ----------- | ---------- | ---------- |
| addonAfter  | {}         | 后置标签   |
| addonBefore | {}         | 前置标签   |
| clearIcon   | {}         | 清除图标   |
| insetLabel  | {}         | 内嵌标签   |
| prefix      | {}         | 输入框前缀 |
| suffix      | {}         | 输入框后缀 |

| 属性                    | 说明                                                                                                                                                                                                                          | 类型                                   | 默认值    | 版本       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------- | ---------- |
| addonAfter              | 后置标签 VNode；addonAfter 插槽优先                                                                                                                                                                                           | VNodeChild                             | —         |            |
| addonBefore             | 前置标签 VNode；addonBefore 插槽优先                                                                                                                                                                                          | VNodeChild                             | —         |            |
| autoFocus               | Vue 公共类型保留的自动聚焦开关                                                                                                                                                                                                | boolean                                | —         |            |
| borderless              | —                                                                                                                                                                                                                             | boolean                                | false     |            |
| clearIcon               | 清除图标 VNode；clearIcon 插槽优先                                                                                                                                                                                            | VNodeChild                             | —         | 2.25.0     |
| composition             | —                                                                                                                                                                                                                             | boolean                                | false     |            |
| disabled                | 禁用                                                                                                                                                                                                                          | boolean                                | false     |            |
| getValueLength          | —                                                                                                                                                                                                                             | (value: string) =&gt; number           | —         |            |
| hideSuffix              | —                                                                                                                                                                                                                             | boolean                                | false     |            |
| id                      | —                                                                                                                                                                                                                             | string                                 | —         |            |
| inputStyle              | —                                                                                                                                                                                                                             | StyleValue                             | —         |            |
| insetLabel              | 内嵌标签 VNode；insetLabel 插槽优先                                                                                                                                                                                           | VNodeChild                             | —         |            |
| insetLabelId            | —                                                                                                                                                                                                                             | string                                 | —         |            |
| maxLength               | —                                                                                                                                                                                                                             | number                                 | —         |            |
| minLength               | —                                                                                                                                                                                                                             | number                                 | —         |            |
| mode                    | —                                                                                                                                                                                                                             | InputMode                              | —         |            |
| onlyBorder              | —                                                                                                                                                                                                                             | number                                 | —         |            |
| placeholder             | —                                                                                                                                                                                                                             | InputValue                             | —         |            |
| prefix                  | 前缀 VNode；prefix 插槽优先                                                                                                                                                                                                   | VNodeChild                             | —         |            |
| preventScroll           | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                                         | boolean                                | —         |            |
| readonly                | —                                                                                                                                                                                                                             | boolean                                | false     |            |
| showClear               | 是否显示清除按钮                                                                                                                                                                                                              | boolean                                | false     | -          |
| showClearIgnoreDisabled | —                                                                                                                                                                                                                             | boolean                                | —         |            |
| size                    | 输入框大小，可选值："default"\|"small"\|"large"                                                                                                                                                                               | InputSize                              | `default` |            |
| type                    | —                                                                                                                                                                                                                             | string                                 | —         |            |
| validateStatus          | —                                                                                                                                                                                                                             | InputValidateStatus                    | `default` |            |
| autofocus               | 兼容上游命名的自动聚焦开关                                                                                                                                                                                                    | boolean                                | false     |            |
| className               | 样式类名                                                                                                                                                                                                                      | HTMLAttributes['class']                | -         |            |
| currency                | 货币种类，国际化模式下通过 `:currency="true"` 开启，组件会自动根据 locale 展示对应货币种类, 也可以手动传入 localeCode 和 currency 指定展示的货币种类, currency 的可选值有 `CNY`,`EUR`,`USD`等                                 | string \| boolean                      | false     | **2.77.0** |
| currencyDisplay         | 货币展示方式，可选值：symbol、code、name                                                                                                                                                                                      | InputNumberCurrencyDisplay             | symbol    | **2.77.0** |
| defaultCurrency         | currency=true 时使用的默认货币代码                                                                                                                                                                                            | string                                 | —         |            |
| defaultValue            | 非受控初始值                                                                                                                                                                                                                  | InputNumberValue                       | —         |            |
| formatter               | 指定输入框展示值的格式                                                                                                                                                                                                        | (value: InputNumberValue) =&gt; string | -         |            |
| hideButtons             | 为 `true` 时隐藏 "上/下" 按钮                                                                                                                                                                                                 | boolean                                | false     | -          |
| innerButtons            | 为 `true` 时 "上/下" 按钮显示在输入框内部                                                                                                                                                                                     | boolean                                | false     | -          |
| keepFocus               | 点击按钮时保持输入框聚焦                                                                                                                                                                                                      | boolean                                | false     | -          |
| localeCode              | 货币模式下用于指定国家地区代码，可选值有 `zh-CN`, `en-US`, `en-GB`, `ja-JP`, `ko-KR`, `ar`, `vi-VN`, `ru-RU`, `id-ID`, `ms-MY`, `th-TH`, `tr-TR`, `pt-BR`, `zh-TW`, `es`, `de`, `it`, `fr`, `ro`, `sv-SE`, `pl-PL`, `nl-NL`等 | string                                 | -         | **2.77.0** |
| max                     | 限定最大值                                                                                                                                                                                                                    | number                                 | Infinity  |            |
| maximumFractionDigits   | —                                                                                                                                                                                                                             | number                                 | —         |            |
| min                     | 限定最小值                                                                                                                                                                                                                    | number                                 | -Infinity |            |
| minimumFractionDigits   | —                                                                                                                                                                                                                             | number                                 | —         |            |
| modelValue              | 默认 v-model 绑定值                                                                                                                                                                                                           | InputNumberValue \| undefined          | —         |            |
| parser                  | 指定从 `formatter` 里转换回数字串的方式，和 `formatter` 搭配使用                                                                                                                                                              | (value: string) =&gt; string \| number | -         |            |
| precision               | 数值精度                                                                                                                                                                                                                      | number                                 | -         |            |
| pressInterval           | 长按按钮时，多久触发一次点击事件，单位毫秒                                                                                                                                                                                    | number                                 | 250       |            |
| pressTimeout            | 长按按钮时，延迟多久后触发点击事件，单位毫秒                                                                                                                                                                                  | number                                 | 250       |            |
| scientificNotation      | 启用科学计数法显示，失去焦点时显示科学计数法，获得焦点时显示完整数字。可传入对象配置阈值 `threshold`，默认为 15 位有效数字。不支持货币模式                                                                                    | boolean \| ScientificNotationConfig    | false     | **2.97.0** |
| shiftStep               | 按住 shift 键每次改变步数，可以为小数，v2.13 默认值由 1 调整为 10                                                                                                                                                             | number                                 | 10        | -          |
| showCurrencySymbol      | 是否显示货币符号/代码/名称，仅货币模式下生效                                                                                                                                                                                  | boolean                                | true      | **2.77.0** |
| step                    | 每次改变步数，可以为小数                                                                                                                                                                                                      | number                                 | 1         |            |
| suffix                  | 后缀 VNode；suffix 插槽优先                                                                                                                                                                                                   | VNodeChild                             | —         |            |
| value                   | 兼容受控值                                                                                                                                                                                                                    | InputNumberValue \| undefined          | —         |            |

## Methods

可通过模板 ref 调用公开实例方法。

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
- 键盘用户可以按上键 ⬆️ 或下键 ⬇️，输入值将增加或减少 step（默认值为 1）
- 按住 Shift + 上键 ⬆️ 或下键 ⬇️，输入值将增加或减少 shiftStep（默认值为 10）
