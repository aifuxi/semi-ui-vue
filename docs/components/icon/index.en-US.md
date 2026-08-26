# Icon

Semantic vector graphics. The implementation targets Semi Design v2.102.0 and preserves the `.semi-icon-*`, sizing, rotation, animation, color, and SVG DOM contracts.

## Basic usage

```vue
<script setup lang="ts">
import { IconHome } from '@workspace/icons';
import '@workspace/theme-default/icon.css';
</script>

<template>
  <IconHome aria-label="Home" />
</template>
```

## Rotate, spin, and size

```vue
<script setup lang="ts">
import { IconEmoji, IconHome, IconSpin } from '@workspace/icons';
</script>

<template>
  <IconHome size="small" />
  <IconEmoji :rotate="180" />
  <IconSpin spin />
</template>
```

Sizes are `extra-small` (8px), `small` (12px), `default` (16px), `large` (20px), `extra-large` (24px), and `inherit` for the surrounding font size.

## Color and multicolor AI icons

Monochrome icons inherit CSS `color`. AI bicolor and multicolor icons accept one color or a color array through `fill`.

```vue
<script setup lang="ts">
import { IconAIFilledLevel2, IconAIWandLevel3, IconLikeHeart } from '@workspace/icons';
</script>

<template>
  <IconLikeHeart size="extra-large" style="color: #e91e63" />
  <IconAIFilledLevel2 fill="var(--semi-color-success)" size="extra-large" />
  <IconAIWandLevel3 :fill="['#f93920', '#15c39a', '#0064fa', '#ffb219']" size="extra-large" />
</template>
```

## Lab color icons

```vue
<script setup lang="ts">
import { IconAvatar, IconCard } from '@workspace/icons-lab';
</script>

<template>
  <IconAvatar size="extra-large" aria-label="Avatar" />
  <IconCard size="extra-large" aria-label="Card" />
</template>
```

Lab icons use fixed colors and do not support `fill` overrides.

## Custom icon

```vue
<script setup lang="ts">
import Icon from '@workspace/icons';
</script>

<template>
  <Icon type="custom-avatar" :rotate="180" aria-label="Custom avatar">
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="currentColor" />
    </svg>
  </Icon>
</template>
```

## API

| Prop        | Type                 | Default   | Description                                   |
| ----------- | -------------------- | --------- | --------------------------------------------- |
| `fill`      | `string \| string[]` | -         | Stable AI bicolor/multicolor fills            |
| `prefixCls` | `string`             | `semi`    | Class prefix                                  |
| `rotate`    | `number`             | -         | Rotation in degrees; only safe integers apply |
| `size`      | `IconSize`           | `default` | Icon size                                     |
| `spin`      | `boolean`            | `false`   | Continuous rotation                           |
| `type`      | `string`             | -         | Type class and default accessible name        |

| Slot      | Description        |
| --------- | ------------------ |
| `default` | Custom SVG content |

## React-to-Vue migration

| React                                                        | Vue                                          |
| ------------------------------------------------------------ | -------------------------------------------- |
| `<Icon svg={<CustomIcon />} />`                              | `<Icon><CustomIcon /></Icon>`                |
| `className`                                                  | `class`                                      |
| `ref<HTMLSpanElement>`                                       | Component ref's readonly `element` reference |
| Other `size / spin / rotate / fill / prefixCls / type` props | Keep the same prop names                     |
