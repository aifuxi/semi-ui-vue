---
title: '日期选择器'
description: '日期选择器用于帮助用户选择一个符合要求的、格式化的日期（时间）或日期（时间）范围'
locale: 'zh-CN'
slug: 'date-picker'
category: 'input'
order: 39
englishTitle: 'DatePicker'
icon: 'doc-datepicker'
upstream: 'input/datepicker'
---

## 代码演示

### 如何引入

```ts
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
```

### 基本使用

::demo-block{demo="date-picker/zh-cn/Basic" title="基本使用"}
::

### 小尺寸

使用 density 可以控制日期面板的尺寸，`compact` 为小尺寸，`default` 为默认尺寸。

::demo-block{demo="date-picker/zh-cn/Density" title="小尺寸"}
::

### 多个日期选择

将 `multiple` 设为 `true`，可以多选日期

::demo-block{demo="date-picker/zh-cn/Multiple" title="多个日期选择"}
::

### 日期与时间选择

将 `type` 设定为 `dateTime`，可以选择日期时间。  
版本V2.22.0开始，我们将 TimePicker 内的 ScrollItem 的默认模式从 wheel 变更为了 normal, 若想应用回无限滚动的效果，可以通过 timePickerOpts 传入特定配置开启。

::demo-block{demo="date-picker/zh-cn/DateTime" title="日期与时间选择"}
::

### 日期范围选择

将 `type` 设定为 `dateRange`，可以选择日期范围

::demo-block{demo="date-picker/zh-cn/Range" title="日期范围选择"}
::

> **注意事项**
>
> type=dateRange 或 dateTimeRange 时，只有开始日期和结束日期都被选择后才会触发 @change。

### 日期范围时间选择

将 `type` 设定为 `dateTimeRange`， 可以选择日期时间范围  
当未传入 defaultValue 或 value时，底部面板默认时间为当前时间。如果你有特殊需求（如指定默认时分秒），可以通过 defaultPickerValue 指定

::demo-block{demo="date-picker/zh-cn/DateTimeRange" title="日期范围时间选择"}
::

### 内嵌输入框

使用 insetInput 可以控制日期面板是否展示内嵌输入框，默认为 false。v2.7.0 后支持。内嵌输入框适用于以下场景：

- 日期时间选择，可以直接通过内嵌输入框单独修改时间，无须通过滚轮选择时间
- 自定义触发器时 + 范围选择，使用内嵌输入框可以单独对开始和结束日期进行修改

insetInput 开启后包括以下功能：

- 点击触发器后，面板默认在原有位置弹出。你可以通过 position 自定义弹出位置
- 点击内嵌日期输入框，面板切换到日期选择；点击内嵌时间输入框，面板切换到时间选择
- 和外部的输入框一致，如果输入了非法日期，面板关闭后日期会回到之前的合法日期

> **注意事项**
>
> 注意，开启后会对组件做一些调整和限制：
>
> 1. 触发器样式：未打开面板时触发器只读，打开时触发器禁用
> 2. 面板样式：type 包括 time 时，隐藏底部的切换按钮
> 3. 开启 insetInput 后 format 只支持 `dateFormat[ timeFormat]` 格式，使用其他格式会影响内嵌输入框 placeholder 和触发器文本的展示

::demo-block{demo="date-picker/zh-cn/InsetInput" title="内嵌输入框"}
::

### 同步切换双面板月份

在范围选择的场景中, 开启 `syncSwitchMonth` 则允许双面板同步切换。默认为 false。

> Note：点击年份按钮也会同步切换两个面板，从滚轮里面切换年月不会同步切换面板，这保证了用户选择非固定间隔月份的能力。

::demo-block{demo="date-picker/zh-cn/SyncMonth" title="同步切换双面板月份"}
::

### 切换面板日期的回调

`@panel-change` 回调函数会在面板的月份或年份切换改变时被调用。

::demo-block{demo="date-picker/zh-cn/PanelChange" title="切换面板日期的回调"}
::

### 周选择

dateRange 搭配 startDateOffset 和 endDateOffset 可以进行单击范围选择，如周选择、双周选择。

::demo-block{demo="date-picker/zh-cn/Week" title="周选择"}
::

### 年月选择

将 `type` 设定为 `month`，可以进行年月选择。

::demo-block{demo="date-picker/zh-cn/Month" title="年月选择"}
::

### 年月范围选择

**版本：** >= 2.32.0

将 `type` 设定为 `monthRange`，可以进行年月范围选择。暂不支持小尺寸与快捷面板。

::demo-block{demo="date-picker/zh-cn/MonthRange" title="年月范围选择"}
::

### 确认日期时间选择

对于“日期时间”（type="dateTime"）或“日期时间范围”（type="dateTimeRange"）的选择，可以进行确认后才将值写入输入框内，你可以通过传递 needConfirm=true 来开启这种行为。

同时支持 “确认”（@confirm） 和 “取消”（@cancel） 两个按钮的点击回调。

下面这个例子绑定了 @change、@confirm、@cancel 三种回调，你可以打开控制台查看打印信息的区别。

> 注意：开启确认选择时，需要点击取消按钮关闭面板，点击空白区域不再关闭面板（v2.2.0）

::demo-block{demo="date-picker/zh-cn/Confirm" title="确认日期时间选择"}
::

### 带有快捷方式的日期时间选择

通过 `presets` 设定快捷日期选择

::demo-block{demo="date-picker/zh-cn/Presets" title="带有快捷方式的日期时间选择"}
::

### 渲染顶部/底部额外区域

通过 `#top` 和 `#bottom` 插槽可以自定义渲染顶部和底部额外区域  
通过 `#left` 和 `#right` 插槽可以自定义渲染左侧和右侧额外区域（v2.65.0后支持）

::demo-block{demo="date-picker/zh-cn/Slots" title="渲染顶部/底部额外区域"}
::

```css
.components-datepicker-demo-slot {
  .semi-tabs-content {
    padding: 0;
  }

  .semi-tabs-bar-line.semi-tabs-bar-top {
    border-bottom: none;
  }
}
```

### 禁用日期选择

::demo-block{demo="date-picker/zh-cn/Disabled" title="禁用日期选择"}
::

### 禁用部分日期或时间

传入 `disabledDate` 可以禁用指定日期，传入 `disabledTime` 可以禁用指定时间，配合 `defaultPickerValue` 可以指定面板打开时所处的年月。

`disabledDate` 和 `disabledTime`，接受的入参都为当前日期，前者返回一个 `boolean` 值，后者返回一个[对象](/zh-cn/components/time-picker/)，将会透传给 `TimePicker` 组件。

> **注意事项**
>
> 当你使用 timeZone 时，第一个参数为你选择的时区下时间（与 @change 的第一个返回值类似）

::demo-block{demo="date-picker/zh-cn/DisabledDateTime" title="禁用部分日期或时间"}
::

在 type 包含 range 时，可以根据当前选择动态禁止日期。options 参数 1.9.0 后支持。

::demo-block{demo="date-picker/zh-cn/DisabledBeforeStart" title="禁用部分日期或时间"}
::

范围选择时，可以根据 focus 状态禁用日期。focus 状态通过 options 中的 rangeInputFocus 参数传递。

::demo-block{demo="date-picker/zh-cn/DisabledRange" title="禁用部分日期或时间"}
::

### 自定义显示格式

可以通过 `format` 自定义显示格式

::demo-block{demo="date-picker/zh-cn/Format" title="自定义显示格式"}
::

### 自定义触发器

默认情况下我们使用 `Input` 组件作为 `DatePicker` 组件的触发器，通过 `#trigger` 作用域插槽可以自定义这个触发器，也支持返回 VNodeChild 的 `triggerRender` 函数。

自定义触发器是对触发器的完全自定义，默认的清除按钮将不生效，如果你需要清除功能，请自定义一个清除按钮。

::demo-block{demo="date-picker/zh-cn/Trigger" title="自定义触发器"}
::

> **注意事项**
>
> 范围选择时，面板打开后默认选择的日期为开始日期，选择后会切到结束日期选择。面板关闭后焦点会重置。
> 我们建议提供一个清除按钮，当你给 DatePicker 传入空值时，DatePicker 内部也会重置焦点。这样用户可以在清除后重新选择日期范围。（from v2.15）

::demo-block{demo="date-picker/zh-cn/RangeTrigger" title="自定义触发器"}
::

### 自定义日期显示内容

`renderDate: (dayNumber: number, fullDate: string) => VNodeChild`，自定义日期内容。

- `dayNumber`：当前日。如 `13`。
- `fullDate`：当前日的完整日期。如 `2020-08-13`。

::demo-block{demo="date-picker/zh-cn/RenderDate" title="自定义日期显示内容"}
::

### 自定义日期格子渲染

`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => VNodeChild`， 自定义日期格子的渲染内容。

`dayStatus` 表示当前格子的状态，包括的 `key` 有：

```ts
type DatePickerDayStatus = {
  isToday?: boolean; // 当前日
  isSelected?: boolean; // 被选中
  isDisabled?: boolean; // 被禁用
  isSelectedStart?: boolean; // 选中开始
  isSelectedEnd?: boolean; // 选中结束
  isInRange?: boolean; // 范围选中日期内
  isHover?: boolean; // 日期在选择项和hover日期之间
  isOffsetRangeStart?: boolean; // 周选择开始
  isOffsetRangeEnd?: boolean; // 周选择结束
  isHoverInOffsetRange?: boolean; // hover在周选择内
};
```

::demo-block{demo="date-picker/zh-cn/RenderFullDate" title="自定义日期格子渲染"}
::

```css
.components-datepicker-demo-day-inrange,
.components-datepicker-demo-day-hover {
  background: var(--semi-color-primary-light-hover);
}

.components-datepicker-demo-day-selected,
.components-datepicker-demo-day-selected-start,
.components-datepicker-demo-day-selected-end {
  color: var(--semi-color-bg-2);
  background: var(--semi-color-primary);
}
```

## API 参考

### DatePickerProps

| 属性                    | 类型                                                                                         | 默认值                              | 说明                                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`       | `string`                                                                                     | `—`                                 | 描述元素 ID 列表，传给内部输入框 aria-describedby。                                                                           |
| `ariaErrormessage`      | `string`                                                                                     | `—`                                 | 错误消息元素 ID，传给 aria-errormessage。                                                                                     |
| `ariaInvalid`           | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                                    | `—`                                 | 标记输入值是否无效；不执行校验。                                                                                              |
| `ariaLabelledby`        | `string`                                                                                     | `—`                                 | 标签元素 ID 列表，传给内部输入框 aria-labelledby。                                                                            |
| `ariaRequired`          | `boolean \| 'false' \| 'true'`                                                               | `—`                                 | 标记输入是否必填；不执行校验。                                                                                                |
| `autoAdjustOverflow`    | `boolean`                                                                                    | `true`                              | 浮层被遮挡时是否自动调整方向                                                                                                  |
| `autoFocus`             | `boolean`                                                                                    | `false`                             | 自动获取焦点                                                                                                                  |
| `autoSwitchDate`        | `boolean`                                                                                    | `true`                              | 通过面板上方左右按钮、下拉菜单更改年月时，自动切换日期。仅对 date type 生效。                                                 |
| `borderless`            | `boolean`                                                                                    | `false`                             | 无边框模式                                                                                                                    |
| `bottomSlot`            | `VNodeChild`                                                                                 | `—`                                 | 底部额外内容；可使用 bottom 插槽。                                                                                            |
| `class`                 | `HTMLAttributes['class']`                                                                    | `—`                                 | Vue 类名绑定。                                                                                                                |
| `className`             | `HTMLAttributes['class']`                                                                    | `—`                                 | 类名                                                                                                                          |
| `clearIcon`             | `VNodeChild`                                                                                 | `—`                                 | 可用于自定义清除按钮, showClear为true时有效                                                                                   |
| `dateFnsLocale`         | `unknown`                                                                                    | `—`                                 | date-fns 的语言数据；默认按 localeCode 选择中文或英文。                                                                       |
| `defaultOpen`           | `boolean`                                                                                    | `false`                             | 面板默认显示或隐藏                                                                                                            |
| `defaultPickerValue`    | `DatePickerValue`                                                                            | `—`                                 | 默认面板日期                                                                                                                  |
| `defaultValue`          | `DatePickerValue`                                                                            | `—`                                 | 非受控初始值；后续变化使用 v-model。                                                                                          |
| `density`               | `DatePickerDensity`                                                                          | `'default'`                         | 面板的尺寸，可选值：`default`, `compact`                                                                                      |
| `disabled`              | `boolean`                                                                                    | `false`                             | 是否禁用                                                                                                                      |
| `disabledDate`          | `(date?: Date, options?: DatePickerDisabledDateOptions) => boolean`                          | `() => false`                       | 日期禁止判断方法，返回为 true 时禁止该日期，options 参数 1.9.0 后支持，其中 rangeEnd 1.29 后支持，rangeInputFocus 2.22 后支持 |
| `disabledTime`          | `( date?: Date \| Date[], panelType?: 'left' \| 'right', ) => DatePickerDisabledTimeOptions` | `() => ({})`                        | 时间禁止配置，返回值将会作为参数透传给 [`TimePicker`](/zh-cn/components/time-picker/)                                         |
| `disabledTimePicker`    | `boolean`                                                                                    | `—`                                 | 是否禁止时间选择                                                                                                              |
| `dropdownClassName`     | `HTMLAttributes['class']`                                                                    | `—`                                 | 下拉列表的 CSS 类名                                                                                                           |
| `dropdownMargin`        | `PopoverMargin`                                                                              | `—`                                 | 下拉列表算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)，作用同 Tooltip margin    |
| `dropdownStyle`         | `StyleValue`                                                                                 | `—`                                 | 下拉列表的内联样式                                                                                                            |
| `endDateOffset`         | `(selectedDate?: Date) => Date`                                                              | `—`                                 | type 为 dateRange 时，设置单击选择范围的结束日期                                                                              |
| `endYear`               | `number`                                                                                     | `—`                                 | 滚轮的结束年，结束年需要大于开始年                                                                                            |
| `format`                | `string`                                                                                     | `type`                              | 在输入框内展现的日期串格式                                                                                                    |
| `getPopupContainer`     | `() => HTMLElement`                                                                          | `ConfigProvider / document.body`    | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。  |
| `hideDisabledOptions`   | `boolean`                                                                                    | `false`                             | 隐藏禁用的时间选项。                                                                                                          |
| `id`                    | `string`                                                                                     | `—`                                 | 内部输入框 ID，用于关联可见标签。                                                                                             |
| `insetInput`            | `boolean \| DatePickerInsetInputProps`                                                       | `—`                                 | 面板中是否嵌入输入框，InsetInputProps 类型 v2.29 支持                                                                         |
| `insetLabel`            | `VNodeChild`                                                                                 | `—`                                 | 输入框内嵌标签；可使用 insetLabel 插槽。                                                                                      |
| `insetLabelId`          | `string`                                                                                     | `—`                                 | 内嵌标签 ID。                                                                                                                 |
| `inputReadOnly`         | `boolean`                                                                                    | `false`                             | 文本框是否 readonly                                                                                                           |
| `inputStyle`            | `StyleValue`                                                                                 | `—`                                 | 输入框样式。                                                                                                                  |
| `leftSlot`              | `VNodeChild`                                                                                 | `—`                                 | 面板左侧额外内容；可使用 left 插槽。                                                                                          |
| `locale`                | `DatePickerLocale`                                                                           | `—`                                 | 覆盖本组件的文案数据；默认从 ConfigProvider 获取。                                                                            |
| `localeCode`            | `string`                                                                                     | `—`                                 | 日期时间语言代码；默认继承 ConfigProvider。                                                                                   |
| `max`                   | `number`                                                                                     | `—`                                 | multiple 为 true 时，多选的数目,不传或者值为 null\|undefined 的话无限制                                                       |
| `modelValue`            | `DatePickerValue`                                                                            | `—`                                 | 双向绑定值，使用 v-model；不要与 value 同时传入。                                                                             |
| `motion`                | `boolean`                                                                                    | `true`                              | 是否启用面板动画。                                                                                                            |
| `multiple`              | `boolean`                                                                                    | `false`                             | 是否可以选择多个，仅支持 type="date"                                                                                          |
| `needConfirm`           | `boolean`                                                                                    | `—`                                 | 是否需要“确认选择”，仅 type="dateTime"\|"dateTimeRange" 时有效                                                                |
| `onChangeWithDateFirst` | `boolean`                                                                                    | `true`                              | true 时 change 参数为 (Date 值, 格式化字符串)，false 时交换；v-model 始终接收 Date 值。                                       |
| `open`                  | `boolean`                                                                                    | `—`                                 | 调用时可以手动展开下拉列表                                                                                                    |
| `placeholder`           | `string \| string[]`                                                                         | `locale.placeholder[type]`          | 输入框提示文字                                                                                                                |
| `position`              | `PopoverPosition`                                                                            | `LTR: bottomLeft; RTL: bottomRight` | 浮层位置，可选值同[Popover#API 参考·position 参数](/zh-cn/components/popover/)                                                |
| `prefix`                | `VNodeChild`                                                                                 | `—`                                 | 前缀内容                                                                                                                      |
| `presetPosition`        | `DatePickerPresetPosition`                                                                   | `'bottom'`                          | 日期时间快捷方式面板位置, 可选值'left', 'right', 'top', 'bottom'                                                              |
| `presets`               | `Array<DatePickerPreset \| (() => DatePickerPreset)>`                                        | `[]`                                | 日期时间快捷方式, start 和 end 在 v2.52 版本支持函数类型                                                                      |
| `preventScroll`         | `boolean`                                                                                    | `—`                                 | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                         |
| `rangeSeparator`        | `string`                                                                                     | `' ~ '`                             | 自定义范围类型输入框的日期分隔符                                                                                              |
| `rangeSeparatorNode`    | `VNodeChild`                                                                                 | `—`                                 | 自定义范围类型输入框分隔符的渲染节点（仅影响 UI 渲染，字符串解析仍使用 rangeSeparator）                                       |
| `renderDate`            | `(dayNumber?: number, fullDate?: string) => VNodeChild`                                      | `—`                                 | 自定义日期数字内容，推荐 date 插槽；保留原有日期格子。                                                                        |
| `renderFullDate`        | `( dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus, ) => VNodeChild`     | `—`                                 | 自定义完整日期格子内容，推荐 fullDate 插槽；根据 status 保留禁用和选中外观。                                                  |
| `rightSlot`             | `VNodeChild`                                                                                 | `—`                                 | 面板右侧额外内容；可使用 right 插槽。                                                                                         |
| `showClear`             | `boolean`                                                                                    | `true`                              | 是否显示清除按钮                                                                                                              |
| `size`                  | `InputSize`                                                                                  | `'default'`                         | 尺寸，可选值："small", "default", "large"                                                                                     |
| `spacing`               | `number`                                                                                     | `insetInput ? 1 : 4`                | 浮层与 trigger 的距离                                                                                                         |
| `startDateOffset`       | `(selectedDate?: Date) => Date`                                                              | `—`                                 | type 为 dateRange 时，设置单击选择范围的开始日期                                                                              |
| `startYear`             | `number`                                                                                     | `—`                                 | 滚轮的开始年                                                                                                                  |
| `stopPropagation`       | `boolean \| string`                                                                          | `true`                              | 是否阻止弹出层上的点击事件冒泡                                                                                                |
| `style`                 | `StyleValue`                                                                                 | `—`                                 | Vue 样式对象或数组。                                                                                                          |
| `syncSwitchMonth`       | `boolean`                                                                                    | `false`                             | 在范围选择的场景中，支持同步切换双面板的月份                                                                                  |
| `timePickerOpts`        | `TimePickerProps`                                                                            | `—`                                 | 其他可以透传给时间选择器的参数，详见 [TimePicker·API 参考](/zh-cn/components/time-picker/)                                    |
| `timeZone`              | `string \| number`                                                                           | `ConfigProvider.timeZone`           | 显示时区，支持 GMT 字符串或偏移小时数；默认继承 ConfigProvider，不改变所表示的时间戳。                                        |
| `topSlot`               | `VNodeChild`                                                                                 | `—`                                 | 顶部额外内容；可使用 top 插槽。                                                                                               |
| `triggerRender`         | `(props: DatePickerTriggerSlotProps) => VNodeChild`                                          | `—`                                 | 自定义触发器函数；模板推荐使用 trigger 作用域插槽。                                                                           |
| `type`                  | `DatePickerType`                                                                             | `'date'`                            | 类型，可选值："date", "dateRange", "dateTime", "dateTimeRange", "month", "monthRange"                                         |
| `validateStatus`        | `InputValidateStatus`                                                                        | `'default'`                         | 校验状态 default / error / warning，只影响样式。                                                                              |
| `value`                 | `DatePickerValue`                                                                            | `—`                                 | 受控值；与 v-model:value 配合时由 update:value 同步。                                                                         |
| `weekStartsOn`          | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6`                                                            | `0`                                 | 以周几作为每周第一天，0 代表周日，1 代表周一，以此类推                                                                        |
| `yearAndMonthOpts`      | `Record<string, unknown>`                                                                    | `—`                                 | 传给年月 ScrollList 的配置。                                                                                                  |
| `zIndex`                | `number`                                                                                     | `1030`                              | 弹出面板的堆叠层级。                                                                                                          |

`—` 表示未设置独立默认值。普通 `class` / `style` 可用于 Vue 属性绑定；Boolean 默认值以当前实现为准。

### 事件

| 事件                | 参数                                                                                                                       | 说明                                                                 |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `blur`              | `[event?: unknown]`                                                                                                        | 输入框失焦；范围选择时需结合焦点位置处理。                           |
| `cancel`            | `[date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]`                                         | 取消确认选择，返回上次确认的值；仅日期时间且 needConfirm=true 生效。 |
| `change`            | `[ first: Date \| Date[] \| string \| string[] \| undefined, second: Date \| Date[] \| string \| string[] \| undefined, ]` | 选择或输入导致值变化。                                               |
| `clear`             | `[event?: unknown]`                                                                                                        | 点击清空按钮。                                                       |
| `clickOutside`      | `[event: MouseEvent]`                                                                                                      | 弹层打开时点击触发器和弹层以外的区域。                               |
| `confirm`           | `[date: Date \| Date[] \| undefined, dateString: string \| string[] \| undefined]`                                         | 确认当前日期时间；仅日期时间且 needConfirm=true 生效。               |
| `focus`             | `[event: unknown, rangeType?: DatePickerRangeType]`                                                                        | 输入框获得焦点。                                                     |
| `maxSelect`         | `[value?: Date[]]`                                                                                                         | 多选已达 max 后尝试增加日期时触发。                                  |
| `openChange`        | `[open: boolean]`                                                                                                          | 面板显示状态发生变化。                                               |
| `panelChange`       | `[date: Date \| Date[], dateString: string \| string[]]`                                                                   | 面板显示的月份或年份切换。                                           |
| `presetClick`       | `[item: DatePickerPreset, event: MouseEvent]`                                                                              | 点击快捷日期选项。                                                   |
| `update:modelValue` | `[value: Date \| Date[] \| undefined]`                                                                                     | 同步 v-model 值。                                                    |
| `update:open`       | `[open: boolean]`                                                                                                          | 同步 v-model:open 状态。                                             |
| `update:value`      | `[value: Date \| Date[] \| undefined]`                                                                                     | 同步 v-model:value 值。                                              |

事件在模板中使用 kebab-case，例如 `@open-change`、`@panel-change`；双向绑定使用 `v-model`、`v-model:value`，日期和时间的弹层还支持 `v-model:open`。

### 插槽

| 插槽              | 签名                                                                                           | 说明                                                    |
| ----------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `#bottom`         | `() => VNodeChild`                                                                             | 面板底部内容。                                          |
| `#clearIcon`      | `() => VNodeChild`                                                                             | 清空按钮图标。                                          |
| `#date`           | `(props: { dayNumber: number; fullDate: string }) => VNodeChild`                               | 日期数字的内容，保留内建格子。                          |
| `#fullDate`       | `(props: { dayNumber: number; fullDate: string; status: DatePickerDayStatus; }) => VNodeChild` | 完整日期格子的内容；status 提供状态。                   |
| `#insetLabel`     | `() => VNodeChild`                                                                             | 输入框内嵌标签。                                        |
| `#left`           | `() => VNodeChild`                                                                             | 面板左侧内容。                                          |
| `#prefix`         | `() => VNodeChild`                                                                             | 输入框前缀内容。                                        |
| `#rangeSeparator` | `() => VNodeChild`                                                                             | 范围输入框的分隔符内容。                                |
| `#right`          | `() => VNodeChild`                                                                             | 面板右侧内容。                                          |
| `#top`            | `() => VNodeChild`                                                                             | 面板顶部内容。                                          |
| `#trigger`        | `(props: DatePickerTriggerSlotProps) => VNodeChild`                                            | 自定义触发器；使用 openPanel、close 和 clear 操作面板。 |

## Methods

通过模板 ref 调用公开实例方法。

```ts
export interface DatePickerExposed {
  readonly input: HTMLInputElement | null;
  blur(): void;
  close(): void;
  focus(focusType?: 'rangeStart' | 'rangeEnd'): void;
  open(): void;
}
```

::demo-block{demo="date-picker/zh-cn/Methods" title="Methods"}
::

## 类型定义

```ts
export type DatePickerBaseValue = string | number | Date;

export type DatePickerValue = DatePickerBaseValue | DatePickerBaseValue[];

export type DatePickerType =
  'date' | 'dateRange' | 'dateTime' | 'dateTimeRange' | 'month' | 'monthRange' | 'year';

export type DatePickerDensity = 'default' | 'compact';

export type DatePickerPresetPosition = 'left' | 'right' | 'top' | 'bottom';

export type DatePickerRangeType = 'rangeStart' | 'rangeEnd' | false;

export interface DatePickerDayStatus {
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedStart?: boolean;
  isSelectedEnd?: boolean;
  isInRange?: boolean;
  isHover?: boolean;
  isOffsetRangeStart?: boolean;
  isOffsetRangeEnd?: boolean;
  isHoverInOffsetRange?: boolean;
}

export interface DatePickerDisabledDateOptions {
  rangeStart?: string;
  rangeEnd?: string;
  rangeInputFocus?: DatePickerRangeType;
}

export interface DatePickerDisabledTimeOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}

export interface DatePickerPreset {
  start?: DatePickerBaseValue | (() => DatePickerBaseValue);
  end?: DatePickerBaseValue | (() => DatePickerBaseValue);
  text?: string;
}

export interface DatePickerInsetInputProps {
  placeholder?: {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
  };
}

export interface DatePickerLocale {
  placeholder: Partial<Record<DatePickerType, string | string[]>>;
  presets: string;
  footer: { confirm: string; cancel: string };
  selectDate: string;
  selectTime: string;
  year: string;
  month: string;
  day: string;
  monthText: string;
  months: Record<number, string>;
  fullMonths: Record<number, string>;
  weeks: Record<string, string>;
  localeFormatToken: { FORMAT_SWITCH_DATE: string };
}

export interface DatePickerTriggerSlotProps {
  value: Date[];
  inputValue: string;
  placeholder: string | string[];
  autoFocus: boolean;
  size: InputSize;
  disabled: boolean;
  inputReadOnly: boolean;
  componentProps: DatePickerProps;
  open: boolean;
  openPanel(): void;
  close(): void;
  clear(event?: Event): void;
}
```

## Accessibility

### ARIA、键盘和焦点

日期面板使用 grid、row、columnheader 和 gridcell，日期格子提供 aria-label、aria-disabled、aria-selected；多选月份带 aria-multiselectable。使用 id 与可见 label，或 ariaLabelledby，为输入框提供业务含义明确的名称。

Tab / Shift + Tab 可在输入框、面板按钮和可聚焦日期间移动；公开 focus 方法支持 rangeStart / rangeEnd。当前日期格子没有方向键导航契约，不能把 grid 角色视为已实现完整网格键盘操作。自定义 trigger 应使用可聚焦的按钮，并保留名称和面板开关；自定义 fullDate 应根据 status 呈现选中及禁用状态。

## 文案规范

- 日期选择器建议搭配标签使用
- 使用简洁的标签来表明日期选择所指的内容
- 日期选择器中日期格式请参考[日期与时间](/zh-cn/experience/content-guidelines/)的规范

## 设计变量

::token-table{component="datePicker"}
::

## 日期时间格式

semi-ui 组件库中采用 [date-fns(v2.30.0)](https://date-fns.org/v2.30.0/docs/Getting-Started) 作为日期时间引擎，格式化 token 含义如下：

- `"y"` ：年
- `"M"` ：月
- `"d"` ：日
- `"H"` ：小时
- `"m"` ：分钟
- `"s"` ：秒

下面以 `new Date('2023-12-09 08:08:00')` 和 `[new Date('2023-12-09 08:08:00'), new Date('2023-12-10 10:08:00')]` 为例说明不同 `format` 值对展示值的影响：

| 类型          | format              | 展示值                                    |
| ------------- | ------------------- | ----------------------------------------- |
| date          | yyyy-MM-dd          | 2023-12-09                                |
| dateTime      | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08:00                       |
| month         | yyyy-MM             | 2023-12                                   |
| dateRange     | yyyy-MM-dd          | 2023-12-09 ~ 2023-12-10                   |
| dateTimeRange | yyyy-MM-dd HH:mm:ss | 2023-12-09 08:08:00 ~ 2023-12-10 10:08:00 |

多个日期或时间默认使用 `","` （英文逗号）分隔。

> 更多 token 可以查阅 [date-fns 官网](https://date-fns.org/v2.30.0/docs/Unicode-Tokens)

## FAQ

- **日期时间选择器，时分秒选择时想要无限滚动效果如何实现？**  
  版本V2.22.0开始，我们将 TimePicker 内的 ScrollItem 的默认模式从 wheel 变更为了 normal, 若想应用回无限滚动的效果，可以通过 timePickerOpts 中的特定开关控制该行为，即 :time-picker-opts="{ scrollItemProps: { mode: 'wheel', cycled: true } }"。

- **如何设置面板打开时默认显示的时间？**  
  可通过 defaultPickerValue 属性。

- **日期时间选择、范围日期选择，输入部分日期后，面板没有回显日期？**

  输入框需要输入完整后才会回显到面板上。比如，日期时间选择，完整要求日期和时间都已输入。范围日期选择，完整要求开始日期和结束日期都已输入。

- **日期时间选择面板底部的展示的时间是什么？**

  未选择时间时，它为 defaultPickerValue 中时间的值，如果没有设置则是面板打开时的时间。选择时间后，它为已选择的时间。

  由于设计上它有隐含两层含义，可能会导致歧义，建议使用内嵌样式，通过 `insetInput` 打开。使用前推荐阅读相关 <a href="#内嵌输入框">文档</a>。

  [查看内嵌输入框演示](#内嵌输入框)

## React → Vue 迁移

| React                                               | Vue                                                                              |
| --------------------------------------------------- | -------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`                                 | `@aifuxi/semi-ui-vue/date-picker` + `@aifuxi/semi-theme-default/date-picker.css` |
| `useState` / `useMemo`                              | `ref` / `shallowRef` / `computed`                                                |
| `value` + `onChange`                                | `v-model` / `v-model:value` / `:value` + `@change`                               |
| `className` / `ReactNode`                           | Vue `class` / `VNodeChild` 与插槽                                                |
| `ref.current`                                       | 模板 ref 的公开实例                                                              |
| `open` + `onOpenChange`                             | `v-model:open` / `:open` + `@open-change`                                        |
| `triggerRender(props)`                              | `#trigger="props"` 或返回 VNodeChild 的同名函数                                  |
| `onChangeWithDateFirst`                             | `:on-change-with-date-first` 保留参数排序；v-model 不受排序影响                  |
| `renderDate(dayNumber, fullDate)`                   | `#date="{ dayNumber, fullDate }"`                                                |
| `renderFullDate(dayNumber, fullDate, status)`       | `#fullDate="{ dayNumber, fullDate, status }"`                                    |
| `topSlot` / `bottomSlot` / `leftSlot` / `rightSlot` | `#top` / `#bottom` / `#left` / `#right`                                          |
| `onClickOutSide`                                    | `@click-outside`                                                                 |
| `BaseDatePicker` ref                                | `DatePickerExposed`                                                              |

涉及当前日期的演示以本地时间 `2024-08-15 10:24:30` 为基准，原有固定日期和时区时间戳保持不变。空白 DatePicker 通过 defaultPickerValue 固定月份；组件内部“今天”高亮仍依赖运行时钟。
