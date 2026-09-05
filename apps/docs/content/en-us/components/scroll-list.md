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

## Basic usage

::demo-block{demo="scroll-list/en-US/Example1" title="Basic usage"}
::

`selectedIndex` is controlled state. The component reports a choice through `select`, and the consumer updates the index. Normal mode selects on click; wheel mode settles on the nearest enabled item. `cycled` only affects wheel mode.

## ScrollList API

| Property                        | Type                 | Default           | Description                    |
| ------------------------------- | -------------------- | ----------------- | ------------------------------ |
| `bodyHeight`                    | `number \| string`   | `300` (theme CSS) | Body height; numbers use px    |
| `header` / `#header`            | `VNodeChild`         | -                 | Header content; slot wins      |
| `footer` / `#footer`            | `VNodeChild`         | -                 | Footer content; slot wins      |
| `prefixCls`                     | `string`             | `semi-scrolllist` | Class prefix                   |
| `class` / `className` / `style` | Vue class/style type | -                 | Root styling                   |
| default slot                    | `VNodeChild`         | -                 | One or more ScrollItem columns |

## ScrollItem API

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

## Accessibility, themes, and SSR

Each column uses `role="listbox"`; options use `role="option"` and `aria-disabled`. The pinned v2.102.0 Adapter implements neither arrow-key roving focus nor `aria-selected`, so the Vue port does not invent those behaviors. Light/dark colors come from `--semi-color-*`; RTL flips separators and wheel padding. Public imports and server rendering are DOM-safe; measurement and scrolling begin only after client mount and are cleaned up on unmount.

See the [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/scroll-list/alignment.md) for source evidence, event ordering, visual coverage, and deviations, and [React → Vue](#react-vue) for framework migration.
