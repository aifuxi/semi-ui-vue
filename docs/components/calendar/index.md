# Calendar 日历

Calendar 以日、周、月或自定义连续日期范围展示事件。本实现以 Semi Design React v2.102.0 为固定基线。

## 基础用法

```vue
<script setup lang="ts">
import { Calendar, type CalendarEvent } from '@aifuxi/semi-ui-vue';

const displayValue = new Date(2023, 3, 10, 8, 32);
const events: CalendarEvent[] = [
  {
    key: 'meeting',
    start: new Date(2023, 3, 10, 9),
    end: new Date(2023, 3, 10, 10),
    content: '评审会',
  },
  { key: 'release', allDay: true, start: new Date(2023, 3, 11), content: '发布日' },
];
</script>

<template>
  <Calendar mode="week" :display-value="displayValue" :events="events" :height="480" />
</template>
```

`mode` 支持 `day`、`week`、`month` 和 `range`。range 左闭右开：

```vue
<Calendar mode="range" :range="[new Date(2023, 3, 10), new Date(2023, 3, 14)]" />
```

## 周起始日与周末

```vue
<Calendar mode="month" :week-starts-on="1" mark-weekend />
```

`weekStartsOn` 为 `0..6`，默认 `0`（周日）。

## Vue scoped slots

```vue
<Calendar :events="events" mode="month">
  <template #header><strong>项目日历</strong></template>
  <template #dateDisplay="{ date }">{{ date.getDate() }} 日</template>
  <template #dateGrid="{ date }"><i v-if="date.getDay() === 1">周会</i></template>
  <template #event="{ event }"><span>{{ event.content }}</span></template>
  <template #allDayEvents="{ events }">全天 {{ events.length }} 项</template>
</Calendar>
```

`timeDisplay` 提供 `{ time }`，用于替换日/周/范围视图的时间轴文案。

## 事件与回调

```vue
<Calendar
  mode="month"
  :events="events"
  @click="(event, date) => console.log(date)"
  @more-click="(event, date, remaining) => console.log(date, remaining)"
  @close="(event) => console.log('closed', event)"
/>
```

日、周、范围视图按半小时触发 `click`；月视图按天触发。月视图事件折叠卡片默认 Teleport 到 `body`，也遵循 ConfigProvider 的 `getPopupContainer`。

## API

| 属性             | 类型                            | 默认值                    | 说明                     |
| ---------------- | ------------------------------- | ------------------------- | ------------------------ |
| `displayValue`   | `Date`                          | 当前时间                  | 展示日期                 |
| `events`         | `CalendarEvent[]`               | `[]`                      | 事件列表，key 必须唯一   |
| `header`         | `VNodeChild`                    | -                         | 头部，也可用 `#header`   |
| `height`         | `number \| string`              | `600`                     | 日历高度                 |
| `markWeekend`    | `boolean`                       | `false`                   | 标记周末                 |
| `minEventHeight` | `number`                        | `Number.MIN_SAFE_INTEGER` | 日内事件最小高度         |
| `mode`           | `day \| week \| month \| range` | `week`                    | 展示模式                 |
| `range`          | `Date[]`                        | `[]`                      | range 模式的左闭右开区间 |
| `scrollTop`      | `number`                        | `400`                     | 日/周/范围初始滚动高度   |
| `showCurrTime`   | `boolean`                       | `true`                    | 当前时间线               |
| `weekStartsOn`   | `0..6`                          | `0`                       | 每周第一天               |
| `width`          | `number \| string`              | -                         | 日历宽度                 |

`CalendarEvent` 包含 `key`、`allDay?`、`start?`、`end?` 和 `content?`。非全天事件至少传入 start/end 之一。

## 可访问性与服务端渲染

月视图输出 grid/row/columnheader/gridcell 与 `aria-current="date"`；折叠入口保留上游静态点击语义，事件卡片关闭按钮可键盘聚焦并有本地化名称。四种模式均支持 SSR-safe import/render，测量、当前时间 RAF、ResizeObserver 与 Portal 只在客户端创建并清理。
