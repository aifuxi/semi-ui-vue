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

## Demos

### Collapse Mode - Simple

`renderMode="collapse"` is the default. Move the slider to change the container width. Items that no longer fit are collected from the end into a `+N` tag and return when the container expands. The six icon tags follow the fixed upstream examples.

::demo-block{demo="overflow-list/en-US/Collapse" title="Collapse Mode - Simple"}
::

### Collapse Mode - Direction

`collapseFrom="start"` collects items from the beginning, retains the trailing items, and places the `+N` tag before the list. Move the slider to compare this with the default direction.

::demo-block{demo="overflow-list/en-US/CollapseFromStart" title="Collapse Mode - Direction"}
::

### Collapse Mode - Visible

`:min-visible-items="3"` keeps at least three items visible, even if the container is too narrow to fit them. Reduce the width to observe the minimum visible items and the overflow count.

::demo-block{demo="overflow-list/en-US/MinVisibleItems" title="Collapse Mode - Visible"}
::

### Scroll Mode

Use `renderMode="scroll"` to keep all items in a horizontally scrollable list. Reduce the width, then scroll horizontally to see the two tags report the overflow count on each side. As in the fixed upstream example, an empty side still displays `+0`.

::demo-block{demo="overflow-list/en-US/Scroll" title="Scroll Mode"}
::

Scroll mode requires stable item keys. Use `itemKey` for a different key field or getter. The observed element receives `data-scrollkey`. To reveal an item, select `.item-cls[data-scrollkey="folder"]` within the current demo container and call `scrollIntoView({ block: 'nearest', inline: 'nearest' })`.

Each example is an independent SFC that can be edited and run in the demo editor. All four examples have bilingual mappings; strict visual and behavioral acceptance is tracked separately.

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

| React v2.102.0                                    | Vue                                                    |
| ------------------------------------------------- | ------------------------------------------------------ |
| `visibleItemRenderer={(item, index) => ...}`      | `#visibleItem="{ item, index }"`                       |
| `overflowRenderer={items => ...}`                 | `#overflow="{ items, position }"`                      |
| `onOverflow={handler}`                            | `@overflow="handler"`                                  |
| `onIntersect={handler}`                           | `@intersect="handler"`                                 |
| `onVisibleStateChange={handler}`                  | `@visibleStateChange="handler"`                        |
| Scroll renderer receives `[startItems, endItems]` | `#overflow` receives one side's `items` per `position` |
| `className`                                       | `class` (`className` is also supported)                |

Other enum values and naturally transferable prop names remain unchanged. In scroll mode, React requires each item renderer to return one cloneable ReactElement. Vue adds `data-scrollkey` directly to a single element root; a multi-root slot receives an internal `.semi-overflow-list-scroll-item` wrapper. This is the structural framework deviation already documented for the component, not a strict acceptance result for these documentation examples.
