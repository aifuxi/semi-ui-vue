---
title: 'Description'
description: 'Descriptions presents object details as stable key/value structures. The pinned local Semi Design v2.102.0 source is the sole parity baseline.'
locale: 'en-US'
slug: 'descriptions'
category: 'show'
order: 69
englishTitle: 'Description'
icon: 'doc-descriptions'
upstream: 'show/descriptions'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
</script>
```

### Basic Usage

Data can be passed in as an array of objects `{ key, value }` through `props.data`
Both key and value support the `VNodeChild` type. You can pass in a string or a higher degree of freedom VNodeChild to freely customize the render dom.

::demo-block{demo="descriptions/en-us/Basic" title="Basic Usage"}
::

### Alignment

You can use `align` to set alignment of key-value. Supporting values including: `center`(default), `justify`, `left`, and `plain`.
When `row` is true, this configuration is invalid

::demo-block{demo="descriptions/en-us/Alignment" title="Alignment"}
::

### Row Display

Set `row` to display the data to two-row, supporting three sizes: `small`, `medium`(default), and `large`.

::demo-block{demo="descriptions/en-us/DoubleRow" title="Row Display"}
::

### Descriptions Using Templates (JSX Migration)

::demo-block{demo="descriptions/en-us/Items" title="Descriptions using templates"}
::

### Set layout mode

The layout mode can be set through `layout`, which supports `horizontal` and `vertical` (introduced upstream in v2.54.0) . Default is `vertical`.  
When horizontal is set, column can be used to specify the maximum number of columns per row.

::demo-block{demo="descriptions/en-us/Horizontal" title="Set layout mode"}
::

The pinned English page only ships the horizontal layout snippet, and the Chinese reference also demonstrates vertical layout explicitly. The following example renders the same data with `layout="vertical"`; `column` only controls horizontal grouping.

::demo-block{demo="descriptions/en-us/Vertical" title="Vertical layout"}
::

### Custom Key Style

You can customize the style of key through `keyStyle` property, such as setting a fixed width to achieve alignment. This property supports all CSS styles, such as `width`, `maxWidth`, `textAlign`, `color`, etc.

::demo-block{demo="descriptions/en-us/KeyStyle" title="Custom Key Style"}
::

You can also use it with Vue templates:

::demo-block{demo="descriptions/en-us/ItemKeyStyle" title="Custom Key Style"}
::

## API Reference

### Descriptions

| Property            | Description                                                                | Type                              | Default    |
| ------------------- | -------------------------------------------------------------------------- | --------------------------------- | ---------- |
| `align`             | center, justify, left, plain; not applicable when row is true              | `DescriptionsAlign`               | `center`   |
| `class / className` | Wrapper class                                                              | `HTMLAttributes["class"]`         | `—`        |
| `data`              | Description items; a nonempty array takes precedence over the default slot | `readonly DescriptionsDataItem[]` | `[]`       |
| `row`               | Two-row display: key above value                                           | `boolean`                         | `false`    |
| `size`              | Two-row size: small, medium, large                                         | `DescriptionsSize`                | `medium`   |
| `style`             | Wrapper style                                                              | `StyleValue`                      | `—`        |
| `layout`            | vertical, horizontal                                                       | `DescriptionsLayout`              | `vertical` |
| `column`            | Number of columns per row in horizontal layout                             | `number`                          | `3`        |

### DataItem (`DescriptionsDataItem`)

| Property            | Description                                    | Type                              | Default |
| ------------------- | ---------------------------------------------- | --------------------------------- | ------- |
| `key`               | Label node                                     | `VNodeChild`                      | `—`     |
| `value`             | Value node or a function returning one         | `VNodeChild / (() => VNodeChild)` | `—`     |
| `hidden`            | true hides the item and removes it from layout | `boolean`                         | `—`     |
| `span`              | Column span                                    | `number`                          | `1`     |
| `keyStyle`          | Label style                                    | `StyleValue`                      | `—`     |
| `class / className` | Row class in vertical layout                   | `HTMLAttributes["class"]`         | `—`     |
| `style`             | Row style in vertical layout                   | `StyleValue`                      | `—`     |

### DescriptionsItem

| Property            | Description                            | Type                      | Default |
| ------------------- | -------------------------------------- | ------------------------- | ------- |
| `itemKey`           | Label node; also supports the key slot | `VNodeChild`              | `—`     |
| `hidden`            | true hides the item                    | `boolean`                 | `—`     |
| `class / className` | Class of the tr in vertical layout     | `HTMLAttributes["class"]` | `—`     |
| `style`             | Style of the tr in vertical layout     | `StyleValue`              | `—`     |
| `span`              | Column span                            | `number`                  | `1`     |
| `keyStyle`          | Label style                            | `StyleValue`              | `—`     |

`DescriptionsItem` must be a direct child of `Descriptions`. Its default slot is the value and `#key` is the label. Horizontal layout packs visible items by `span`; an unspecified final span fills the remaining columns.

## Content Guidelines

- Field names and values ​​are written in upper and lower case according to the Sentence case principle

## Design Tokens

::token-table{component="descriptions"}
::

## Accessibility

Use clear labels and keep key/value order meaningful. The component renders table rows and cells; interactive values should use native links or buttons and retain their keyboard focus behavior.

## FAQ

**Why does align stop working with row?** Two-row display uses its own stacked layout.

**Why is column ineffective?** Column grouping applies only to `layout="horizontal"`; `span` controls the number of occupied columns.

**Why are items missing?** Check `hidden` and whether a nonempty `data` array takes precedence over the default slot.

## React → Vue

| React                                 | Vue                                                        |
| ------------------------------------- | ---------------------------------------------------------- |
| `Descriptions.Item children`          | DescriptionsItem default slot                              |
| `itemKey={<Node />}`                  | key slot or :item-key                                      |
| `ReactNode / render function in data` | VNodeChild / a function returning VNodeChild using Vue h() |
| `Numeric JSX inline style values`     | Use CSS lengths with units, such as 100px                  |
| `className / CSSProperties`           | class (className alias retained) / StyleValue              |

Examples target the public Vue component subpaths. Each preview and source editor reads the same SFC. The reference is the local Semi Design v2.102.0 submodule (`cdfba6e520fc83ad871b30f51f36d8af3aaa5a21`).
