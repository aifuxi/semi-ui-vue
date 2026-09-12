---
title: '日历'
description: '日历组件，允许以日/周/月视图展示对应事件'
locale: 'zh-CN'
slug: 'calendar'
category: 'show'
order: 64
englishTitle: 'Calendar'
icon: 'doc-calendar'
upstream: 'show/calendar'
---

## 代码演示

### 如何引入

```vue
<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
</script>
```

### 日视图

日视图的日历模板，可通过 `showCurrTime` 控制是否显示当前时间的位置红线。

::demo-block{demo="calendar/zh-cn/Day" title="日视图"}
::

### 周视图

周视图的日历模板，可通过 `showCurrTime` 控制是否显示当前时间的位置红线。

::demo-block{demo="calendar/zh-cn/Week" title="周视图"}
::

### 月视图

月视图的日历模板。

::demo-block{demo="calendar/zh-cn/Month" title="月视图"}
::

### 设置周起始日

可以通过 weekStartsOn 设置周几作为每周第一天，0 代表周日，1 代表周一，以此类推。默认为周日。weekStartsOn 自 v2.18 起提供，对月视图、周视图生效。
::demo-block{demo="calendar/zh-cn/WeekStart" title="设置周起始日"}
::

### 多日视图

多日视图模式。 `range` 必传，左闭右开。

::demo-block{demo="calendar/zh-cn/Range" title="多日视图"}
::

### 事件渲染用法

通过 `events` 传入需要渲染的事件，`events` 是一个由 event objects 组成的数组，具体形式请参考 events API。

::demo-block{demo="calendar/zh-cn/Events" title="事件渲染用法"}
::

### 自定义渲染

通过 dateGrid 插槽 可以自定义渲染日期单元格/列。需要使用绝对定位。

#### 自定义渲染事件

::demo-block{demo="calendar/zh-cn/CustomEvents" title="自定义渲染事件"}
::

#### 自定义渲染单元格样式

可以通过 dateGrid 插槽 自定义单元格的背景，月视图的文字 zIndex 默认为 3，如需完全覆盖单元格可以设置更大的 zIndex 来实现。

::demo-block{demo="calendar/zh-cn/CellStyle" title="自定义渲染单元格样式"}
::

#### 自定义日期文案

可以通过 dateDisplay 插槽 自定义日期文案。

::demo-block{demo="calendar/zh-cn/DateDisplay" title="自定义日期文案"}
::

## API 参考

### Calendar

| 属性             | 说明                                                                | 类型                      | 默认值                    |
| ---------------- | ------------------------------------------------------------------- | ------------------------- | ------------------------- |
| `className`      | 兼容类名                                                            | `HTMLAttributes['class']` | `—`                       |
| `displayValue`   | 展示日期                                                            | `Date`                    | `当前日期`                |
| `events`         | 渲染事件，具体格式请参考 event object                               | `CalendarEvent[]`         | `—`                       |
| `header`         | 自定义头部内容                                                      | `VNodeChild`              | `—`                       |
| `height`         | 日历高度                                                            | `number \| string`        | `600`                     |
| `markWeekend`    | 区分周末列和工作日，以灰色显示                                      | `boolean`                 | `false`                   |
| `minEventHeight` | 日视图、多日视图以及周视图下事件的最小高度(**>=2.49.0**)            | `number`                  | `Number.MIN_SAFE_INTEGER` |
| `mode`           | 初始模式，`day`, `week`, `month`, `range`                           | `CalendarMode`            | `week`                    |
| `range`          | 多日视图模式下展示的日期范围，左闭右开                              | `Date[]`                  | `—`                       |
| `scrollTop`      | 日视图和周视图模式下，设置展示内容默认的滚动高度                    | `number`                  | `400`                     |
| `showCurrTime`   | 显示当前时间                                                        | `boolean`                 | `true`                    |
| `style`          | 根节点内联样式                                                      | `StyleValue`              | `—`                       |
| `weekStartsOn`   | 以周几作为每周第一天，0 代表周日，1 代表周一，以此类推。v2.18后支持 | `WeekStartsOn`            | `0`                       |
| `width`          | 日历宽度                                                            | `number \| string`        | `—`                       |

### Event Object

| 属性      | 说明                    | 类型         | 默认值     |
| --------- | ----------------------- | ------------ | ---------- |
| `key`     | required 且要求唯一     | `string`     | `required` |
| `allDay`  | 全天事件                | `boolean`    | `false`    |
| `start`   | 事情起始的时间          | `Date`       | `—`        |
| `end`     | 事情结束的时间          | `Date`       | `—`        |
| `content` | 显示内容；支持 Vue 节点 | `VNodeChild` | `—`        |

插槽：#header、`#dateGrid="{ dateString, date }"`、`#dateDisplay="{ date }"`、`#timeDisplay="{ time }"`、`#allDayEvents="{ events }"`、`#event="{ event }"`；React render prop 改为这些插槽。事件：`@click(event: MouseEvent, date)`、`@close(event: MouseEvent)`、`@more-click(event: MouseEvent, date, remaining)`。没有日期选择 v-model。

CalendarEvent.key 必填且唯一，content 接受 Vue 节点。全天事件缺省起止时间时归到 displayValue；普通事件至少需要 start 或 end。range 为左闭右开区间。示例沿用固定上游参数，缺省 displayValue 与 `showCurrTime` 保持开启；验收矩阵在两侧固定浏览器 Date，使缺省日期与当前时间线保持确定性。

## 文案规范

- 当需要显示时间时，12 小时制和 24 小时制都是可以使用的
- 如果采用12小时制，需要搭配 AM/PM 一起使用，具体内容可参考 [时间规范](/zh-cn/experience/content-guidelines/)
- 关于月份、星期、时间的缩写使用规则，可参考 [缩写规范](/zh-cn/experience/content-guidelines/)

## 设计变量

::token-table{component="calendar"}
::

## Accessibility

月视图提供 grid、row、columnheader、gridcell 语义。事件文字应明确、对比度充足。自定义事件或单元格需要交互时应使用可访问控件，绝对定位节点不会自动获得键盘行为。

## FAQ

**事件为什么不显示？** 检查唯一 key 与有效 start/end 日期。

**为什么 range 不含最后一天？** range 的结束日期为开区间。

**如何自定义单元格？** 使用 dateGrid 插槽，并相对单元格定位内容。

## React → Vue

| React                              | Vue                                     |
| ---------------------------------- | --------------------------------------- |
| `events[].children`                | `events[].content / #event="{ event }"` |
| `header ReactNode`                 | `#header`                               |
| `dateGridRender(dateString, date)` | `#dateGrid="{ dateString, date }"`      |
| `renderDateDisplay(date)`          | `#dateDisplay="{ date }"`               |
| `renderTimeDisplay(time)`          | `#timeDisplay="{ time }"`               |
| `allDayEventsRender(events)`       | `#allDayEvents="{ events }"`            |
| `onClick / onClose / onMoreClick`  | `@click / @close / @more-click`         |
