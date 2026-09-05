---
title: 'Empty'
description: 'Placeholder component when the page is empty.'
locale: 'en-US'
slug: 'empty'
category: 'show'
order: 71
englishTitle: 'Empty'
icon: 'doc-empty'
upstream: 'show/empty'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
</script>
```

### Basic usage

By setting a placeholder image with `image`, you can manually import the corresponding illustration from `@aifuxi/semi-illustrations-vue` (the default width and height of the illustration is 200x200), or you can import a custom illustration.

A series of dark mode illustrations are added, and the illustrations that need to be used in dark mode can be passed in through `darkModeImage` to better adapt to the dark mode.

::demo-block{demo="empty/en-us/Basic" title="Basic usage"}
::

### Custom content

Custom footer content can be provided through the default slot.

::demo-block{demo="empty/en-us/Custom" title="Custom content"}
::

It is not necessary to use pictures.

::demo-block{demo="empty/en-us/WithoutImage" title="Custom content"}
::

### Different layout

Two types of layouts are supported: `vertical`, `horizontal`. The default is `vertical`.

::demo-block{demo="empty/en-us/Layout" title="Different layout"}
::

### Placeholder illustration (under construction)

Currently the following illustrations are supported in `@aifuxi/semi-illustrations-vue`.

::demo-block{demo="empty/en-us/Illustrations" title="Placeholder illustration (under construction)"}
::

## API Reference

| Property            | Description                                              | Type                      | Default    |
| ------------------- | -------------------------------------------------------- | ------------------------- | ---------- |
| `class / className` | Style class; className is a compatibility alias          | `HTMLAttributes["class"]` | `—`        |
| `style`             | Inline style                                             | `StyleValue`              | `—`        |
| `darkModeImage`     | Dark illustration; follows the body theme-mode attribute | `EmptyImage`              | `—`        |
| `description`       | Description                                              | `VNodeChild`              | `—`        |
| `image`             | Illustration node, image URL or SVG symbol configuration | `EmptyImage`              | `—`        |
| `imageStyle`        | Image-region style                                       | `StyleValue`              | `—`        |
| `layout`            | vertical, horizontal                                     | `EmptyLayout`             | `vertical` |
| `title`             | Title                                                    | `VNodeChild`              | `—`        |

### EmptySvgNode

| Property        | Description                                                               | Type     | Default |
| --------------- | ------------------------------------------------------------------------- | -------- | ------- |
| `id`            | SVG symbol ID in the current document, referenced by use                  | `string` | `—`     |
| `viewBox / url` | Retained fields in the public shape; the symbol branch references id only | `string` | `—`     |

Slots: `image`, `darkModeImage`, `title`, `description`, and `default` (footer actions). Named slots take precedence over their matching props. Use paired light/dark illustrations; changing the document theme selects the appropriate one.

## Accessibility

### ARIA

- aria-hidden for Empty illustrations is true

## Content Guidelines

- Title
  - The title should be concise and easy to understand
- Text
  - The specific reasons for displaying the empty state can be displayed, and the subsequent operation behavior can also be displayed to help the user eliminate the empty state
  - Don't repeat the content on the title
  - Try to keep the body text within 1-2 sentences
- Action button
  - Button copy needs to be clear and easy to understand
  - Use the verb + noun format

## Design Token

::token-table{component="empty"}
::

## FAQ

**Why does the illustration not change in dark mode?** Supply darkModeImage or its slot, and use the document body theme-mode attribute.

**Where do action buttons go?** Place them in the default slot, rendered in the footer.

**Can an empty state omit an illustration?** Yes. Use title and description to explain the state and a clear action when useful.

## React → Vue

| React                             | Vue                                           |
| --------------------------------- | --------------------------------------------- |
| `children`                        | default slot in the footer action region      |
| `image / darkModeImage ReactNode` | Matching slots or EmptyImage                  |
| `title / description ReactNode`   | Matching slots or VNodeChild                  |
| `@douyinfe/semi-illustrations`    | @aifuxi/semi-illustrations-vue                |
| `className / CSSProperties`       | class (className alias retained) / StyleValue |
