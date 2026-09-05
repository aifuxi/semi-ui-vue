---
title: 'OverflowList'
description: 'OverflowList is a behavior component used to take list of items and display as many items as can fit inside itself. Overflowed items that do not fit are collected and rendered by callback function. The visible items will be recomputed when a resize is detected.'
locale: 'en-US'
slug: 'overflow-list'
category: 'show'
order: 77
englishTitle: 'OverflowList'
icon: 'doc-overflowList'
upstream: 'show/overflowlist'
---

OverflowList is a layout behavior component. It keeps as many items as the measured width allows and delegates the remaining items to the scoped `overflow` slot.

## Import

```ts
import { OverflowList } from '@aifuxi/semi-ui-vue/overflow-list';
import '@aifuxi/semi-theme-default/overflow-list.css';
```

## Collapse mode

```vue
<OverflowList :items="items">
  <template #visibleItem="{ item }">
    <span class="token">{{ item.label }}</span>
  </template>
  <template #overflow="{ items: hidden }">
    <button v-if="hidden.length">+{{ hidden.length }}</button>
  </template>
</OverflowList>
```

Set `collapseFrom="start"` to collect items from the beginning. `minVisibleItems` keeps a minimum number of items even when space is insufficient.

## Scroll mode

```vue
<OverflowList :items="items" render-mode="scroll">
  <template #visibleItem="{ item }"><span>{{ item.label }}</span></template>
  <template #overflow="{ items: hidden, position }">
    <button v-if="hidden.length">{{ position }}: {{ hidden.length }}</button>
  </template>
</OverflowList>
```

Scroll mode requires stable item keys. Use `itemKey` for a different key field or getter. The observed element receives `data-scrollkey`.

## API

| Property                            | Type                                | Default      | Description                   |
| ----------------------------------- | ----------------------------------- | ------------ | ----------------------------- |
| `items`                             | `OverflowItem[]`                    | `[]`         | Item data                     |
| `collapseFrom`                      | `'start' \| 'end'`                  | `'end'`      | Collapse boundary             |
| `minVisibleItems`                   | `number`                            | `0`          | Minimum visible count         |
| `renderMode`                        | `'collapse' \| 'scroll'`            | `'collapse'` | Render mode                   |
| `threshold`                         | `number`                            | `0.75`       | Scroll intersection threshold |
| `itemKey`                           | `string \| number \| (item) => key` | `'key'`      | Stable key strategy           |
| `wrapperClassName` / `wrapperStyle` | `string` / `StyleValue`             | -            | Scroll wrapper attributes     |
| `overflowRenderDirection`           | `'both' \| 'start' \| 'end'`        | `'both'`     | Scroll control placement      |

## Slots and events

- `#visibleItem="{ item, index }"` renders an item.
- `#overflow="{ items, position }"` renders collected items; scroll mode supplies start and end arrays separately.
- `@overflow(items)` fires when the collapse pivot changes.
- `@visibleStateChange(map)` then `@intersect(entries)` fire for a scroll intersection batch.

## React → Vue

| React v2.102.0                               | Vue                               |
| -------------------------------------------- | --------------------------------- |
| `visibleItemRenderer={(item, index) => ...}` | `#visibleItem="{ item, index }"`  |
| `overflowRenderer={items => ...}`            | `#overflow="{ items, position }"` |
| `onOverflow={handler}`                       | `@overflow="handler"`             |
| `onIntersect={handler}`                      | `@intersect="handler"`            |
| `onVisibleStateChange={handler}`             | `@visibleStateChange="handler"`   |
| `className`                                  | `class`（也兼容 `className`）     |

其余枚举值和自然可保留的 prop 名保持一致。scroll 模式下，React 要求 renderer 返回可 clone 的单个 ReactElement；Vue 单根元素会直接获得 `data-scrollkey`，多根 slot 会由内部 `.semi-overflow-list-scroll-item` 包装，这是唯一已接受的框架结构差异。
