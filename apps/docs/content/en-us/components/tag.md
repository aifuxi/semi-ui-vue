---
title: 'Tag'
description: 'Tag component is used to display a collection of concise information for rapid identification and grouping.'
locale: 'en-US'
slug: 'tag'
category: 'show'
order: 82
englishTitle: 'Tag'
icon: 'doc-tag'
upstream: 'show/tag'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Tag, TagGroup, SplitTagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
</script>
```

### Basic usage

To use this tag, just wrap the content with the `<Tag>` tag.  
It can be turned into a closable label by adding the `closable` property.  
At this time, clicking x to close will trigger the close event, and calling event.preventDefault() in the close handler can make it still show and not hide after clicking

::demo-block{demo="tag/en-us/Basic" title="Basic usage"}
::

### Size

Supports two sizes: `large` and `small`. The `default` prop value uses the same small dimensions.

::demo-block{demo="tag/en-us/Size" title="Size"}
::

### Shape

Supports two Shape: `square`（default）、`circle`。

::demo-block{demo="tag/en-us/Shape" title="Shape"}
::

### Configure icons

Use `#prefixIcon` and `#suffixIcon` to place icons before and after the tag content.

::demo-block{demo="tag/en-us/Icons" title="Configure icons"}
::

### Color

Tag supports 16 colors plus white from Semi's palette: `amber`, `blue`, `cyan`, `green`, `grey`, `indigo`, `light-blue`, `light-green`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `violet`, `yellow`, `white`. You can also customize color through `style`.

::demo-block{demo="tag/en-us/Color" title="Color"}
::

### AI style - colorful labels

Set `colorful` to `true` to get colorful labels.

::demo-block{demo="tag/en-us/Colorful" title="AI style - colorful labels"}
::

### Type

Tag supports three different types, including: `light`(default), `ghost`, `solid`.

::demo-block{demo="tag/en-us/Type" title="Type"}
::

### Avatar Tag

You can get a avatar tag with `avatarSrc` property. `avatarShape` can change the shape of avatar tag including `square`(default) and `circle`.

::demo-block{demo="tag/en-us/Avatar" title="Avatar Tag"}
::

### Invisible

You can use `visible` property to control whether the tag is visible.

::demo-block{demo="tag/en-us/Visible" title="Invisible"}
::

### TagGroup

You can pass in configs for tags through `tagList` to create a TagGroup. The `maxTagCount` can be used to cap the number of list and will be displayed as `+N` when the limit is exceeded.  
Set the `showPopover` property to control whether the remaining content is displayed by Popover when hover to + N Tag

::demo-block{demo="tag/en-us/Group" title="TagGroup"}
::

If the tags in the TagGroup can be deleted, the user needs to process the `tagList` passed to the TagGroup in `@tag-close`

::demo-block{demo="tag/en-us/GroupClose" title="TagGroup"}
::

### SplitTagGroup

Use `SplitTagGroup` to combine multiple tags into a single connected group. The first and last tags keep their rounded corners while the middle tags are rendered with a square edge, producing a continuous visual unit.

::demo-block{demo="tag/en-us/SplitGroup" title="SplitTagGroup"}
::

## API Reference

### Tag

| Property                  | Description                                                   | Type                      | Default              |
| ------------------------- | ------------------------------------------------------------- | ------------------------- | -------------------- |
| `avatarShape`             | Avatar shape: square, circle                                  | `TagAvatarShape`          | `square`             |
| `avatarSrc`               | Avatar URL                                                    | `string`                  | `—`                  |
| `class / className`       | Style class; className is a compatibility alias               | `HTMLAttributes["class"]` | `—`                  |
| `style`                   | Inline style                                                  | `StyleValue`              | `—`                  |
| `closable`                | Display the close control                                     | `boolean`                 | `false`              |
| `color`                   | 16 palette colors and white                                   | `TagColor`                | `grey`               |
| `colorful`                | AI colorful style                                             | `boolean`                 | `false`              |
| `gradient`                | Enable a gradient with colorful                               | `boolean`                 | `false`              |
| `prefixIcon / suffixIcon` | Leading/trailing icon; named slots take precedence            | `VNodeChild`              | `—`                  |
| `content`                 | Data-driven content; the default slot takes precedence        | `VNodeChild`              | `—`                  |
| `shape`                   | square, circle                                                | `TagShape`                | `square`             |
| `size`                    | default and small are 20px; large is 24px                     | `TagSize`                 | `default`            |
| `type`                    | light, solid, ghost                                           | `TagType`                 | `light`              |
| `visible`                 | Controlled when explicitly supplied; supports v-model:visible | `boolean`                 | `uncontrolled: true` |
| `tagKey`                  | Unique tag identifier passed to close events                  | `string \| number`        | `—`                  |
| `tabIndex`                | Used only for interactive tags                                | `number`                  | `0 (interactive)`    |
| `aria-label`              | Accessible name through a native attribute                    | `string`                  | `—`                  |

### TagGroup

| Property            | Description                                     | Type                           | Default   |
| ------------------- | ----------------------------------------------- | ------------------------------ | --------- |
| `avatarShape`       | Default avatar shape within the group           | `TagAvatarShape`               | `square`  |
| `class / className` | Style class; className is a compatibility alias | `HTMLAttributes["class"]`      | `—`       |
| `style`             | Inline style                                    | `StyleValue`                   | `—`       |
| `maxTagCount`       | Maximum visible tags; remaining items become +N | `number`                       | `—`       |
| `restCount`         | Custom +N count; applies when nonzero           | `number`                       | `—`       |
| `popoverProps`      | Popover configuration for remaining tags        | `PopoverProps`                 | `—`       |
| `showPopover`       | Show remaining tags on hovering +N              | `boolean`                      | `false`   |
| `size`              | Default tag size in the group                   | `TagSize`                      | `default` |
| `tagList`           | Configuration objects; Vue nodes in custom mode | `Array<TagData \| VNodeChild>` | `[]`      |
| `mode`              | custom uses tagList nodes directly              | `string`                       | `—`       |

### SplitTagGroup

| Property            | Description                                     | Type                      | Default |
| ------------------- | ----------------------------------------------- | ------------------------- | ------- |
| `class / className` | Style class; className is a compatibility alias | `HTMLAttributes["class"]` | `—`     |
| `style`             | Inline style                                    | `StyleValue`              | `—`     |
| `aria-label`        | Accessible name for the connected group         | `string`                  | `—`     |

Slots: `default`, `prefixIcon`, `suffixIcon`. Events: `@click(event)`, `@close(content, event, tagKey)`, `@keydown(event)`, `@mouseenter(event)`, and `update:visible`. Calling `event.preventDefault()` in close prevents hiding.

TagGroup emits `@tag-close(content, event, tagKey)` and `@plus-n-mouseenter(event)`. `TagData` extends TagProps with `@click`, `@close`, `onKeydown` and `onMouseenter`; use `content` instead of React children. Update tagList in the parent after closing a tag. SplitTagGroup receives direct Tag children in its default slot.

## Accessibility

### ARIA

- `aria-label` is used to indicate the role of `Tag`, for deleteable or clickable `Tag` , we recommend using this attribute

### Keyboard and Focus

- If the current `Tag` is interactive, then this `Tag` can be focused. Such as:
  - When the `@click` attribute is used, the keyboard user can activate this `Tag` with the `Enter` keys
  - When the `closable` property is `true`, keyboard users can delete this `Tag` by pressing the `Delete` key
  - When a `Tag` is focused, keyboard users can use the `Esc` key to defocus the currently focused `Tag`

## Content Guidelines

- Due to limited space, label text should be as short as possible
- avoid line breaks
- use sentence case

## Design Tokens

::token-table{component="tag"}
::

## FAQ

**Why does a controlled Tag stay visible after closing?** Update visible in the parent, or use v-model:visible.

**How do I prevent closing?** Call event.preventDefault() in the close handler.

**Why does +N not change after deletion?** Update the parent tagList using a unique tagKey. The group count is derived from its supplied data.

## React → Vue

| React                               | Vue                                           |
| ----------------------------------- | --------------------------------------------- |
| `children`                          | default slot or content prop                  |
| `prefixIcon / suffixIcon ReactNode` | Matching slots or VNodeChild                  |
| `visible + onClose`                 | v-model:visible or :visible + @close          |
| `tagList[].children`                | tagList[].content                             |
| `onTagClose / onPlusNMouseEnter`    | @tag-close / @plus-n-mouseenter               |
| `SplitTagGroup children`            | Direct Tag children in the default slot       |
| `className / CSSProperties`         | class (className alias retained) / StyleValue |
