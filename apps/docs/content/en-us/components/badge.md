---
title: 'Badge'
description: 'Badge generates a small badge to give users tips.'
locale: 'en-US'
slug: 'badge'
category: 'show'
order: 63
englishTitle: 'Badge'
icon: 'doc-badge'
upstream: 'show/badge'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import '@aifuxi/semi-theme-default/badge.css';
</script>
```

### Basic Usage

The basic type of Badge is `count`. The `dot` property changes a badge into a small dot. The two are mutually exclusive, giving priority to rendering `dot`. When passed in a node type, the node will be rendered directly.

::demo-block{demo="badge/en-us/Basic" title="Basic Usage"}
::

### Maximum Value

You can use the `overflowCount` property to cap the number value of the badge content. When the actual value exceeds that value, it will be formatted into `${overflowCount}+`.

::demo-block{demo="badge/en-us/Overflow" title="Maximum Value"}
::

### Position

You can use the `position` property to set the position of the badge to its children. The prop uses one of: `leftTop`, `leftBottom`, `rightTop` (LTR default; RTL defaults to `leftTop`), `rightBottom`.

::demo-block{demo="badge/en-us/Position" title="Position"}
::

### Theming

You can use the `theme` and `type` prop to customize the styling. `theme` supports the following values: `solid`(default), `light`, `inverted`.

::demo-block{demo="badge/en-us/Theme" title="Theming"}
::

`type` support the following values: `primary`(default),`secondary`,`tertiary`,`warning`, `danger` and `success`.

::demo-block{demo="badge/en-us/Type" title="Theming"}
::

### Independent Usage

Badge can be used alone when it is a stand-alone element.

::demo-block{demo="badge/en-us/Standalone" title="Independent Usage"}
::

## API Reference

| Property            | Description                                                                        | Type                      | Default                       |
| ------------------- | ---------------------------------------------------------------------------------- | ------------------------- | ----------------------------- |
| `class / className` | Outer wrapper class                                                                | `HTMLAttributes["class"]` | `—`                           |
| `count`             | Content; use the count slot for complex nodes                                      | `VNodeChild`              | `—`                           |
| `countClassName`    | Badge content class                                                                | `HTMLAttributes["class"]` | `—`                           |
| `dot`               | Render a dot instead of count                                                      | `boolean`                 | `false`                       |
| `overflowCount`     | Numeric display cap; values above it render as N+; no default cap                  | `number`                  | `—`                           |
| `position`          | leftTop, leftBottom, rightTop, rightBottom                                         | `BadgePosition`           | `LTR: rightTop; RTL: leftTop` |
| `countStyle`        | Badge content style                                                                | `StyleValue`              | `—`                           |
| `style`             | Upstream compatibility: applies to badge content, takes precedence over countStyle | `StyleValue`              | `—`                           |
| `theme`             | solid, light, inverted                                                             | `BadgeTheme`              | `solid`                       |
| `type`              | primary, secondary, tertiary, danger, warning, success                             | `BadgeType`               | `primary`                     |

Slots: `default` supplies the base element; `count` supplies custom badge content. Events: `@click`, `@mouseenter`, `@mouseleave`, each receives the native `MouseEvent`.

## Content Guidelines

- Capitalize the first letter

## Design Tokens

::token-table{component="badge"}
::

## Accessibility

Do not rely on dot color alone to communicate status; include a visible text label. A badge is a span, not a keyboard control. Place an action on a button or link with an accessible name when it must be interactive.

## FAQ

**Why does count not appear?** `dot` takes precedence. A numeric overflow cap applies only to numeric count; a custom node uses custom badge styling.

**Why does style affect the badge rather than its base?** This preserves the upstream contract. Style the element in the default slot to change the base.

## React → Vue

| React                                   | Vue                                           |
| --------------------------------------- | --------------------------------------------- |
| `children`                              | default slot                                  |
| `count={<Node />}`                      | count slot or a VNodeChild prop               |
| `onClick / onMouseEnter / onMouseLeave` | @click / @mouseenter / @mouseleave            |
| `className / CSSProperties`             | class (className alias retained) / StyleValue |

Examples target the public Vue component subpaths. Each preview and source editor reads the same SFC. The reference is the local Semi Design v2.102.0 submodule (`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`).
