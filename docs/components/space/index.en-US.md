# Space

Space applies consistent gaps between sibling content. The implementation targets Semi Design v2.102.0 and preserves the `.semi-space-*` and `--semi-*` compatibility surface.

## Import

```ts
import { Space } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/space.css';
```

## Basic usage

```vue
<template>
  <Space>
    <button>Confirm</button>
    <button>Cancel</button>
  </Space>
</template>
```

## Spacing, direction, and wrapping

```vue
<Space spacing="medium">
  <ItemA />
  <ItemB />
</Space>

<Space :spacing="12" vertical>
  <ItemA />
  <ItemB />
</Space>

<Space :spacing="[12, 20]" wrap>
  <ItemA />
  <ItemB />
  <ItemC />
</Space>
```

The first array item controls the horizontal gap and the second controls the vertical gap. `wrap` only applies to horizontal Space; vertical mode omits the wrap class.

## Alignment

```vue
<Space align="start">...</Space>
<Space align="center">...</Space>
<Space align="end">...</Space>
<Space align="baseline">...</Space>
```

## API

| Prop       | Type                                                   | Default  | Description                                 |
| ---------- | ------------------------------------------------------ | -------- | ------------------------------------------- |
| `align`    | `start \| center \| end \| baseline`                   | `center` | Cross-axis alignment                        |
| `spacing`  | `tight \| medium \| loose \| number \| SpaceSpacing[]` | `tight`  | Preset, custom, or horizontal/vertical gaps |
| `vertical` | `boolean`                                              | `false`  | Use a vertical direction                    |
| `wrap`     | `boolean`                                              | `false`  | Allow wrapping in horizontal mode           |

Native `class`, `style`, `id`, `role`, `aria-*`, and `data-*` attributes fall through to the root div. Numeric spacing overrides same-axis `column-gap` / `row-gap` values in caller styles, matching the pinned React adapter.

### Slots

| Slot      | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `default` | Sibling flex items; Vue fragments expand into direct DOM children |

## React → Vue migration

| React                 | Vue                            |
| --------------------- | ------------------------------ |
| `children`            | default slot                   |
| `className` / `style` | native `class` / `style` attrs |
| React ref             | Vue template ref               |

All other prop names, enum values, array ordering, and defaults remain unchanged.
