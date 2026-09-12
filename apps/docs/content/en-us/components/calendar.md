---
title: 'Calendar'
description: 'Calendar component that allows to display corresponding events in day/week/month view'
locale: 'en-US'
slug: 'calendar'
category: 'show'
order: 64
englishTitle: 'Calendar'
icon: 'doc-calendar'
upstream: 'show/calendar'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Calendar } from '@aifuxi/semi-ui-vue/calendar';
import '@aifuxi/semi-theme-default/calendar.css';
</script>
```

### Day Mode

Day mode. You could toggle the red line of current time using `showCurrTime`.

::demo-block{demo="calendar/en-us/Day" title="Day Mode"}
::

### Week Mode

Week mode. You could toggle the red line of current time using `showCurrTime`.

::demo-block{demo="calendar/en-us/Week" title="Week Mode"}
::

### Month Mode

Month Mode.

::demo-block{demo="calendar/en-us/Month" title="Month Mode"}
::

### Set week start day

The day of the week can be set as the first day of the week through weekStartsOn, 0 for Sunday, 1 for Monday, and so on. Default is Sunday.  
`weekStartsOn` is available since v2.18, and takes effect for month view and week view.

::demo-block{demo="calendar/en-us/WeekStart" title="Set week start day"}
::

### Range Mode

Range Mode. `range` is required which is a left-closed and right-open interval.

::demo-block{demo="calendar/en-us/Range" title="Range Mode"}
::

### Render Events

You could pass in an array of event objects to `events` to render items. For detailed format, refer to API below.

::demo-block{demo="calendar/en-us/Events" title="Render Events"}
::

### Custom Render

You could use `dateGrid slot` to render customized date cell or column. Use absolute positioning for elements.

#### Custom Render Events

::demo-block{demo="calendar/en-us/CustomEvents" title="Custom Render Events"}
::

#### Customized Date Cell Style

You could also use `dateGrid slot` to customize date cell style, e.g. backgroundColor. Please notice that in Month View, the date text on the right corner has a z-index of 3. Use a larger z-index if you would like to cover the text as well.
::demo-block{demo="calendar/en-us/CellStyle" title="Customized Date Cell Style"}
::

#### Customized Date Render

You could use `dateDisplay slot` to customize the display of date

::demo-block{demo="calendar/en-us/DateDisplay" title="Customized Date Render"}
::

## API Reference

### Calendar

| Property         | Description                                                                                                       | Type                      | Default                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------- |
| `className`      | Compatibility class                                                                                               | `HTMLAttributes['class']` | `—`                       |
| `displayValue`   | Display date                                                                                                      | `Date`                    | `current date`            |
| `events`         | Events for rendering, refer to event object                                                                       | `CalendarEvent[]`         | `—`                       |
| `header`         | Header                                                                                                            | `VNodeChild`              | `—`                       |
| `height`         | Height                                                                                                            | `number \| string`        | `600`                     |
| `markWeekend`    | Toggle whether to distinguish weekend column with grey background from weekdays                                   | `boolean`                 | `false`                   |
| `minEventHeight` | The minimum height of events in daily view, multi-day view and weekly view(**>=2.49.0**)                          | `number`                  | `Number.MIN_SAFE_INTEGER` |
| `mode`           | Mode, one of `day`, `week`, `month`, `range`                                                                      | `CalendarMode`            | `week`                    |
| `range`          | Date range to display in range mode, left-closed and right-open                                                   | `Date[]`                  | `—`                       |
| `scrollTop`      | Scroll height for displayed content in day and week mode                                                          | `number`                  | `400`                     |
| `showCurrTime`   | Toggle whether to show red line of current time                                                                   | `boolean`                 | `true`                    |
| `style`          | Root inline style                                                                                                 | `StyleValue`              | `—`                       |
| `weekStartsOn`   | Take the day of the week as the first day of the week, 0 for Sunday, 1 for Monday, and so on. Support after v2.18 | `WeekStartsOn`            | `0`                       |
| `width`          | Width                                                                                                             | `number \| string`        | `—`                       |

### Event Object

| Property  | Description                        | Type         | Default |
| --------- | ---------------------------------- | ------------ | ------- |
| `key`     | Required and must be unique.       | `string`     | `—`     |
| `allDay`  | Whether it is an all-day event     | `boolean`    | `false` |
| `start`   | Start time of the event            | `Date`       | `—`     |
| `end`     | End time of the event              | `Date`       | `—`     |
| `content` | Display content; accepts Vue nodes | `VNodeChild` | `—`     |

Slots: `#header`, `#dateGrid="{ dateString, date }"`, `#dateDisplay="{ date }"`, `#timeDisplay="{ time }"`, `#allDayEvents="{ events }"`, and `#event="{ event }"`. Render-prop names from React are replaced by these slots. Events: `@click(event: MouseEvent, date)`, `@close(event: MouseEvent)`, and `@more-click(event: MouseEvent, date, remaining)`. There is no date-selection v-model.

CalendarEvent.key is required and unique. Use content for a Vue node. All-day events without start/end attach to displayValue; a timed event requires at least start or end. Range mode uses an inclusive start and exclusive end. Demos keep the pinned upstream props, including the default displayValue and the current-time line; the acceptance matrix fixes the browser Date on both hosts so those defaults stay deterministic.

## Content Guidelines

- Both 12-hour and 24-hour clocks can be used when the time needs to be displayed
- If the 12-hour clock is used, it needs to be used together with AM/PM. For details, please refer to [Time Specification](/en-us/experience/content-guidelines/)
- For the abbreviation rules for month, week and time, please refer to [Abbreviation Specification](/en-us/experience/content-guidelines/)

## Design Tokens

::token-table{component="calendar"}
::

## Accessibility

Month view exposes grid, row, columnheader, and gridcell semantics. Use clear event text and maintain readable contrast. Custom rendered events and cells need accessible interaction controls when clickable; arbitrary positioned nodes do not gain keyboard behavior automatically.

## FAQ

**Why is an event missing?** Check unique keys and valid start/end dates.

**Why is the final range day excluded?** The range end is exclusive.

**How do I customize a cell?** Use the dateGrid slot and position content relative to its cell.

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
