# Calendar

Calendar displays events in day, week, month, or an explicit continuous range. The fixed implementation baseline is Semi Design React v2.102.0.

## Basic usage

```vue
<script setup lang="ts">
import { Calendar, type CalendarEvent } from '@aifuxi/semi-ui-vue';

const displayValue = new Date(2023, 3, 10, 8, 32);
const events: CalendarEvent[] = [
  {
    key: 'meeting',
    start: new Date(2023, 3, 10, 9),
    end: new Date(2023, 3, 10, 10),
    content: 'Review',
  },
  { key: 'release', allDay: true, start: new Date(2023, 3, 11), content: 'Release day' },
];
</script>

<template>
  <Calendar mode="week" :display-value="displayValue" :events="events" :height="480" />
</template>
```

`mode` accepts `day`, `week`, `month`, and `range`. A range is left-closed and right-open:

```vue
<Calendar mode="range" :range="[new Date(2023, 3, 10), new Date(2023, 3, 14)]" />
```

## Week start and weekends

```vue
<Calendar mode="month" :week-starts-on="1" mark-weekend />
```

`weekStartsOn` is `0..6` and defaults to `0` (Sunday).

## Vue scoped slots

`header`, `dateDisplay`, `dateGrid`, `timeDisplay`, `event`, and `allDayEvents` replace the corresponding React node/render props with typed Vue slots.

```vue
<Calendar :events="events" mode="month">
  <template #header><strong>Project calendar</strong></template>
  <template #dateDisplay="{ date }">Day {{ date.getDate() }}</template>
  <template #event="{ event }"><span>{{ event.content }}</span></template>
</Calendar>
```

## Events

Day, week, and range cells emit `click(event, date)` in half-hour units. Month cells use one-day units. Month overflow emits `moreClick(event, date, remaining)` and its card emits `close(event)`. The card teleports to `body` or the stable `ConfigProvider.getPopupContainer` target.

## API

| Prop             | Type                            | Default                   | Description                            |
| ---------------- | ------------------------------- | ------------------------- | -------------------------------------- |
| `displayValue`   | `Date`                          | current time              | Display date                           |
| `events`         | `CalendarEvent[]`               | `[]`                      | Events with unique keys                |
| `header`         | `VNodeChild`                    | -                         | Header; `#header` is preferred         |
| `height`         | `number \| string`              | `600`                     | Calendar height                        |
| `markWeekend`    | `boolean`                       | `false`                   | Mark weekend columns/cells             |
| `minEventHeight` | `number`                        | `Number.MIN_SAFE_INTEGER` | Minimum timed-event height             |
| `mode`           | `day \| week \| month \| range` | `week`                    | View mode                              |
| `range`          | `Date[]`                        | `[]`                      | Left-closed/right-open range           |
| `scrollTop`      | `number`                        | `400`                     | Initial day/week/range scroll position |
| `showCurrTime`   | `boolean`                       | `true`                    | Current-time indicator                 |
| `weekStartsOn`   | `0..6`                          | `0`                       | First weekday                          |
| `width`          | `number \| string`              | -                         | Calendar width                         |

`CalendarEvent` contains `key`, `allDay?`, `start?`, `end?`, and `content?`. A non-all-day event needs at least one time boundary.

## Accessibility and SSR

Month mode exposes grid/row/columnheader/gridcell semantics and `aria-current="date"`. The overflow entry preserves the upstream static click semantics; the event-card close button is keyboard focusable and has a localized name. All four modes are SSR-safe; measurement, current-time RAF, ResizeObserver, and Portal resources are client-only and cleaned up.
