# Avatar

Avatar displays an identity with an image, icon, or text. `AvatarGroup` overlaps multiple avatars. The implementation is aligned exclusively with the pinned Semi Design v2.102.0 source.

## Import

```ts
import { Avatar, AvatarGroup } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/avatar.css';
```

## Sizes

The first example mirrors the first visible upstream documentation example and covers all seven preset sizes. Arbitrary CSS lengths such as `6rem` are also accepted.

```vue
<template>
  <Avatar size="extra-extra-small" alt="User">U</Avatar>
  <Avatar size="extra-small" alt="User">U</Avatar>
  <Avatar size="small" alt="User">U</Avatar>
  <Avatar size="default" alt="User">U</Avatar>
  <Avatar alt="User">U</Avatar>
  <Avatar size="large" alt="User">U</Avatar>
  <Avatar size="extra-large" alt="User">U</Avatar>
</template>
```

## Colors, shapes, images, and fallback

```vue
<template>
  <Avatar color="red" alt="Alice">A</Avatar>
  <Avatar color="light-blue" shape="square" alt="Bob">B</Avatar>
  <Avatar src="/avatar.webp" src-set="/avatar@2x.webp 2x" alt="Carol">C</Avatar>
</template>
```

An image error falls back to the default slot. Return `false` from `onError` to keep the image and suppress the built-in fallback. Use `imgAttr` for native image attributes.

## Hover, click, and keyboard

```vue
<Avatar color="purple" alt="Profile" @click="openProfile">
  P
  <template #hoverMask><span class="avatar-mask">Edit</span></template>
</Avatar>
```

With `@click`, the image or text label gets `tabindex="0"`. Enter activates it and Escape removes focus.

## Decorations and border

```vue
<Avatar
  size="large"
  color="amber"
  :border="{ color: '#fe2c55', motion: true }"
  content-motion
  :top-slot="{ text: 'LIVE', gradientStart: '#ff1764', gradientEnd: '#ed3494' }"
  :bottom-slot="{ shape: 'circle', bgColor: '#fe2c55', text: '+' }"
  alt="Live"
>
  T
</Avatar>
```

`#topSlot` and `#bottomSlot` can replace the configured decorations with custom VNodes.

## Avatar group

```vue
<AvatarGroup :max-count="3" overlap-from="start" size="medium">
  <Avatar color="red" alt="Alice">A</Avatar>
  <Avatar color="orange" alt="Bob">B</Avatar>
  <Avatar color="green" alt="Carol">C</Avatar>
  <Avatar color="blue" alt="David">D</Avatar>
  <template #more="{ restNumber }"><span>+{{ restNumber }}</span></template>
</AvatarGroup>
```

Group `size` and `shape` override direct Avatar children. Without `#more` or `renderMore`, the component creates the pinned `+N` Avatar.

## API

`Avatar` props include `size`, `shape`, `color`, `src`, `srcSet`, `alt`, `imgAttr`, `gap`, `hoverMask`, `topSlot`, `bottomSlot`, `border`, `contentMotion`, `className`, `style`, and `onError`. Events are `click`, `mouseenter`, and `mouseleave`. Slots are default, `hoverMask`, `topSlot`, and `bottomSlot`.

`AvatarGroup` props are `size`, `shape`, `overlapFrom`, `maxCount`, and `renderMore`. Slots are default and `more`.

## Accessibility and SSR

Avatar keeps `role="listitem"`; text uses `role="img"` with an accessible label, and AvatarGroup uses `role="list"`. Imports and SSR rendering do not touch browser globals. Text measurement, image probing, and focus-visible detection start only on the client.
