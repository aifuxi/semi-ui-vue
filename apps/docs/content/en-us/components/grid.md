---
title: 'Grid'
description: '24 grid system.'
locale: 'en-US'
slug: 'grid'
category: 'basic'
order: 20
englishTitle: 'Grid'
icon: 'doc-grid'
upstream: 'basic/grid'
---

The chapters and examples follow the read-only Semi Design v2.102.0 documentation. Version numbers in API tables refer to upstream releases; the preview and source share the same Vue SFC.

## Overview

The grid system of layout, we define the external framework of information blocks based on row and column (col) to ensure that each area of the page can be robustly arranged.

## Flex layout

Our grid system supports the Flex layout, allowing the horizontal alignment of child elements within the parent node - left, center, right, equal width, scattered arrangement. Between child elements and child elements, support top alignment, vertical center alignment, bottom alignment. At the same time, support the use of `order` To define the order of the elements.

## Demos

### How to import

```ts
import { Col, Row } from '@aifuxi/semi-ui-vue/grid';
import '@aifuxi/semi-theme-default/grid.css';
```

### Basic Usage

From stacking to horizontal arrangement.

Using a single set of Row and Col grid components, you can create a basic grid system. All Col must be placed in the Row.

::demo-block{demo="grid/en-us/Basic" title="Basic Usage"}
::

### Gutter interval

The grid often needs to work with the interval. You can use Row's `Gutter` Properties, we recommend using (16 + 8n) px as a grid interval. (n is a natural number)

Vertical gutter can be in the form of an array. The first item of the array is horizontal gutter and the second item is vertical gutter.<br/>

If you want to support responsiveness, you can write {xs: 8, sm: 16, md: 24, lg: 32}.<br/>

**Vertical gutter in array form supported from version `1.11.0`**<br/>

Dark for content area, light for spacing

::demo-block{demo="grid/en-us/Gutter" title="Gutter interval"}
::

### Offset

::demo-block{demo="grid/en-us/Offset" title="Offset"}
::

### Use Flex layout

Use `row-flex` to define a Flex layout whose child elements are based on different values `start`,`center`,`end`,`space-between`,`space-around`, define their typesetting methods in the parent node respectively.

::demo-block{demo="grid/en-us/Flex" title="Use Flex layout"}
::

### Flex subelements vertically aligned

::demo-block{demo="grid/en-us/VerticalAlign" title="Flex subelements vertically aligned"}
::

### Flex element sorting

Change the sorting of elements through `order` of the Col.

::demo-block{demo="grid/en-us/Order" title="Flex element sorting"}
::

### Responsive

Referring to Bootstrap's responsive design, preset six response sizes:`xs`, `sm`, `md`, `lg`, `Xl`, `xxl`.

::demo-block{demo="grid/en-us/Responsive" title="Responsive"}
::

## API reference

### Row

| Properties | Instructions                                                                                                                                                  | type                    | Default |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------- |
| align      | Vertical alignment under flex layout: `top` `middle` `bottom`                                                                                                 | string                  |         |
| class      | Class name                                                                                                                                                    | string                  |         |
| gutter     | Grid interval, can be written as pixel value or support responsive object writing `{ xs: 8, sm: 16, md: 24}`, Vertical gutter support from version **1.11.0** | number / object / array |         |
| justify    | Horizontal arrangement under flex layout: `start` `end` `center` `space-around` `space-between`                                                               | string                  | `start` |
| style      | style                                                                                                                                                         | CSSProperties           |         |
| type       | Layout mode, optional `flex`, valid under [Modern Browser](http://caniuse.com/#search=flex)                                                                   | string                  |         |

### Col

| Properties | Instructions                                                                                        | type           | Default |
| ---------- | --------------------------------------------------------------------------------------------------- | -------------- | ------- |
| lg         | `≥ 992px` responsive grid, which can be a number of grids or an object containing other properties  | number\|object | -       |
| md         | `≥ 768px` responsive grid, which can be a number of grids or an object containing other properties  | number\|object | -       |
| offset     | The number of interval cells on the left side of a grid. There can be no grid in the interval.      | number         | 0       |
| order      | Grid order, effective in `flex` layout mode                                                         | number         | 0       |
| pull       | The grid moves to the left.                                                                         | number         | 0       |
| push       | The grid moves to the right.                                                                        | number         | 0       |
| sm         | `≥ 576px` responsive grid, which can be a number of grids or an object containing other properties  | number\|object | -       |
| span       | The number of grid spaces is equivalent to `display: none` when it is 0                             | number         | -       |
| xl         | `≥ 1200px` responsive grid, which can be a number of grids or an object containing other properties | number\|object | -       |
| xs         | `< 576px` responsive grid, which can be a number of grids or an object containing other attributes  | number\|object | -       |
| xxl        | `≥ 1600px` responsive grid, which can be a number of grids or an object containing other properties | number\|object | -       |

## Design Tokens

::token-table{component="grid"}
::

## Accessibility

Use native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes. Keep the reading order meaningful and give interactive children accessible names and keyboard support.

## React → Vue Migration

| React              | Vue                 |
| ------------------ | ------------------- |
| `children`         | `default` slot      |
| `className`        | Native `class`      |
| `gutter={[16,24]}` | `:gutter="[16,24]"` |
| `xs={{ span:8 }}`  | `:xs="{ span:8 }"`  |

Row / Col also expose `prefixCls: string`, defaulting to `semi`. Col must be inside Row. Each breakpoint accepts a `ColSize` object with `span`, `order`, `offset`, `push`, and `pull`. The `justify`, `offset`, `order`, `push`, and `pull` props default to unset; their effective layout is start alignment or zero offset. The source breakpoint for `sm` is 576px (correcting the upstream table). Visual ordering does not change DOM or screen reader order.
