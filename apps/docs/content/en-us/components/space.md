---
title: 'Space'
description: 'Set the spacing between components.'
locale: 'en-US'
slug: 'space'
category: 'basic'
order: 27
englishTitle: 'Space'
icon: 'doc-space'
upstream: 'basic/space'
---

The chapters and examples follow the read-only Semi Design v2.102.0 documentation. Version numbers in API tables refer to upstream releases; the preview and source share the same Vue SFC.

## Demos

### How to import

```ts
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
```

### Basic Usage

::demo-block{demo="space/en-us/Basic" title="Basic Usage"}
::

### Alignment

You can use `align` to set the alignment, optional: `start`, `center`（default）, `end`, `baseline`.

::demo-block{demo="space/en-us/Alignment" title="Alignment"}
::

### Spacing

You can use `spacing` to set the spacing size, optional: `tight` (8px, default), `medium` (16px), `loose` (24px), and allow to pass in number to customize the spacing size, and also support to pass in array to set the horizontal and vertical spacing at the same time.

::demo-block{demo="space/en-us/Spacing" title="Spacing"}
::

### Direction

You can use `vertical` to set whether the spacing is vertical, the default is false.

::demo-block{demo="space/en-us/Vertical" title="Direction"}
::

### Wrap

When the spacing is horizontal，you can use `wrap` to set whether to wrap automatically, the default is false.

::demo-block{demo="space/en-us/Wrap" title="Wrap"}
::

## API Reference

| Properties | Instructions                                                            | Type                  | Default  | Version  |
| ---------- | ----------------------------------------------------------------------- | --------------------- | -------- | -------- |
| align      | Alignment, optional: `start`、`end`、`center`、`baseline`               | string                | `center` | >=1.17.0 |
| class      | Class name                                                              | string                | -        | >=1.17.0 |
| spacing    | The space size, optional: `loose`、`medium`、`tight` 、number and array | string\|number\|array | `tight`  | >=1.17.0 |
| style      | Inline style                                                            | CSSProperties         | -        | >=1.17.0 |
| vertical   | Set to vertical spacing                                                 | boolean               | false    | >=1.17.0 |
| wrap       | Whether to wrap                                                         | boolean               | false    | >=1.17.0 |

## Design Tokens

::token-table{component="space"}
::

## Accessibility

Use native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes. Keep the reading order meaningful and give interactive children accessible names and keyboard support.

## React → Vue Migration

| React                 | Vue                                                  |
| --------------------- | ---------------------------------------------------- |
| `children` / Fragment | Default slot; fragments flatten into direct children |
| `className` / `style` | Native `class` / `style`                             |
| `spacing={[8,16]}`    | `:spacing="[8,16]"`                                  |
| Array.map             | `v-for` with stable keys                             |

The first array item controls horizontal spacing and the second vertical spacing. `vertical` disables `wrap`. Numeric spacing overrides the corresponding `column-gap` / `row-gap` in inline styles. The default is `tight`; the upstream English API table incorrectly states `medium`, corrected here using the Adapter and Vue source.
