---
title: 'Calendar 日历'
description: '日历组件，允许以日/周/月视图展示对应事件'
type: 'show'
order: 64
icon: 'doc-calendar'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/calendar` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-calendar-1" title="如何引入" kind="import" />

### 日视图

日视图的日历模板，可通过 `showCurrTime` 控制是否显示当前时间的位置红线。

<DemoBlock id="zh-CN-show-calendar-2" title="日视图" kind="live" />

### 周视图

周视图的日历模板，可通过 `showCurrTime` 控制是否显示当前时间的位置红线。

<DemoBlock id="zh-CN-show-calendar-3" title="周视图" kind="live" />

### 月视图

月视图的日历模板。

<DemoBlock id="zh-CN-show-calendar-4" title="月视图" kind="live" />

### 设置周起始日

可以通过 weekStartsOn 设置周几作为每周第一天，0 代表周日，1 代表周一，以此类推。默认为周日。weekStartsOn 自 v2.18 起提供，对月视图、周视图生效。

<DemoBlock id="zh-CN-show-calendar-5" title="设置周起始日" kind="live" />

### 多日视图

多日视图模式。 `range` 必传，左闭右开。

<DemoBlock id="zh-CN-show-calendar-6" title="多日视图" kind="live" />

### 事件渲染用法

通过 `events` 传入需要渲染的 `CalendarEvent` 数组，具体形式请参考 Event Object API。

<DemoBlock id="zh-CN-show-calendar-7" title="事件渲染用法" kind="live" />

### 自定义渲染

通过 `#dateGrid="{ dateString, date }"` 作用域插槽自定义日期单元格或日期列，内容需要使用绝对定位。

#### 自定义渲染事件

<DemoBlock id="zh-CN-show-calendar-8" title="自定义渲染事件" kind="live" />

#### 自定义渲染单元格样式

可以通过 `#dateGrid` 插槽自定义单元格背景。月视图文字的 zIndex 默认为 3，如需完全覆盖单元格，可设置更大的 zIndex。

<DemoBlock id="zh-CN-show-calendar-9" title="自定义渲染单元格样式" kind="live" />

#### 自定义日期文案

可以通过 `#dateDisplay="{ date }"` 作用域插槽自定义日期文案。

<DemoBlock id="zh-CN-show-calendar-10" title="自定义日期文案" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/calendar/types.ts` 的公开类型为准。

#### Vue 用法

- `day`、`week`、`month`、`range` 由 Calendar 内部视图实现，不作为公开子组件导出。
- `header` 与 `events[].content` 保留 VNode prop；对应 header、event 插槽优先。
- `range` 左闭右开；`weekStartsOn` 对周视图和月视图生效。

#### Vue 事件

**Calendar**

| 事件      | 参数                                               | 说明                 |
| --------- | -------------------------------------------------- | -------------------- |
| click     | [event: MouseEvent, date: Date]                    | 点击日期格           |
| close     | [event: MouseEvent]                                | 关闭月视图事件列表   |
| moreClick | [event: MouseEvent, date: Date, remaining: number] | 点击月视图“还有几项” |

#### Vue 插槽

**Calendar**

| 插槽         | 作用域参数                         | 说明                         |
| ------------ | ---------------------------------- | ---------------------------- |
| allDayEvents | { events: CalendarEvent[] }        | 顶部全天事件区               |
| dateDisplay  | { date: Date }                     | 日期文案                     |
| dateGrid     | { date: Date, dateString: string } | 日期单元格或日期列           |
| event        | { event: CalendarEvent }           | 单个事件内容                 |
| header       | {}                                 | 日历头部                     |
| timeDisplay  | { time: number }                   | 日、周、范围视图的时间轴文案 |

### Calendar

| 属性           | 说明                                                        | 类型                    | 默认值                   |
| -------------- | ----------------------------------------------------------- | ----------------------- | ------------------------ |
| className      | 样式类名                                                    | HTMLAttributes['class'] | —                        |
| displayValue   | 展示日期                                                    | Date                    | 组件实例创建时的当前日期 |
| events         | 待渲染的 CalendarEvent 列表                                 | CalendarEvent[]         | []                       |
| header         | 头部 VNode；header 插槽优先                                 | VNodeChild              | -                        |
| height         | 日历高度                                                    | number \| string        | 600                      |
| markWeekend    | 区分周末列和工作日，以灰色显示                              | boolean                 | false                    |
| minEventHeight | 日视图、多日视图以及周视图下事件的最小高度(**&gt;=2.49.0**) | number                  | Number.MIN_SAFE_INTEGER  |
| mode           | 初始模式，`day`, `week`, `month`, `range`                   | CalendarMode            | `week`                   |
| range          | range 模式的左闭右开日期范围                                | Date[]                  | []                       |
| scrollTop      | 日视图和周视图模式下，设置展示内容默认的滚动高度            | number                  | 400                      |
| showCurrTime   | 显示当前时间                                                | boolean                 | true                     |
| style          | 内联样式                                                    | StyleValue              | —                        |
| weekStartsOn   | 每周第一天；0 为周日，1 为周一，依此类推                    | WeekStartsOn            | 0                        |
| width          | 日历宽度                                                    | number \| string        | -                        |

### Event Object

`events` 是一个 `CalendarEvent` 数组，成员格式如下：
当事件为全天事件时，若没有传入起始结束时间，则自动追加到 `displayValue` 的日期中；当事件不是全天事件时，起始结束时间至少传入一个才会被视为有效事件

| 属性    | 说明                           | 类型           | 默认值 |
| ------- | ------------------------------ | -------------- | ------ |
| key     | 唯一事件 key                   | string（必填） | -      |
| allDay  | 全天事件                       | boolean        | false  |
| start   | 事件开始时间                   | Date           | -      |
| end     | 事件结束时间                   | Date           | -      |
| content | 事件内容 VNode；event 插槽优先 | VNodeChild     | —      |

## 文案规范

- 当需要显示时间时，12 小时制和 24 小时制都是可以使用的
- 如果采用12小时制，需要搭配 AM/PM 一起使用，具体内容可参考 [时间规范](/zh-CN/experience/content-guidelines#8.%20%E6%97%A5%E6%9C%9F%E4%B8%8E%E6%97%B6%E9%97%B4)
- 关于月份、星期、时间的缩写使用规则，可参考 [缩写规范](/zh-CN/experience/content-guidelines#1.%20%E7%BC%A9%E5%86%99)
