# Divider

Divider logically organizes content and page regions. The implementation targets Semi Design v2.102.0 and preserves the `.semi-divider-*` and `--semi-*` compatibility surface.

## Import

```ts
import { Divider } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/divider.css';
```

## Basic usage

```vue
<template>
  <span>Content above</span>
  <Divider margin="12px" role="separator" aria-label="Section divider" />
  <span>Content below</span>

  <span>Left</span>
  <Divider layout="vertical" dashed margin="12px" role="separator" aria-orientation="vertical" />
  <span>Right</span>
</template>
```

## With content

```vue
<Divider align="left" margin="12px">Left text</Divider>
<Divider align="center" margin="12px">Center text</Divider>
<Divider align="right" margin="12px">Right text</Divider>

<Divider margin="12px">
  <StatusIcon />
</Divider>
```

The vertical layout does not render the default slot, matching the pinned React adapter.

## API

| Prop     | Type                      | Default      | Description                                                    |
| -------- | ------------------------- | ------------ | -------------------------------------------------------------- |
| `align`  | `left \| right \| center` | `center`     | Content alignment for a horizontal divider                     |
| `dashed` | `boolean`                 | `false`      | Use a dashed line                                              |
| `layout` | `horizontal \| vertical`  | `horizontal` | Divider direction                                              |
| `margin` | `number \| string`        | -            | Vertical spacing when horizontal, otherwise horizontal spacing |

Native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes fall through to the root div. Caller styles override same-axis values derived from `margin`.

### Slots

| Slot      | Description                                                                                |
| --------- | ------------------------------------------------------------------------------------------ |
| `default` | Horizontal content; plain text uses the upstream inner span, custom VNodes render directly |

## React → Vue migration

| React                 | Vue                            |
| --------------------- | ------------------------------ |
| `children`            | default slot                   |
| `className` / `style` | native `class` / `style` attrs |
| React ref             | Vue template ref               |

All other prop names, enum values, and defaults remain unchanged.
