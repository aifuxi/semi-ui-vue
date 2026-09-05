---
title: 'Divider'
description: 'Divider is a linear, lightweight component used to logically organize element content and page structure or areas.'
locale: 'en-US'
slug: 'divider'
category: 'basic'
order: 25
englishTitle: 'Divider'
upstream: 'basic/divider'
---

The chapters and examples follow the read-only Semi Design v2.102.0 documentation. Version numbers in API tables refer to upstream releases; the preview and source share the same Vue SFC.

## Demos

### How to import

```ts
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import '@aifuxi/semi-theme-default/divider.css';
```

### Basic Usage

::demo-block{demo="divider/en-us/Basic" title="Basic Usage"}
::

### With default-slot nodes

::demo-block{demo="divider/en-us/WithContent" title="With default-slot nodes"}
::

## API Reference

| Properties   | Instructions                                                  | Type                    | Default    | Version |
| ------------ | ------------------------------------------------------------- | ----------------------- | ---------- | ------- |
| align        | Content Align Mode                                            | left \| center \| right | center     | 2.9.0   |
| default slot | Content                                                       | VNodeChild              | -          | 2.9.0   |
| class        | ClassName                                                     | string                  | -          | 2.9.0   |
| dashed       | Whether is dashed                                             | boolean                 | false      | 2.9.0   |
| layout       | Divider Direction                                             | horizontal \| vertical  | horizontal | 2.9.0   |
| margin       | Vertical (Horizontal if in horizontal mode) margin of divider | number \| string        | -          | 2.9.0   |
| style        | Custom Style                                                  | CSSProperties           | -          | 2.9.0   |

## Design Tokens

::token-table{component="divider"}
::

## Accessibility

Use native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes. Keep the reading order meaningful and give interactive children accessible names and keyboard support.

## React → Vue Migration

| React                 | Vue                                                   |
| --------------------- | ----------------------------------------------------- |
| `children`            | `default` slot, rendered only for horizontal dividers |
| `className` / `style` | Native `class` / `style`                              |
| React ref             | Vue template ref                                      |

Vertical dividers do not render their default slot. Inline `style` overrides the corresponding margins produced by `margin`. Add `role="separator"` when the divider has semantic meaning, and `aria-orientation="vertical"` for a vertical separator.
