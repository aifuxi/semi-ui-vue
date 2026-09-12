---
title: 'ScrollList'
description: 'Scroll through the list.'
locale: 'en-US'
slug: 'scroll-list'
category: 'show'
order: 79
englishTitle: 'ScrollList'
icon: 'doc-scrolllist'
upstream: 'show/scrolllist'
---

ScrollList renders one or more selectable columns in a constrained height. This implementation is aligned exclusively with the pinned local Semi Design v2.102.0 source, including normal and wheel modes, cyclic rendering, disabled items, transforms, themes, and RTL.

## Demos

### How to import

```ts
import { ScrollList, ScrollItem } from '@aifuxi/semi-ui-vue/scroll-list';
import '@aifuxi/semi-theme-default/scroll-list.css';
```

### Basic usage

The list supports iOS-like wheel selection and clicking an option. The AM/PM column does not cycle; the hour and minute columns do. All three selected indices start at 1: PM, hour 2, and minute 1.

::demo-block{demo="scroll-list/en-US/Example1" title="Basic usage"}
::

`selectedIndex` is controlled state. The component reports a choice through `select`, and the consumer updates the index. Normal mode selects on click; wheel mode settles on the nearest enabled item. `cycled` only affects wheel mode.

The upstream minute list uses `Math.random()` to disable items. This demo disables even minutes instead, retaining mixed enabled/disabled options while keeping data stable across the page, resets, and editor runs. The strict reference adapter uses the same sequence. This is a deterministic demo-data adaptation; formal status is determined by the batch evidence.

Hour and minute selections are logged to the browser console. As upstream, the footer's `Ok` button only logs `close`; it does not close the list. React `header` and `footer` content becomes the `#header` and `#footer` slots, `onSelect` becomes `@select`, and each controlled index is stored in a `shallowRef`.

## API reference

### ScrollList

| Property                        | Type                 | Default           | Description                    |
| ------------------------------- | -------------------- | ----------------- | ------------------------------ |
| `bodyHeight`                    | `number \| string`   | `300` (theme CSS) | Body height; numbers use px    |
| `header` / `#header`            | `VNodeChild`         | -                 | Header content; slot wins      |
| `footer` / `#footer`            | `VNodeChild`         | -                 | Footer content; slot wins      |
| `prefixCls`                     | `string`             | `semi-scrolllist` | Class prefix                   |
| `class` / `className` / `style` | Vue class/style type | -                 | Root styling                   |
| default slot                    | `VNodeChild`         | -                 | One or more ScrollItem columns |

### ScrollItem

| Property                        | Type                                        | Default   | Description                                     |
| ------------------------------- | ------------------------------------------- | --------- | ----------------------------------------------- |
| `list`                          | `ScrollItemData[]`                          | `[]`      | Option data                                     |
| `mode`                          | `'normal' \| 'wheel'`                       | `'wheel'` | Rendering mode                                  |
| `cycled`                        | `boolean`                                   | `false`   | Cyclic wheel rendering                          |
| `selectedIndex`                 | `number`                                    | `0`       | Controlled selected index                       |
| `motion`                        | `boolean \| ScrollMotionObject \| function` | `true`    | Enables the pinned scrolling animation          |
| `transform`                     | `(value, text) => unknown`                  | -         | Transforms only selected items; item value wins |
| `type`                          | `string \| number`                          | -         | Column identifier added to the select payload   |
| `ariaLabel`                     | `string`                                    | -         | Written as `aria-label` in templates            |
| `class` / `className` / `style` | Vue class/style type                        | -         | Column root styling                             |

The `select` payload is a shallow copy of the source item plus `index` and `type`. Disabled items never select.

#### ItemData

| Property    | Type                       | Description                                                 |
| ----------- | -------------------------- | ----------------------------------------------------------- |
| `value`     | `unknown`                  | Option value and fallback display content                   |
| `text`      | `string`                   | Optional display text, taking priority over value           |
| `disabled`  | `boolean`                  | Prevents selection                                          |
| `transform` | `(value, text) => unknown` | Transforms selected content; overrides the column transform |

## Accessibility

### ARIA

Each column uses `role="listbox"`; options use `role="option"` and `aria-disabled`. The pinned v2.102.0 Adapter implements neither arrow-key roving focus nor `aria-selected`, so the Vue port does not invent those behaviors. Light/dark colors come from `--semi-color-*`; RTL flips separators and wheel padding. Public imports and server rendering are DOM-safe; measurement and scrolling begin only after client mount and are cleaned up on unmount.

## Design tokens

ScrollList uses the pinned theme's `--semi-color-*` variables for text, disabled items, separators, and shades, with sizes and spacing supplied by component SCSS. The theme entry and standalone `scroll-list.css` retain the `.semi-scrolllist-*` contract.

## React → Vue

`children` becomes the default slot, and `header`/`footer` become named slots. `onSelect` becomes `@select`, retaining `index`, `type`, and source option fields; consumers update `selectedIndex`. Column labels use the `aria-label` supported by the pinned upstream ARIA section.

See the [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/scroll-list/alignment.md) for source evidence, event ordering, visual coverage, and deviations, and [React → Vue](#react-vue) for framework migration.
