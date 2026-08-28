# Calendar React → Vue 迁移

| React v2.102.0                                | Vue                                                         |
| --------------------------------------------- | ----------------------------------------------------------- |
| `<Calendar mode="week" />`                    | `<Calendar mode="week" />`                                  |
| `events={[{ key, children: node }]}`          | `:events="[{ key, content: vnode }]"`                       |
| `header={<Header />}`                         | `<template #header><Header /></template>`                   |
| `dateGridRender={(dateString, date) => node}` | `<template #dateGrid="{ dateString, date }">...</template>` |
| `renderDateDisplay={date => node}`            | `<template #dateDisplay="{ date }">...</template>`          |
| `renderTimeDisplay={time => node}`            | `<template #timeDisplay="{ time }">...</template>`          |
| `allDayEventsRender={events => node}`         | `<template #allDayEvents="{ events }">...</template>`       |
| event `children` per item                     | `#event="{ event }"` or event `content`                     |
| `onClick={(e, date) => ...}`                  | `@click="(e, date) => ..."`                                 |
| `onMoreClick={(e, date, remaining) => ...}`   | `@more-click="(e, date, remaining) => ..."`                 |
| `onClose={e => ...}`                          | `@close="e => ..."`                                         |

`displayValue`、`range`、`mode`、`showCurrTime`、`markWeekend`、`weekStartsOn`、`scrollTop`、`minEventHeight`、`width` 和 `height` 保留同名语义。ReactNode/render props 改成 typed scoped slots，不追求 React children/ref 的字面兼容。
