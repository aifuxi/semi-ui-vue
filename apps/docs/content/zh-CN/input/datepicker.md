---
title: 'DatePicker 日期选择器'
description: '日期选择器用于帮助用户选择一个符合要求的、格式化的日期（时间）或日期（时间）范围'
type: 'input'
order: 39
icon: 'doc-datepicker'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/date-picker` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-input-datepicker-1" title="如何引入" kind="import" />

### 基本使用

<DemoBlock id="zh-CN-input-datepicker-2" title="基本使用" kind="live" />

### 小尺寸

使用 density 可以控制日期面板的尺寸，`compact` 为小尺寸，`default` 为默认尺寸。

<DemoBlock id="zh-CN-input-datepicker-3" title="小尺寸" kind="live" />

### 多个日期选择

将 `multiple` 设为 `true`，可以多选日期

<DemoBlock id="zh-CN-input-datepicker-4" title="多个日期选择" kind="live" />

### 日期与时间选择

将 `type` 设定为 `dateTime`，可以选择日期时间。
版本V2.22.0开始，我们将 TimePicker 内的 ScrollItem 的默认模式从 wheel 变更为了 normal, 若想应用回无限滚动的效果，可以通过 timePickerOpts 传入特定配置开启。

<DemoBlock id="zh-CN-input-datepicker-5" title="日期与时间选择" kind="live" />

### 日期范围选择

将 `type` 设定为 `dateRange`，可以选择日期范围

<DemoBlock id="zh-CN-input-datepicker-6" title="日期范围选择" kind="live" />

### 日期范围时间选择

将 `type` 设定为 `dateTimeRange`， 可以选择日期时间范围
当未传入 defaultValue 或 value时，底部面板默认时间为当前时间。如果你有特殊需求（如指定默认时分秒），可以通过 defaultPickerValue 指定

<DemoBlock id="zh-CN-input-datepicker-7" title="日期范围时间选择" kind="live" />

### 内嵌输入框

使用 insetInput 可以控制日期面板是否展示内嵌输入框，默认为 false。v2.7.0 后支持。内嵌输入框适用于以下场景：

- 日期时间选择，可以直接通过内嵌输入框单独修改时间，无须通过滚轮选择时间
- 自定义触发器时 + 范围选择，使用内嵌输入框可以单独对开始和结束日期进行修改

insetInput 开启后包括以下功能：

- 点击触发器后，面板默认在原有位置弹出。你可以通过 position 自定义弹出位置
- 点击内嵌日期输入框，面板切换到日期选择；点击内嵌时间输入框，面板切换到时间选择
- 和外部的输入框一致，如果输入了非法日期，面板关闭后日期会回到之前的合法日期

<DemoBlock id="zh-CN-input-datepicker-8" title="内嵌输入框" kind="live" />

### 同步切换双面板月份

在范围选择的场景中, 开启 `syncSwitchMonth` 则允许双面板同步切换。默认为 false。

> Note：点击年份按钮也会同步切换两个面板，从滚轮里面切换年月不会同步切换面板，这保证了用户选择非固定间隔月份的能力。

<DemoBlock id="zh-CN-input-datepicker-9" title="同步切换双面板月份" kind="live" />

### 切换面板日期的回调

`panelChange` 事件会在面板的月份或年份切换时触发。

<DemoBlock id="zh-CN-input-datepicker-10" title="切换面板日期的回调" kind="live" />

### 周选择

dateRange 搭配 startDateOffset 和 endDateOffset 可以进行单击范围选择，如周选择、双周选择。

<DemoBlock id="zh-CN-input-datepicker-11" title="周选择" kind="live" />

### 年月选择

将 `type` 设定为 `month`，可以进行年月选择。

<DemoBlock id="zh-CN-input-datepicker-12" title="年月选择" kind="live" />

### 年月范围选择

**版本：** >= 2.32.0

将 `type` 设定为 `monthRange`，可以进行年月范围选择。暂不支持小尺寸与快捷面板。

<DemoBlock id="zh-CN-input-datepicker-13" title="年月范围选择" kind="live" />

### 确认日期时间选择

对于“日期时间”（type="dateTime"）或“日期时间范围”（type="dateTimeRange"）的选择，可以进行确认后才将值写入输入框内，你可以通过传递 needConfirm=true 来开启这种行为。

同时支持“确认”按钮的 `confirm` 事件和“取消”按钮的 `cancel` 事件。

下面示例同时监听 `change`、`confirm`、`cancel` 三种事件，可在控制台查看参数差异。

> 注意：开启确认选择时，需要点击取消按钮关闭面板，点击空白区域不再关闭面板（v2.2.0）

<DemoBlock id="zh-CN-input-datepicker-14" title="确认日期时间选择" kind="live" />

### 带有快捷方式的日期时间选择

通过 `presets` 设定快捷日期选择

<DemoBlock id="zh-CN-input-datepicker-15" title="带有快捷方式的日期时间选择" kind="live" />

### 渲染顶部/底部额外区域

通过 `topSlot` 和 `bottomSlot` 可以自定义渲染顶部和底部额外区域
通过 `leftSlot` 和 `rightSlot` 可以自定义渲染左侧和右侧额外区域（v2.65.0后支持）

<DemoBlock id="zh-CN-input-datepicker-16" title="渲染顶部/底部额外区域" kind="live" />

<DemoBlock id="zh-CN-input-datepicker-17" title="渲染顶部/底部额外区域" kind="code" />

### 禁用日期选择

<DemoBlock id="zh-CN-input-datepicker-18" title="禁用日期选择" kind="live" />

### 禁用部分日期或时间

传入 `disabledDate` 可以禁用指定日期，传入 `disabledTime` 可以禁用指定时间，配合 `defaultPickerValue` 可以指定面板打开时所处的年月。

`disabledDate` 和 `disabledTime`，接受的入参都为当前日期，前者返回一个 `boolean` 值，后者返回一个[对象](/zh-CN/input/timepicker#API_参考)，将会透传给 `TimePicker` 组件。

<DemoBlock id="zh-CN-input-datepicker-19" title="禁用部分日期或时间" kind="live" />

在 type 包含 range 时，可以根据当前选择动态禁止日期。options 参数 1.9.0 后支持。

<DemoBlock id="zh-CN-input-datepicker-20" title="禁用部分日期或时间" kind="live" />

范围选择时，可以根据 focus 状态禁用日期。focus 状态通过 options 中的 rangeInputFocus 参数传递。

<DemoBlock id="zh-CN-input-datepicker-21" title="禁用部分日期或时间" kind="live" />

### 自定义显示格式

可以通过 `format` 自定义显示格式

<DemoBlock id="zh-CN-input-datepicker-22" title="自定义显示格式" kind="live" />

### 自定义触发器

默认情况下我们使用 `Input` 组件作为 `DatePicker` 组件的触发器，通过传递 `triggerRender` 方法你可以自定义这个触发器。

自定义触发器是对触发器的完全自定义，默认的清除按钮将不生效，如果你需要清除功能，请自定义一个清除按钮。

<DemoBlock id="zh-CN-input-datepicker-23" title="自定义触发器" kind="live" />

我们建议提供一个清除按钮，当你给 DatePicker 传入空值时，DatePicker 内部也会重置焦点。这样用户可以在清除后重新选择日期范围。（from v2.15）

<DemoBlock id="zh-CN-input-datepicker-24" title="自定义触发器" kind="live" />

### 自定义日期显示内容

`renderDate: (dayNumber: number, fullDate: string) => VNodeChild`，自定义日期内容。

- `dayNumber`：当前日。如 `13`。
- `fullDate`：当前日的完整日期。如 `2020-08-13`。

<DemoBlock id="zh-CN-input-datepicker-25" title="自定义日期显示内容" kind="live" />

### 自定义日期格子渲染

`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => VNodeChild`， 自定义日期格子的渲染内容。

`dayStatus` 表示当前格子的状态，包括的 `key` 有：

<DemoBlock id="zh-CN-input-datepicker-26" title="自定义日期格子渲染" kind="code" />

<DemoBlock id="zh-CN-input-datepicker-27" title="自定义日期格子渲染" kind="live" />

<DemoBlock id="zh-CN-input-datepicker-28" title="自定义日期格子渲染" kind="code" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/date-picker/types.ts`、`packages/ui/src/date-picker/index.ts` 的公开类型为准。

- `v-model` 对应 `modelValue`，同时支持 `v-model:value`。
- `v-model:open` 对应面板展开状态。

#### Vue 实例方法

**DatePicker ref**

| 方法    | 签名                                                | 说明           |
| ------- | --------------------------------------------------- | -------------- |
| `open`  | () =&gt; void                                       | 展开面板       |
| `close` | () =&gt; void                                       | 关闭面板       |
| `focus` | (focusType?: 'rangeStart' \| 'rangeEnd') =&gt; void | 聚焦输入框     |
| `blur`  | () =&gt; void                                       | 移除输入框焦点 |

#### Vue 事件

**DatePicker**

| 事件         | 参数                                                                                                                  | 说明                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| blur         | [event?: unknown]                                                                                                     | 输入框失去焦点                                |
| cancel       | [date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]                                      | 取消需要确认的选择                            |
| change       | [first: Date \| Date[] \| string \| string[] \| undefined, second: Date \| Date[] \| string \| string[] \| undefined] | 值变化；参数顺序由 onChangeWithDateFirst 决定 |
| clear        | [event?: unknown]                                                                                                     | 点击清除按钮                                  |
| clickOutside | [event: MouseEvent]                                                                                                   | 点击浮层和触发器之外的区域                    |
| confirm      | [date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]                                      | 确认需要确认的选择                            |
| focus        | [event: unknown, rangeType?: DatePickerRangeType]                                                                     | 输入框获得焦点                                |
| maxSelect    | [value?: Date[]]                                                                                                      | 多选达到上限                                  |
| openChange   | [open: boolean]                                                                                                       | 面板展开状态变化                              |
| panelChange  | [date: Date \| Date[], dateString: string \| string[]]                                                                | 面板年月切换                                  |
| presetClick  | [item: DatePickerPreset, event: MouseEvent]                                                                           | 点击快捷选项                                  |

#### Vue 插槽

**DatePicker**

| 插槽           | 作用域参数                                                           | 说明         |
| -------------- | -------------------------------------------------------------------- | ------------ |
| bottom         | {}                                                                   | 面板底部内容 |
| clearIcon      | {}                                                                   | 清除图标     |
| date           | { dayNumber: number; fullDate: string }                              | 日期内容     |
| fullDate       | { dayNumber: number; fullDate: string; status: DatePickerDayStatus } | 完整日期格子 |
| insetLabel     | {}                                                                   | 内嵌标签     |
| left           | {}                                                                   | 面板左侧内容 |
| prefix         | {}                                                                   | 输入框前缀   |
| rangeSeparator | {}                                                                   | 范围分隔内容 |
| right          | {}                                                                   | 面板右侧内容 |
| top            | {}                                                                   | 面板顶部内容 |
| trigger        | DatePickerTriggerSlotProps                                           | 自定义触发器 |

| 属性                  | 说明                                                                                                                         | 类型                                                                                          | 默认值                                          | 版本       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------- |
| ariaDescribedby       | —                                                                                                                            | string                                                                                        | —                                               |            |
| ariaErrormessage      | —                                                                                                                            | string                                                                                        | —                                               |            |
| ariaInvalid           | —                                                                                                                            | boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'                                       | —                                               |            |
| ariaLabelledby        | —                                                                                                                            | string                                                                                        | —                                               |            |
| ariaRequired          | —                                                                                                                            | boolean \| 'false' \| 'true'                                                                  | —                                               |            |
| autoAdjustOverflow    | 浮层被遮挡时是否自动调整方向                                                                                                 | boolean                                                                                       | true                                            |            |
| autoFocus             | 自动获取焦点                                                                                                                 | boolean                                                                                       | false                                           |            |
| autoSwitchDate        | 通过面板上方左右按钮、下拉菜单更改年月时，自动切换日期。仅对 date type 生效。                                                | boolean                                                                                       | true                                            |            |
| borderless            | 无边框模式                                                                                                                   | boolean                                                                                       | —                                               | **2.33.0** |
| bottomSlot            | 渲染底部额外区域                                                                                                             | VNodeChild                                                                                    | —                                               |            |
| class                 | —                                                                                                                            | HTMLAttributes['class']                                                                       | —                                               |            |
| className             | 类名                                                                                                                         | HTMLAttributes['class']                                                                       | -                                               |            |
| clearIcon             | 可用于自定义清除按钮, showClear为true时有效                                                                                  | VNodeChild                                                                                    | —                                               | **2.25.0** |
| dateFnsLocale         | —                                                                                                                            | unknown                                                                                       | —                                               |            |
| defaultOpen           | 面板默认显示或隐藏                                                                                                           | boolean                                                                                       | false                                           |            |
| defaultPickerValue    | 默认面板日期                                                                                                                 | DatePickerValue                                                                               | —                                               |            |
| defaultValue          | 默认值                                                                                                                       | DatePickerValue                                                                               | —                                               |            |
| density               | 面板的尺寸，可选值：`default`, `compact`                                                                                     | DatePickerDensity                                                                             | default                                         |            |
| disabled              | 是否禁用                                                                                                                     | boolean                                                                                       | false                                           |            |
| disabledDate          | —                                                                                                                            | (date?: Date, options?: DatePickerDisabledDateOptions) =&gt; boolean                          | —                                               |            |
| disabledTime          | —                                                                                                                            | ( date?: Date \| Date[], panelType?: 'left' \| 'right', ) =&gt; DatePickerDisabledTimeOptions | —                                               |            |
| disabledTimePicker    | 是否禁止时间选择                                                                                                             | boolean                                                                                       | —                                               |            |
| dropdownClassName     | 下拉列表的 CSS 类名                                                                                                          | HTMLAttributes['class']                                                                       | —                                               |            |
| dropdownMargin        | 下拉列表算溢出时的增加的冗余值，详见[issue#549](https://github.com/aifuxi/semi-ui-vue/issues/549)，作用同 Tooltip margin     | PopoverMargin                                                                                 | —                                               | **2.25.0** |
| dropdownStyle         | 下拉列表的内联样式                                                                                                           | StyleValue                                                                                    | —                                               |            |
| endDateOffset         | type 为 dateRange 时，设置单击选择范围的结束日期                                                                             | (selectedDate?: Date) =&gt; Date                                                              | -                                               |            |
| endYear               | 滚轮的结束年，结束年需要大于开始年                                                                                           | number                                                                                        | 当前年后 100 年                                 | **2.36.0** |
| format                | 在输入框内展现的日期串格式                                                                                                   | string                                                                                        | 与 type 对应：详见[日期时间格式](#日期时间格式) |            |
| getPopupContainer     | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement                                                                          | () =&gt; document.body                          |            |
| hideDisabledOptions   | 隐藏禁止选择的时间                                                                                                           | boolean                                                                                       | false                                           |            |
| id                    | —                                                                                                                            | string                                                                                        | —                                               |            |
| insetInput            | —                                                                                                                            | boolean \| DatePickerInsetInputProps                                                          | —                                               |            |
| insetLabel            | —                                                                                                                            | VNodeChild                                                                                    | —                                               |            |
| insetLabelId          | —                                                                                                                            | string                                                                                        | —                                               |            |
| inputReadOnly         | 文本框是否 readonly                                                                                                          | boolean                                                                                       | false                                           |            |
| inputStyle            | 输入框样式                                                                                                                   | StyleValue                                                                                    | —                                               |            |
| leftSlot              | 渲染左侧额外区域                                                                                                             | VNodeChild                                                                                    | —                                               | **2.65.0** |
| locale                | —                                                                                                                            | DatePickerLocale                                                                              | —                                               |            |
| localeCode            | —                                                                                                                            | string                                                                                        | —                                               |            |
| max                   | multiple 为 true 时，多选的数目,不传或者值为 null\|undefined 的话无限制                                                      | number                                                                                        | -                                               |            |
| modelValue            | —                                                                                                                            | DatePickerValue                                                                               | —                                               |            |
| motion                | 是否开启面板展开的动画                                                                                                       | boolean                                                                                       | true                                            |            |
| multiple              | 是否可以选择多个，仅支持 type="date"                                                                                         | boolean                                                                                       | false                                           |            |
| needConfirm           | 是否需要“确认选择”，仅 type="dateTime"\|"dateTimeRange" 时有效                                                               | boolean                                                                                       | —                                               |            |
| onChangeWithDateFirst | 控制 `change` 事件参数顺序；设为 `false` 时先传格式化字符串，再传日期值                                                      | boolean                                                                                       | true                                            |            |
| open                  | 面板显示或隐藏的受控属性                                                                                                     | boolean                                                                                       | —                                               |            |
| placeholder           | 输入框提示文字                                                                                                               | string \| string[]                                                                            | 'Select date'                                   |            |
| position              | 浮层位置，可选值同[Popover#API 参考·position 参数](/zh-CN/show/popover#API参考)                                              | PopoverPosition                                                                               | 'bottomLeft'                                    |            |
| prefix                | 前缀内容                                                                                                                     | VNodeChild                                                                                    | —                                               |            |
| presetPosition        | 日期时间快捷方式面板位置, 可选值'left', 'right', 'top', 'bottom'                                                             | DatePickerPresetPosition                                                                      | 'bottom'                                        | **2.18.0** |
| presets               | —                                                                                                                            | Array&lt;DatePickerPreset \| (() =&gt; DatePickerPreset)&gt;                                  | —                                               |            |
| preventScroll         | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                        | boolean                                                                                       | —                                               |            |
| rangeSeparator        | 自定义范围类型输入框的日期分隔符                                                                                             | string                                                                                        | '~'                                             |            |
| rangeSeparatorNode    | 自定义范围类型输入框分隔符的渲染节点（仅影响 UI 渲染，字符串解析仍使用 rangeSeparator）                                      | VNodeChild                                                                                    | -                                               |            |
| renderDate            | 自定义日期显示内容                                                                                                           | (dayNumber?: number, fullDate?: string) =&gt; VNodeChild                                      | -                                               |            |
| renderFullDate        | 自定义显示日期格子内容                                                                                                       | ( dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus, ) =&gt; VNodeChild     | -                                               |            |
| rightSlot             | 渲染右侧额外区域                                                                                                             | VNodeChild                                                                                    | —                                               | **2.65.0** |
| showClear             | 是否显示清除按钮                                                                                                             | boolean                                                                                       | true                                            |            |
| size                  | 尺寸，可选值："small", "default", "large"                                                                                    | InputSize                                                                                     | 'default'                                       |            |
| spacing               | 浮层与 trigger 的距离                                                                                                        | number                                                                                        | 4                                               |            |
| startDateOffset       | —                                                                                                                            | (selectedDate?: Date) =&gt; Date                                                              | —                                               |            |
| startYear             | 滚轮的开始年                                                                                                                 | number                                                                                        | 当前年前 100 年                                 | **2.36.0** |
| stopPropagation       | 是否阻止弹出层上的点击事件冒泡                                                                                               | boolean \| string                                                                             | true                                            |            |
| style                 | 自定义样式                                                                                                                   | StyleValue                                                                                    | —                                               |            |
| syncSwitchMonth       | 在范围选择的场景中，支持同步切换双面板的月份                                                                                 | boolean                                                                                       | false                                           |            |
| timePickerOpts        | 其他可以透传给时间选择器的参数，详见 [TimePicker·API 参考](/zh-CN/input/timepicker#API_参考)                                 | TimePickerProps                                                                               | object                                          |            |
| timeZone              | —                                                                                                                            | string \| number                                                                              | —                                               |            |
| topSlot               | 渲染顶部额外区域                                                                                                             | VNodeChild                                                                                    | —                                               |            |
| triggerRender         | 自定义触发器渲染方法，第一个参数是个 Object，详情看下方类型定义                                                              | (props: DatePickerTriggerSlotProps) =&gt; VNodeChild                                          | —                                               |            |
| type                  | 类型，可选值："date", "dateRange", "dateTime", "dateTimeRange", "month", "monthRange"                                        | DatePickerType                                                                                | 'date'                                          |            |
| validateStatus        | 校验状态，可选值 default、error、warning，默认 default。仅影响展示样式                                                       | InputValidateStatus                                                                           | —                                               |            |
| value                 | 受控的值                                                                                                                     | DatePickerValue                                                                               | —                                               |            |
| weekStartsOn          | 以周几作为每周第一天，0 代表周日，1 代表周一，以此类推                                                                       | 0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6                                                               | 0                                               |            |
| yearAndMonthOpts      | 其他可以透传给年月选择器的参数，详见 [ScrollList#API](/zh-CN/show/scrolllist#ScrollItem)                                     | Record&lt;string, unknown&gt;                                                                 | object                                          | **2.20.0** |
| zIndex                | 弹出面板的 zIndex                                                                                                            | number                                                                                        | 1030                                            |            |

## Methods

| 方法  | 说明                       | 类型                                             | 版本   |
| ----- | -------------------------- | ------------------------------------------------ | ------ |
| open  | 调用时可以手动展开下拉列表 | () => void                                       | 2.31.0 |
| close | 调用时可以手动关闭下拉列表 | () => void                                       | 2.31.0 |
| focus | 调用时可以手动聚焦输入框   | (focusType?: 'rangeStart' \| 'rangeEnd') => void | 2.31.0 |
| blur  | 调用时可以手动失焦输入框   | () => void                                       | 2.31.0 |

<DemoBlock id="zh-CN-input-datepicker-29" title="Methods" kind="live" />

## 类型定义

<DemoBlock id="zh-CN-input-datepicker-30" title="类型定义" kind="code" />

## Accessibility

### ARIA

- 未选中日期时，触发器的 `aria-label` 为 `Choose date`，选中日期时，触发器的 `aria-label` 为 `Change date`
- 日期面板中月的 role 为 `grid`，周的 role 设置为 `row`，日期格子设置为 `gridcell`
- 日期和时间禁用时对应选项的 `aria-disabled` 为 true
- 多选时，月的 `aria-multiselectable` 为 true，选中时日期格子的 `aria-selected` 为 true
- 面板中一些装饰作用的 icon，它们的 `aria-hidden` 为 true

## 文案规范

- 日期选择器建议搭配标签使用
- 使用简洁的标签来表明日期选择所指的内容
- 日期选择器中日期格式请参考[日期与时间](/zh-CN/experience/content-guidelines#8.%20%E6%97%A5%E6%9C%9F%E4%B8%8E%E6%97%B6%E9%97%B4)的规范

## 日期时间格式

semi-ui 组件库中采用 [date-fns(v2.9.0)](https://date-fns.org/v2.9.0/docs/Getting-Started) 作为日期时间引擎，格式化 token 含义如下：

- `"y"`：年
- `"M"`：月
- `"d"`：日
- `"H"`：小时
- `"m"`：分钟
- `"s"`：秒

下面以 `new Date('2023-12-09 08:08:00')` 和 `[new Date('2023-12-09 08:08:00'), new Date('2023-12-10 10:08:00')]` 为例说明不同 `format` 值对展示值的影响：

| 类型          | format              | 展示值                               |
| ------------- | ------------------- | ------------------------------------ |
| date          | yyyy-MM-dd          | 2023-12-09                           |
| dateTime      | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08:00                  |
| month         | yyyy-MM             | 2023-12                              |
| dateRange     | yyyy-MM-dd          | 2023-12-09 ～ 2023-12-10             |
| dateTimeRange | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08 ～ 2023-12-10 10:08 |

多个日期或时间默认使用 `","` （英文逗号）分隔。

> 更多 token 可以查阅 [date-fns 官网](https://date-fns.org/v2.9.0/docs/Unicode-Tokens)

## FAQ

- **日期时间选择器，时分秒选择时想要无限滚动效果如何实现？**
  版本V2.22.0开始，我们将 TimePicker 内的 ScrollItem 的默认模式从 wheel 变更为了 normal, 若想应用回无限滚动的效果，可以通过 timePickerOpts 中的特定开关控制该行为，即 timePickerOpts={&lbrace; scrollItemProps: { mode: "wheel", cycled: true } }}。

- **如何设置面板打开时默认显示的时间？**
  可通过 defaultPickerValue 属性。

- **日期时间选择、范围日期选择，输入部分日期后，面板没有回显日期？**

输入框需要输入完整后才会回显到面板上。比如，日期时间选择，完整要求日期和时间都已输入。范围日期选择，完整要求开始日期和结束日期都已输入。

- **日期时间选择面板底部的展示的时间是什么？**

未选择时间时，它为 defaultPickerValue 中时间的值，如果没有设置则是面板打开时的时间。选择时间后，它为已选择的时间。

由于设计上它有隐含两层含义，可能会导致歧义，建议使用内嵌样式，通过 `insetInput` 打开。使用前推荐阅读相关 文档。
