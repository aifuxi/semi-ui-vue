---
title: 'Avatar'
description: 'Avatar, used for image or text display.'
locale: 'en-US'
slug: 'avatar'
category: 'show'
order: 62
englishTitle: 'Avatar'
icon: 'doc-avatar'
upstream: 'show/avatar'
---

## Demos

### How to import

```vue
<script setup lang="ts">
import { Avatar, AvatarGroup } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
</script>
```

### Size

You can change the size of the avatars with `size` property. The following sizes are supported: `extra-extra-small`, `extra-small`,`small`, `default`, `medium`, `large`, `extra-large`.

::demo-block{demo="avatar/en-us/Size" title="Size"}
::

### Color

Avatars support 16 colors including `white`, `amber`, `blue`, `cyan`, `green`, `grey`, `indigo`, `light-blue`, `light-green`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `violet`, and `yellow`. You can also use the `style` prop to customize styles. The default color is`grey`.

::demo-block{demo="avatar/en-us/Color" title="Color"}
::

### Adaptive character size

For the avatar of the character type, the font size will be adjusted adaptively according to the width of the avatar. Use `gap` to adjust the pixel size on the left and right sides of the character avatar distance.

::demo-block{demo="avatar/en-us/Adaptive" title="Adaptive character size"}
::

### Image

Image avatars can be created by using the `src` or `srcSet` prop.

::demo-block{demo="avatar/en-us/Image" title="Image"}
::

### Shape

Avatars support two shapes: `circle` and `square`. The shape is default to `circle`.

::demo-block{demo="avatar/en-us/Shape" title="Shape"}
::

### Event

Avatars support `onClick`,`onMouseEnter`,`onMouseLeave`. You can use the `hoverMask` prop to pass in overlay content for `hover` state.
The overlay has no default style.

::demo-block{demo="avatar/en-us/Hover" title="Event"}
::

### Top and Bottom Slot

::demo-block{demo="avatar/en-us/Slots" title="Top and Bottom Slot"}
::

#### Top

::demo-block{demo="avatar/en-us/TopSlot" title="Top"}
::

#### Bottom

::demo-block{demo="avatar/en-us/BottomSlot" title="Bottom"}
::

### Additional border

::demo-block{demo="avatar/en-us/Border" title="Additional border"}
::

### Additional Animation

Turn on additional animation effects for borders and content areas through `:border="{ motion: true }"` and `contentMotion`

::demo-block{demo="avatar/en-us/Animation" title="Additional Animation"}
::

### AvatarGroup

You can use `AvatarGroup` component to display avatars as a group.

::demo-block{demo="avatar/en-us/Group" title="AvatarGroup"}
::

You can set the number of avatars to display with `maxCount` property.
::demo-block{demo="avatar/en-us/MaxCount" title="AvatarGroup"}
::

You can customize the more tag with `renderMore`.
::demo-block{demo="avatar/en-us/More" title="AvatarGroup"}
::

You can set the coverage direction of the avatars with `overlapFrom`. It has two optional values A and B. The default value is `start`.
::demo-block{demo="avatar/en-us/Overlap" title="AvatarGroup"}
::

## API Reference

### Avatar

| Property            | Description                                                         | Type                                | Default  |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------- | -------- |
| `alt`               | Alternative text for an image or label                              | `string`                            | `—`      |
| `border`            | Additional border; an object configures color and motion            | `boolean \| AvatarBorder`           | `false`  |
| `bottomSlot`        | Bottom decoration configuration; see below                          | `AvatarBottomSlot`                  | `—`      |
| `class / className` | Style class; className is a compatibility alias                     | `HTMLAttributes["class"]`           | `—`      |
| `style`             | Inline style                                                        | `StyleValue`                        | `—`      |
| `color`             | Palette color, including white                                      | `AvatarColor`                       | `grey`   |
| `contentMotion`     | Content scaling animation                                           | `boolean`                           | `false`  |
| `hoverMask`         | Hover overlay, with no default overlay styling                      | `VNodeChild`                        | `—`      |
| `gap`               | Pixel gap between text and the avatar edges                         | `number`                            | `3`      |
| `imgAttr`           | Native image attributes                                             | `ImgHTMLAttributes`                 | `—`      |
| `shape`             | circle, square                                                      | `AvatarShape`                       | `circle` |
| `size`              | Preset size or CSS width such as 60px                               | `AvatarSize`                        | `medium` |
| `src`               | Image URL                                                           | `string`                            | `—`      |
| `srcSet`            | Responsive image sources                                            | `string`                            | `—`      |
| `topSlot`           | Top decoration configuration; see below                             | `AvatarTopSlot`                     | `—`      |
| `onError`           | Image error callback; returning false prevents the default fallback | `(event: Event) => boolean \| void` | `—`      |

### AvatarBottomSlot

| Property    | Description                           | Type                      | Default     |
| ----------- | ------------------------------------- | ------------------------- | ----------- |
| `render`    | Completely customize bottom rendering | `() => VNodeChild`        | `—`         |
| `shape`     | circle, square                        | `AvatarShape`             | `—`         |
| `text`      | Bottom content                        | `VNodeChild`              | `—`         |
| `bgColor`   | Bottom background color               | `string`                  | `CSS token` |
| `textColor` | Text color                            | `string`                  | `CSS token` |
| `className` | Content class                         | `HTMLAttributes["class"]` | `—`         |
| `style`     | Bottom wrapper style                  | `StyleValue`              | `—`         |

### AvatarTopSlot

| Property                      | Description                        | Type                      | Default                     |
| ----------------------------- | ---------------------------------- | ------------------------- | --------------------------- |
| `render`                      | Completely customize top rendering | `() => VNodeChild`        | `—`                         |
| `gradientStart / gradientEnd` | Gradient start and end colors      | `string`                  | `var(--semi-color-primary)` |
| `text`                        | Top content                        | `VNodeChild`              | `—`                         |
| `textColor`                   | Text color                         | `string`                  | `CSS token`                 |
| `className`                   | Top wrapper class                  | `HTMLAttributes["class"]` | `—`                         |
| `style`                       | Top wrapper style                  | `StyleValue`              | `—`                         |

### AvatarBorder

| Property | Description                | Type      | Default                     |
| -------- | -------------------------- | --------- | --------------------------- |
| `color`  | Border color               | `string`  | `var(--semi-color-primary)` |
| `motion` | Expanding border animation | `boolean` | `false`                     |

### AvatarGroup

| Property      | Description                                        | Type                                                       | Default  |
| ------------- | -------------------------------------------------- | ---------------------------------------------------------- | -------- |
| `maxCount`    | Maximum visible avatars; remaining items become +N | `number`                                                   | `—`      |
| `overlapFrom` | Overlap direction: start, end                      | `AvatarGroupOverlapFrom`                                   | `start`  |
| `renderMore`  | Custom remaining-avatar node                       | `(restNumber: number, restAvatars: VNode[]) => VNodeChild` | `—`      |
| `shape`       | circle, square                                     | `AvatarShape`                                              | `circle` |
| `size`        | Preset size or CSS width                           | `AvatarSize`                                               | `medium` |

Slots: `default` supplies content, `#hoverMask` supplies the hover overlay, and `#topSlot="{ config }"` / `#bottomSlot="{ config }"` customize configured decorations. `AvatarGroup` supports `#more="{ restNumber, restAvatars }"`.

Events: `@click(event)` accepts MouseEvent or KeyboardEvent; `@mouseenter(event)` and `@mouseleave(event)` receive MouseEvent. `onError` remains a function prop because its return value controls fallback; bind it as `:on-error="handleError"`.

Preset sizes are 20, 24, 32, 40, 48, 72 and 128px respectively. Top/bottom decorations require supported preset sizes; top decorations also require circle shape.

## Accessibility

- Avatars are generally not used for operations and do not need to be focused. But when the Avatar can be clicked (such as the avatar on the Semi official website), it needs to be focused and respond to the keyboard `Enter` event.
- When Avatar is used in combination with other components, also check the accessibility guidelines for that component.
- Avatar's `alt` attribute can be read by screen readers, when using the avatar component, please use the `alt` attribute to explain the content of the image.

```vue
<!-- Use alternative text that describes the actual image. -->
<Avatar alt="Sample image" src="/demos/photo.svg" style="margin: 4px" />
<Avatar alt="Lisa LeBlanc">LL</Avatar>
```

## Design Tokens

::token-table{component="avatar"}
::

## Content Guidelines

Use recognizable initials or an image. Supply meaningful alt text identifying the person or content; avoid repeating words such as “image of”.

## FAQ

**Why does a decoration not show?** Top/bottom decorations use supported preset sizes; top decorations require circle shape.

**How do I keep a failed image visible?** Supply an onError function that returns false. Otherwise Avatar falls back to its content.

**Why does group size override an item?** AvatarGroup consistently applies its size and shape to group members.

## React → Vue

| React                                   | Vue                                                                    |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `children`                              | default slot                                                           |
| `hoverMask ReactNode`                   | hoverMask slot or VNodeChild                                           |
| `topSlot / bottomSlot render`           | Configuration functions returning VNodeChild, or matching scoped slots |
| `renderMore(restNumber, restAvatars)`   | #more="{ restNumber, restAvatars }"                                    |
| `React.cloneElement`                    | Vue cloneVNode                                                         |
| `onClick / onMouseEnter / onMouseLeave` | @click / @mouseenter / @mouseleave                                     |
| `onError`                               | :on-error function prop, preserving the return value                   |
| `className / CSSProperties`             | class (className alias retained) / StyleValue                          |
