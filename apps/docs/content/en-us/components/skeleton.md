---
title: 'Skeleton'
description: 'A placeholder preview of content before the data loaded.'
locale: 'en-US'
slug: 'skeleton'
category: 'feedback'
order: 92
englishTitle: 'Skeleton'
icon: 'doc-skeleton'
upstream: 'feedback/skeleton'
---

## Overview

- `SkeletonAvatar`: Avatar placeholder, by default uses Avatar medium sizing: `width: 48px`, `height: 48px`. Supports Avatar's size and shape attributes (after v2.20)
- `SkeletonImage`: Image placeholder, default size: `width: 100%`, `height: 100%`.
- `SkeletonTitle`: Title placeholder, default size: `width: 100%`, `height: 24px`.
- `SkeletonParagraph`: Content part placeholder, default size: `width: 100%`, `height: 16px`, `margin-bottom: 10px`.
- `SkeletonButton`: Button placeholder, default size: `width: 115px`, `height: 32px`.

> Note: Default styles could by overwritten through `className` or `style`.

## Demos

### How to import

```ts
import { Skeleton } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
```

### Basic Usage

::demo-block{demo="skeleton/en-us/Basic" title="Basic Usage"}
::

### Combinations

Image and caption.

::demo-block{demo="skeleton/en-us/ImageTitle" title="Combinations"}
::

Statistics.

::demo-block{demo="skeleton/en-us/Statistics" title="Combinations"}
::

Avatar and title.

::demo-block{demo="skeleton/en-us/AvatarTitle" title="Combinations"}
::

Centered paragraphs and button.

::demo-block{demo="skeleton/en-us/ParagraphButton" title="Combinations"}
::

Avatar, headline and paragraph.

::demo-block{demo="skeleton/en-us/AvatarParagraph" title="Combinations"}
::

Table.

::demo-block{demo="skeleton/en-us/Table" title="Combinations"}
::

### Animated Loading

Use `active` property to display animated loading effects.

::demo-block{demo="skeleton/en-us/Animation" title="Animated Loading"}
::

## API Reference

### Skeleton

| Property            | Description                                                | Type                      | Default |
| ------------------- | ---------------------------------------------------------- | ------------------------- | ------- |
| `active`            | Show loading animation                                     | `boolean`                 | `false` |
| `class / className` | Style class; className is a compatibility alias            | `HTMLAttributes["class"]` | `—`     |
| `style`             | Inline style                                               | `StyleValue`              | `—`     |
| `loading`           | true displays placeholder; false displays the default slot | `boolean`                 | `true`  |
| `placeholder`       | Placeholder node; the placeholder slot takes precedence    | `VNodeChild`              | `—`     |

### SkeletonAvatar

| Property            | Description                                                                | Type                      | Default         |
| ------------------- | -------------------------------------------------------------------------- | ------------------------- | --------------- |
| `class / className` | Style class; className is a compatibility alias                            | `HTMLAttributes["class"]` | `—`             |
| `style`             | Inline style                                                               | `StyleValue`              | `—`             |
| `prefixCls`         | Skeleton class prefix                                                      | `string`                  | `semi-skeleton` |
| `size`              | extra-extra-small, extra-small, small, default, medium, large, extra-large | `SkeletonAvatarSize`      | `medium`        |
| `shape`             | circle, square                                                             | `SkeletonAvatarShape`     | `circle`        |

### SkeletonParagraph

| Property            | Description                                     | Type                      | Default         |
| ------------------- | ----------------------------------------------- | ------------------------- | --------------- |
| `class / className` | Style class; className is a compatibility alias | `HTMLAttributes["class"]` | `—`             |
| `style`             | Inline style                                    | `StyleValue`              | `—`             |
| `prefixCls`         | Skeleton class prefix                           | `string`                  | `semi-skeleton` |
| `rows`              | Number of placeholder lines                     | `number`                  | `4`             |

### SkeletonImage / SkeletonTitle / SkeletonButton

| Property            | Description                                     | Type                      | Default         |
| ------------------- | ----------------------------------------------- | ------------------------- | --------------- |
| `class / className` | Style class; className is a compatibility alias | `HTMLAttributes["class"]` | `—`             |
| `style`             | Inline style                                    | `StyleValue`              | `—`             |
| `prefixCls`         | Skeleton class prefix                           | `string`                  | `semi-skeleton` |

Use the `#placeholder` slot for loading content and the default slot for resolved content. The individual pieces also remain available as `Skeleton.Avatar`, `Skeleton.Image`, `Skeleton.Title`, `Skeleton.Paragraph` and `Skeleton.Button`; named imports are preferred in templates. `loading` is controlled through a prop and has no change event or v-model.

## Content Guidelines

- Unchanged fixed content directly displays fixed content, and variable content is displayed using skeleton screen

## Design Tokens

::token-table{component="skeleton"}
::

## Accessibility

Keep placeholder shapes out of the interaction flow. Announce loading on the surrounding content region when appropriate, and expose real content when loading becomes false. Skeleton does not automatically add aria-busy or a live region.

## FAQ

**Why is the image placeholder invisible?** SkeletonImage fills its container; give the container a width and height.

**Does Skeleton load data?** No. Update loading in the parent when your data is ready.

**How do I animate the placeholder?** Set active on Skeleton; it applies to its placeholder pieces.

## React → Vue

| React                                                  | Vue                                                                                 |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `children`                                             | default slot                                                                        |
| `placeholder ReactNode`                                | #placeholder slot or VNodeChild                                                     |
| `Skeleton.Avatar / Title / Image / Button / Paragraph` | SkeletonAvatar / SkeletonTitle / SkeletonImage / SkeletonButton / SkeletonParagraph |
| `useState + setLoading`                                | shallowRef + :loading                                                               |
| `className / CSSProperties`                            | class (className alias retained) / StyleValue                                       |
