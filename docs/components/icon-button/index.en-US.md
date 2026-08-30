# IconButton

IconButton preserves the public icon-button export from Semi Design `v2.102.0`. The pinned upstream
changelog marks it as no longer recommended, so new code should normally use the `Button` `#icon`
slot. Use this component when an existing integration depends on the IconButton entry or its fixed
`with-icon` DOM/class contract.

```vue
<script setup lang="ts">
import { IconButton } from '@aifuxi/semi-ui-vue';
import { IconStar } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/icon-button.css';
</script>

<template>
  <IconButton aria-label="Favorite">
    <template #icon><IconStar /></template>
  </IconButton>

  <IconButton icon-position="right">
    <template #icon><IconStar /></template>
    Favorite
  </IconButton>
</template>
```

## API

| Prop                  | Type                                                              | Default         | Description                                                                          |
| --------------------- | ----------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------ |
| `type`                | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'` | `'primary'`     | Button type                                                                          |
| `theme`               | `'solid' \| 'borderless' \| 'light' \| 'outline'`                 | `'light'`       | Button theme                                                                         |
| `size`                | `'default' \| 'small' \| 'large'`                                 | `'default'`     | Button size                                                                          |
| `iconPosition`        | `'left' \| 'right'`                                               | `'left'`        | Icon position relative to text                                                       |
| `iconSize`            | Icon size                                                         | -               | Exposed as an `#icon` slot prop; the pinned Adapter does not force it onto the icon  |
| `iconStyle`           | Vue `StyleValue`                                                  | -               | Exposed as an `#icon` slot prop for the consumer to apply                            |
| `loading`             | `boolean`                                                         | `false`         | Replaces the icon with the pinned loader unless disabled                             |
| `disabled`            | `boolean`                                                         | `false`         | Synchronizes native disabled and `aria-disabled`, and suppresses public mouse events |
| `noHorizontalPadding` | `boolean \| 'left' \| 'right' \| ('left' \| 'right')[]`           | `false`         | Removes horizontal padding on selected sides                                         |
| `block`               | `boolean`                                                         | `false`         | Uses block width                                                                     |
| `circle`              | `boolean`                                                         | `false`         | Applies the circle class                                                             |
| `colorful`            | `boolean`                                                         | `false`         | Enables the pinned colorful icon fill contract                                       |
| `htmlType`            | `'button' \| 'reset' \| 'submit'`                                 | `'button'`      | Native button type                                                                   |
| `prefixCls`           | `string`                                                          | `'semi-button'` | Class prefix                                                                         |
| `contentClass`        | Vue class value                                                   | -               | Additional content-span class; maps React `contentClassName`                         |

Native `class`, `style`, `id`, `aria-*`, and `data-*` attributes fall through to the root button.

## Slots

| Slot      | Slot props                      | Description                                                      |
| --------- | ------------------------------- | ---------------------------------------------------------------- |
| `icon`    | `{ fill, iconSize, iconStyle }` | Icon content; icon-only buttons should also provide `aria-label` |
| `default` | -                               | Optional text; omission preserves the pinned icon-only class     |

## Events

The component emits `click`, `mousedown`, `mouseenter`, and `mouseleave` with the native
`MouseEvent`. Disabled buttons do not emit these events.

See the [alignment matrix](./alignment.md) for source evidence, RTL/SSR/visual coverage, and
deviations, and [React → Vue](./react-to-vue.md) for migration examples.
