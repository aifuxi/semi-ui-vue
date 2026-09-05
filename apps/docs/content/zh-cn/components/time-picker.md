---
title: '时间选择器'
description: '用户使用时间选择器可以方便地选择某一符合要求的、格式化的时间点'
locale: 'zh-CN'
slug: 'time-picker'
category: 'input'
order: 50
englishTitle: 'TimePicker'
icon: 'doc-timepicker'
upstream: 'input/timepicker'
---

## 代码演示

### 如何引入

```ts
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';
```

### 基础使用

点击 TimePicker，然后可以在浮层中选择或者输入某一时间。

::demo-block{demo="time-picker/zh-cn/Basic" title="基础使用"}
::

### 无限滚动

版本V2.22.0开始，我们将 TimePicker 内的 ScrollItem 的默认模式从 `wheel` 变更为了 `normal`, 若想应用回无限滚动的效果，可参考以下示例。

::demo-block{demo="time-picker/zh-cn/Wheel" title="无限滚动"}
::

### 受控组件

当使用 `value` 而不是 `defaultValue` 时，作为受控组件使用。`value` 和 `@change` 需要配合使用。

::demo-block{demo="time-picker/zh-cn/Controlled" title="受控组件"}
::

### 不同的 Format 格式

TimePicker 浮层中的列会随着 `format` 变化，当略去 `format` 中的某部分时，浮层中对应的列也会消失。

NOTE: `format` 遵循 date-fns 的 `format` 格式。 https://date-fns.org/v2.30.0/docs/format

::demo-block{demo="time-picker/zh-cn/Format" title="不同的 Format 格式"}
::

### 设置面板头部，底部

::demo-block{demo="time-picker/zh-cn/PanelSlots" title="设置面板头部，底部"}
::

### 禁用时间选择

::demo-block{demo="time-picker/zh-cn/Disabled" title="禁用时间选择"}
::

### 设置步长

可以使用 `hourStep`, `minuteStep`, `secondStep` 按步长展示可选的时分秒。

::demo-block{demo="time-picker/zh-cn/Step" title="设置步长"}
::

### 12 小时制

12 小时制的时间选择器，默认的 `format` 为 `h:mm:ss a`，传入的 `format` 格式必须在 [dateFns 日期格式](https://date-fns.org/v2.30.0/docs/format)范围之内。

> 例如可用的 12 小时制格式串为：`a h:mm:ss`，如果传入 `A h:mm:ss` 则会导致无法正确格式化。

::demo-block{demo="time-picker/zh-cn/TwelveHours" title="12 小时制"}
::

### 时间范围

传入 type="timeRange" 开启时间范围选择。

::demo-block{demo="time-picker/zh-cn/Range" title="时间范围"}
::

### Range 模式下分别禁用左右面板（disabledTime）

当 `type="timeRange"` 时，你可以通过 `disabledTime(value, panelType)` 对左右面板分别应用不同的禁用规则。

- `value`：当前范围值 `Date[]`（可能为空/长度为 1/2）；该回调仅在 range 模式使用。
- `panelType`：`'left' | 'right'`，分别代表开始/结束面板

下面示例实现：选择开始时间后，右侧结束时间面板会禁用早于开始时间的选项。

::demo-block{demo="time-picker/zh-cn/DisabledRange" title="Range 模式下分别禁用左右面板（disabledTime）"}
::

### 自定义触发器

默认情况下我们使用 `Input` 组件作为 `TimePicker` 组件的触发器，通过 `#trigger` 作用域插槽可以自定义这个触发器，也支持返回 VNodeChild 的 `triggerRender` 函数。

::demo-block{demo="time-picker/zh-cn/Trigger" title="自定义触发器"}
::

## 时区设置

Semi 所有关于时区的配置都收敛在 ConfigProvider 中，详细使用可以参考 [ConfigProvider](/zh-cn/components/config-provider/)

::demo-block{demo="time-picker/zh-cn/TimeZone" title="时区设置"}
::

## API 参考

### TimePickerProps

| 属性                    | 类型                                                                           | 默认值                                  | 说明                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaDescribedby`       | `string`                                                                       | `—`                                     | 描述元素 ID 列表，传给内部输入框 aria-describedby。                                                                                                                                                                                                                                                                                                                                                                                                      |
| `ariaErrormessage`      | `string`                                                                       | `—`                                     | 错误消息元素 ID，传给 aria-errormessage。                                                                                                                                                                                                                                                                                                                                                                                                                |
| `ariaInvalid`           | `boolean \| 'false' \| 'true' \| 'grammar' \| 'spelling'`                      | `—`                                     | 标记输入值是否无效；不执行校验。                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `ariaLabel`             | `string`                                                                       | `—`                                     | 输入框的可访问名称。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `ariaLabelledby`        | `string`                                                                       | `—`                                     | 标签元素 ID 列表，传给内部输入框 aria-labelledby。                                                                                                                                                                                                                                                                                                                                                                                                       |
| `ariaRequired`          | `boolean \| 'false' \| 'true'`                                                 | `—`                                     | 标记输入是否必填；不执行校验。                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `autoAdjustOverflow`    | `boolean`                                                                      | `true`                                  | 浮层被遮挡时是否自动调整方向                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `autoFocus`             | `boolean`                                                                      | `—`                                     | 自动获取焦点                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `borderless`            | `boolean`                                                                      | `false`                                 | 无边框模式 >=2.33.0                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `className`             | `HTMLAttributes['class']`                                                      | `—`                                     | 外层样式名                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `clearIcon`             | `VNodeChild`                                                                   | `—`                                     | 可用于自定义清除按钮, showClear为true时有效                                                                                                                                                                                                                                                                                                                                                                                                              |
| `clearText`             | `string`                                                                       | `'clear'`                               | 清空按钮的可访问文本。                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `dateFnsLocale`         | `unknown`                                                                      | `—`                                     | date-fns 的语言数据；默认按 localeCode 选择中文或英文。                                                                                                                                                                                                                                                                                                                                                                                                  |
| `defaultOpen`           | `boolean`                                                                      | `—`                                     | 面板是否默认打开                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `defaultValue`          | `TimePickerValue`                                                              | `—`                                     | 非受控初始值；后续变化使用 v-model。                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabled`              | `boolean`                                                                      | `false`                                 | 禁用全部操作                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `disabledHours`         | `() => number[]`                                                               | `() => []`                              | 禁止选择部分小时选项                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabledMinutes`       | `(selectedHour: number) => number[]`                                           | `() => []`                              | 禁止选择部分分钟选项                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `disabledSeconds`       | `(selectedHour: number, selectedMinute: number) => number[]`                   | `() => []`                              | 禁止选择部分秒选项                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `disabledTime`          | `(value: Date[], panelType: TimePickerPanelType) => TimePickerDisabledOptions` | `—`                                     | **仅在 range 模式生效**：根据当前已选 dates 与面板位置返回 disabled 配置，左右面板可分别给出不同规则。回调参数 value：当前已选时间数组（length 0/1/2）；panelType：`'left'` 或 `'right'`。返回值中存在的字段会**覆盖**对应的顶层 disabledHours / disabledMinutes / disabledSeconds，未返回的字段则**回退**到顶层（如需关闭顶层规则，请显式返回空数组的函数）。单选模式下该 prop 被忽略，请直接使用顶层 disabledHours / disabledMinutes / disabledSeconds |
| `dropdownMargin`        | `number \| TooltipMargin`                                                      | `—`                                     | 浮层算溢出时的增加的冗余值，详见[issue#549](https://github.com/DouyinFE/semi-design/issues/549)，作用同 Tooltip margin                                                                                                                                                                                                                                                                                                                                   |
| `focusOnOpen`           | `boolean`                                                                      | `false`                                 | 挂载时是否打开面板并focus输入框                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `format`                | `string`                                                                       | `use12Hours ? 'h:mm:ss a' : 'HH:mm:ss'` | 展示的时间格式                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `getPopupContainer`     | `() => HTMLElement`                                                            | `document.body`                         | 指定容器，浮层将会渲染至该元素内，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。                                                                                                                                                                                                                                                                                                                                  |
| `hideDisabledOptions`   | `boolean`                                                                      | `false`                                 | 隐藏禁用的时间选项。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `hourStep`              | `number`                                                                       | `1`                                     | 小时选项间隔                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `id`                    | `string`                                                                       | `—`                                     | 内部输入框 ID，用于关联可见标签。                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `inputReadOnly`         | `boolean`                                                                      | `false`                                 | 设置输入框为只读（避免在移动设备上打开虚拟键盘）                                                                                                                                                                                                                                                                                                                                                                                                         |
| `inputStyle`            | `StyleValue`                                                                   | `—`                                     | 输入框样式。                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `insetLabel`            | `VNodeChild`                                                                   | `—`                                     | 输入框内嵌标签；可使用 insetLabel 插槽。                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `insetLabelId`          | `string`                                                                       | `—`                                     | 内嵌标签 ID。                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `locale`                | `TimePickerLocale`                                                             | `—`                                     | 覆盖本组件的文案数据；默认从 ConfigProvider 获取。                                                                                                                                                                                                                                                                                                                                                                                                       |
| `localeCode`            | `string`                                                                       | `—`                                     | 日期时间语言代码；默认继承 ConfigProvider。                                                                                                                                                                                                                                                                                                                                                                                                              |
| `minuteStep`            | `number`                                                                       | `1`                                     | 分钟选项间隔                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `modelValue`            | `TimePickerValue`                                                              | `—`                                     | 双向绑定值，使用 v-model；不要与 value 同时传入。                                                                                                                                                                                                                                                                                                                                                                                                        |
| `motion`                | `boolean`                                                                      | `true`                                  | 是否启用面板动画。                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `onChangeWithDateFirst` | `boolean`                                                                      | `true`                                  | true 时 change 参数为 (Date 值, 格式化字符串)，false 时交换；v-model 始终接收 Date 值。                                                                                                                                                                                                                                                                                                                                                                  |
| `open`                  | `boolean`                                                                      | `—`                                     | 面板是否打开的受控属性                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `panelFooter`           | `VNodeChild \| VNodeChild[]`                                                   | `—`                                     | 面板底部 addon                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `panelHeader`           | `VNodeChild \| VNodeChild[]`                                                   | `—`                                     | 面板头部 addon                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `panels`                | `TimePickerPanelConfig[]`                                                      | `—`                                     | 范围左右面板的头部与底部内容数组；按面板索引读取。                                                                                                                                                                                                                                                                                                                                                                                                       |
| `placeholder`           | `string`                                                                       | `locale.placeholder[type]`              | 没有值的时候显示的内容                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `popupClassName`        | `HTMLAttributes['class']`                                                      | `—`                                     | 弹出层类名                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `popupStyle`            | `StyleValue`                                                                   | `—`                                     | 弹出层样式对象                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `position`              | `TooltipPosition`                                                              | `LTR: bottomLeft; RTL: bottomRight`     | 浮层位置                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `preventScroll`         | `boolean`                                                                      | `false`                                 | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法                                                                                                                                                                                                                                                                                                                                                                                    |
| `rangeSeparator`        | `string`                                                                       | `' ~ '`                                 | 时间范围分隔符                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `scrollItemProps`       | `TimePickerScrollItemProps`                                                    | `—`                                     | 透传给 scrollItem 的属性，可选值同[ScrollList#API](/zh-cn/components/scroll-list/)                                                                                                                                                                                                                                                                                                                                                                       |
| `secondStep`            | `number`                                                                       | `1`                                     | 秒选项间隔                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `showClear`             | `boolean`                                                                      | `true`                                  | 是否展示清除按钮                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `size`                  | `InputSize`                                                                    | `'default'`                             | 输入框的大小，可选 'default'，'small'，'large'                                                                                                                                                                                                                                                                                                                                                                                                           |
| `stopPropagation`       | `boolean`                                                                      | `true`                                  | 是否阻止弹出层上的点击事件冒泡                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `style`                 | `StyleValue`                                                                   | `—`                                     | Vue 样式对象或数组。                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `timeZone`              | `string \| number`                                                             | `ConfigProvider.timeZone`               | 显示时区，支持 GMT 字符串或偏移小时数；默认继承 ConfigProvider，不改变所表示的时间戳。                                                                                                                                                                                                                                                                                                                                                                   |
| `triggerRender`         | `(props: TimePickerTriggerSlotProps) => VNodeChild`                            | `—`                                     | 自定义触发器函数；模板推荐使用 trigger 作用域插槽。                                                                                                                                                                                                                                                                                                                                                                                                      |
| `type`                  | `TimePickerType`                                                               | `'time'`                                | 类型                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `use12Hours`            | `boolean`                                                                      | `false`                                 | 使用 12 小时制，为 true 时 `format` 默认为 `h:mm:ss a`                                                                                                                                                                                                                                                                                                                                                                                                   |
| `validateStatus`        | `InputValidateStatus`                                                          | `'default'`                             | 校验状态 default / error / warning，只影响样式。                                                                                                                                                                                                                                                                                                                                                                                                         |
| `value`                 | `TimePickerValue`                                                              | `—`                                     | 受控值；与 v-model:value 配合时由 update:value 同步。                                                                                                                                                                                                                                                                                                                                                                                                    |
| `zIndex`                | `number \| string`                                                             | `1030`                                  | 弹出面板的堆叠层级。                                                                                                                                                                                                                                                                                                                                                                                                                                     |

`—` 表示未设置独立默认值。普通 `class` / `style` 可用于 Vue 属性绑定；Boolean 默认值以当前实现为准。

### 事件

| 事件                | 参数                                                                                                                          | 说明                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `blur`              | `[event: FocusEvent \| MouseEvent]`                                                                                           | 输入框失焦；范围选择时需结合焦点位置处理。 |
| `change`            | `[ value: TimePickerChangeValue \| TimePickerFormattedValue, formatted: TimePickerFormattedValue \| TimePickerChangeValue, ]` | 选择或输入导致值变化。                     |
| `focus`             | `[event: FocusEvent]`                                                                                                         | 输入框获得焦点。                           |
| `openChange`        | `[open: boolean]`                                                                                                             | 面板显示状态发生变化。                     |
| `update:modelValue` | `[value: TimePickerChangeValue]`                                                                                              | 同步 v-model 值。                          |
| `update:open`       | `[open: boolean]`                                                                                                             | 同步 v-model:open 状态。                   |
| `update:value`      | `[value: TimePickerChangeValue]`                                                                                              | 同步 v-model:value 值。                    |

事件在模板中使用 kebab-case，例如 `@open-change`；双向绑定使用 `v-model`、`v-model:value`，日期和时间的弹层还支持 `v-model:open`。

### 插槽

| 插槽           | 签名                                                | 说明                                                    |
| -------------- | --------------------------------------------------- | ------------------------------------------------------- |
| `#clearIcon`   | `() => VNodeChild`                                  | 清空按钮图标。                                          |
| `#insetLabel`  | `() => VNodeChild`                                  | 输入框内嵌标签。                                        |
| `#panelFooter` | `(props: TimePickerPanelSlotProps) => VNodeChild`   | 面板底部；index 为 0/1，panelType 为 left/right。       |
| `#panelHeader` | `(props: TimePickerPanelSlotProps) => VNodeChild`   | 面板头部；index 为 0/1，panelType 为 left/right。       |
| `#trigger`     | `(props: TimePickerTriggerSlotProps) => VNodeChild` | 自定义触发器；使用 openPanel、close 和 clear 操作面板。 |

## Methods

通过模板 ref 调用公开实例方法。

```ts
export interface TimePickerExposed {
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
}
```

## 类型定义

```ts
export type TimePickerBaseValue = string | number | Date | undefined;

export type TimePickerValue = TimePickerBaseValue | TimePickerBaseValue[];

export type TimePickerType = 'time' | 'timeRange';

export type TimePickerPanelType = 'left' | 'right';

export type TimePickerChangeValue = Date | Date[] | undefined;

export type TimePickerFormattedValue = string | string[];

export interface TimePickerLocale {
  AM?: string;
  PM?: string;
  begin: string;
  end: string;
  hour: string;
  minute: string;
  placeholder: Record<TimePickerType, string>;
  second: string;
}

export interface TimePickerPanelConfig {
  panelFooter?: VNodeChild;
  panelHeader?: VNodeChild;
}

export interface TimePickerScrollItemProps {
  'aria-label'?: string;
  cycled?: boolean;
  mode?: 'normal' | 'wheel';
  motion?: boolean;
  style?: StyleValue;
}

export interface TimePickerDisabledOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

export interface TimePickerTriggerSlotProps {
  clear(): void;
  close(): void;
  inputValue: string;
  open: boolean;
  openPanel(): void;
  placeholder: string;
  value: Date[];
}

export interface TimePickerPanelSlotProps {
  index: number;
  panelType: TimePickerPanelType;
}
```

## 文案规范

- 时间选择器至少包括时和分，如：11:30，它在本地化过程中，可以适应为12小时制或者24小时制
- 当选择12小时制，需要和AM/PM一起搭配使用

## 设计变量

::token-table{component="timePicker"}
::

## Accessibility

### ARIA、键盘和焦点

弹层使用 dialog 角色。通过 ariaLabel / ariaLabelledby 为输入框命名，ariaDescribedby 可关联时间格式说明，ariaInvalid / ariaErrormessage 可关联业务校验结果。

使用 Tab / Shift + Tab 移动输入框和自定义按钮的焦点；输入完整、符合 format 的时间，或通过面板选择。focus / blur / open / close 是公开实例方法。自定义 trigger 使用有名称的可聚焦元素，面板头尾的交互元素也应可用键盘操作。不要依赖未公开的方向键或 Esc 行为。

## FAQ

### 为什么只展示小时或分钟？

format 决定显示列；例如 HH:mm 隐藏秒，设置步长时只改变对应列的候选项。12 小时制应包含 a 以显示 AM/PM。

### 范围两侧如何使用不同禁用规则？

disabledTime 接收当前 Date[] 与 left/right；返回字段覆盖同名顶层规则，缺省字段回退顶层。单选请使用 disabledHours/Minutes/Seconds。

### change 与 v-model 的类型为什么不同？

change 同时提供日期值和格式化文本，可由 onChangeWithDateFirst 调换顺序；v-model 始终同步 Date 值，清空时可能为 undefined。

## React → Vue 迁移

| React                         | Vue                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `@douyinfe/semi-ui`           | `@aifuxi/semi-ui-vue/time-picker` + `@aifuxi/semi-theme-default/time-picker.css` |
| `useState` / `useMemo`        | `ref` / `shallowRef` / `computed`                                                |
| `value` + `onChange`          | `v-model` / `v-model:value` / `:value` + `@change`                               |
| `className` / `ReactNode`     | Vue `class` / `VNodeChild` 与插槽                                                |
| `ref.current`                 | 模板 ref 的公开实例                                                              |
| `open` + `onOpenChange`       | `v-model:open` / `:open` + `@open-change`                                        |
| `triggerRender(props)`        | `#trigger="props"` 或返回 VNodeChild 的同名函数                                  |
| `onChangeWithDateFirst`       | `:on-change-with-date-first` 保留参数排序；v-model 不受排序影响                  |
| `panelHeader` / `panelFooter` | `#panelHeader` / `#panelFooter` 接收 index、panelType                            |
| `prefix`                      | 当前没有同名公开 prop/slot；内嵌标签使用 insetLabel，复杂触发器使用 #trigger     |

涉及当前日期的演示以本地时间 `2024-08-15 10:24:30` 为基准，原有固定日期和时区时间戳保持不变。空白 DatePicker 通过 defaultPickerValue 固定月份；组件内部“今天”高亮仍依赖运行时钟。
