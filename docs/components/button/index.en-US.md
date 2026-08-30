# Button

Button triggers an action or submits a native form. The implementation targets Semi Design v2.102.0 and preserves the `.semi-button-*` and `--semi-*` compatibility surface.

## Import

```ts
import { Button, ButtonGroup, SplitButtonGroup } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/button.css';
```

## Button types

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/button.css';
</script>

<template>
  <div class="button-row">
    <Button>Primary Button</Button>
    <Button type="secondary">Secondary Button</Button>
    <Button type="tertiary">Tertiary Button</Button>
    <Button type="warning">Warning Button</Button>
    <Button type="danger">Danger Button</Button>
  </div>
</template>
```

## Icon, loading, and disabled states

```vue
<Button aria-label="Take a screenshot">
  <template #icon="{ fill, iconSize, iconStyle }">
    <CameraIcon :fill="fill" :size="iconSize" :style="iconStyle" />
  </template>
</Button>

<Button loading>Save</Button>
<Button disabled>Unavailable</Button>
```

Loading disables pointer interaction. Disabled takes precedence when both states are present. Icon-only buttons must have an accessible name.

## Groups

```vue
<ButtonGroup aria-label="Edit actions" size="large" theme="solid">
  <Button>Copy</Button>
  <Button>Search</Button>
  <Button>Cut</Button>
</ButtonGroup>

<SplitButtonGroup aria-label="Project actions">
  <Button theme="solid">Save</Button>
  <Button theme="solid" aria-label="More actions">
    <template #icon><ChevronDownIcon /></template>
  </Button>
</SplitButtonGroup>
```

## Button API

| Prop                  | Type                                                    | Default       | Description                       |
| --------------------- | ------------------------------------------------------- | ------------- | --------------------------------- |
| `type`                | `primary \| secondary \| tertiary \| warning \| danger` | `primary`     | Semantic tone                     |
| `theme`               | `solid \| borderless \| light \| outline`               | `light`       | Visual theme                      |
| `size`                | `default \| small \| large`                             | `default`     | Size                              |
| `htmlType`            | `button \| reset \| submit`                             | `button`      | Native type                       |
| `block`               | `boolean`                                               | `false`       | Fill the container width          |
| `circle`              | `boolean`                                               | `false`       | Preserve the v2.102.0 state class |
| `disabled`            | `boolean`                                               | `false`       | Native disabled state             |
| `loading`             | `boolean`                                               | `false`       | Loading state                     |
| `colorful`            | `boolean`                                               | `false`       | AI colorful style                 |
| `iconPosition`        | `left \| right`                                         | `left`        | Icon slot position                |
| `noHorizontalPadding` | `boolean \| left \| right \| (left \| right)[]`         | `false`       | Icon-layout horizontal padding    |
| `contentClass`        | Vue class value                                         | -             | Content span class                |
| `prefixCls`           | `string`                                                | `semi-button` | Class prefix                      |

Native `class`, `style`, `id`, `aria-*`, `data-*`, and focus events fall through to the root button.

### Slots

| Slot      | Scope                           | Description                                   |
| --------- | ------------------------------- | --------------------------------------------- |
| `default` | -                               | Button content                                |
| `icon`    | `{ fill, iconSize, iconStyle }` | Icon; colorful mode exposes its fill contract |

### Emits

`click`, `mousedown`, `mouseenter`, and `mouseleave`, each carrying a native `MouseEvent`.

## React → Vue migration

| React                 | Vue                                                         |
| --------------------- | ----------------------------------------------------------- |
| `children`            | default slot                                                |
| `icon={<Icon />}`     | `#icon` slot                                                |
| `className` / `style` | native `class` / `style` attrs                              |
| `contentClassName`    | `contentClass`                                              |
| `onClick`             | `@click`                                                    |
| `onMouseDown`         | `@mousedown`                                                |
| `onMouseEnter`        | `@mouseenter`                                               |
| `onMouseLeave`        | `@mouseleave`                                               |
| React ref             | Vue template ref; prefer native focus attributes and events |

All props, enum values, and defaults that map naturally keep their upstream names.
