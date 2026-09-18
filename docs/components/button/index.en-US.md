# Button

Button aligns with Semi Design v2.102.0 and keeps the `.semi-button*` DOM/classes, states, icon/loading layout, theme tokens, RTL and accessibility contracts. The public entry is the `@aifuxi/semi-ui-vue` root export and the `@aifuxi/semi-ui-vue/button` subpath, with the named exports `Button`, `ButtonGroup`, `SplitButtonGroup` and the `BUTTON_*` enums.

## Basic usage

```vue
<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue';
</script>

<template>
  <Button type="primary" theme="solid" @click="onSave">Save</Button>
  <Button type="danger" theme="light" disabled>Delete</Button>
  <Button type="tertiary" theme="borderless">Cancel</Button>
</template>
```

`type` defaults to `primary` (`primary`/`secondary`/`tertiary`/`warning`/`danger`), `theme` to `light` (`solid`/`borderless`/`light`/`outline`), and `size` to `default` (`default`/`small`/`large`).

## Icon, loading and block buttons

- Icons come from the `#icon` slot or a component icon; `iconPosition` (`left`/`right`, default `left`) places it relative to the label, and icon-only buttons must provide their own `aria-label`.
- `loading` renders the pinned Spin icon and blocks interaction; `disabled` outputs both the native `disabled` attribute and `aria-disabled="true"` and suppresses mouse events.
- `block` fills the parent width, `circle` renders a round button, and `noHorizontalPadding` accepts a boolean, `'left'`/`'right'` or an array to drop horizontal padding.
- `colorful` enables the AI gradient style; with `type="primary"` it uses the pinned gradient tokens. `contentClass` applies to the content wrapper.
- `htmlType` maps to the native `type` attribute and defaults to `button` (`button`/`reset`/`submit`).

## Button groups

```vue
<template>
  <ButtonGroup size="small" type="tertiary">
    <Button>Copy</Button>
    <Button>Paste</Button>
    <Button disabled>Delete</Button>
  </ButtonGroup>
</template>
```

`ButtonGroup` merges `size`/`type`/`theme`/`colorful`/`disabled` into direct `Button` children and inserts the pinned separator lines; explicit child props win, and non-Button children render untouched. `theme="outline"` inserts no separators, matching the pinned adapter.

## Split button group

```vue
<template>
  <SplitButtonGroup aria-label="More actions">
    <Button type="primary" theme="solid">Save</Button>
    <Button type="primary" theme="solid" icon="chevron-down" />
  </SplitButtonGroup>
</template>
```

`SplitButtonGroup` renders a `role="group"` container and observes child mutations after mount to merge the corner radius and borders of adjacent buttons; `prefixCls` defaults to `semi-button`.

## API

### Button

| Prop                   | Type                                                                             | Default         |
| ---------------------- | -------------------------------------------------------------------------------- | --------------- |
| `type`                 | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'`                | `'primary'`     |
| `theme`                | `'solid' \| 'borderless' \| 'light' \| 'outline'`                                | `'light'`       |
| `size`                 | `'default' \| 'small' \| 'large'`                                                | `'default'`     |
| `block` / `circle`     | `boolean`                                                                        | `false`         |
| `loading` / `disabled` | `boolean`                                                                        | `false`         |
| `colorful`             | `boolean`                                                                        | `false`         |
| `iconPosition`         | `'left' \| 'right'`                                                              | `'left'`        |
| `iconSize`             | `'inherit' \| 'extra-small' \| 'small' \| 'default' \| 'large' \| 'extra-large'` | -               |
| `iconStyle`            | `StyleValue`                                                                     | -               |
| `noHorizontalPadding`  | `boolean \| 'left' \| 'right' \| array`                                          | `false`         |
| `contentClass`         | class                                                                            | -               |
| `htmlType`             | `'button' \| 'reset' \| 'submit'`                                                | `'button'`      |
| `prefixCls`            | `string`                                                                         | `'semi-button'` |

Slots: `default` (label) and `icon` (scoped with `fill`/`iconSize`/`iconStyle`). Events: `click`, `mousedown`, `mouseenter`, `mouseleave`, each carrying the native `MouseEvent`.

### ButtonGroup

| Prop                      | Type                 | Default         |
| ------------------------- | -------------------- | --------------- |
| `size` / `theme` / `type` | same enums as Button | -               |
| `colorful` / `disabled`   | `boolean`            | -               |
| `prefixCls`               | `string`             | `'semi-button'` |

### SplitButtonGroup

| Prop        | Type     | Default         |
| ----------- | -------- | --------------- |
| `prefixCls` | `string` | `'semi-button'` |

## Accessibility and keyboard

- The root is a native `button`, so keyboard behavior, the focus ring and `Enter`/`Space` activation come from the browser; the component adds no extra role or tabindex.
- `disabled` blocks click and mouse events; icon-only buttons must supply their own `aria-label`, as the component never guesses an accessible name.
- `ButtonGroup`/`SplitButtonGroup` render `role="group"` and forward `aria-label` to the container.

## Theme, RTL, SSR and loading motion

- Classes and tokens follow the pinned `.semi-button*` surface; the per-component style entry is `@aifuxi/semi-theme-default/button.css`, compiled as theme index → global → animation → button → iconButton → icons.
- RTL is driven by ConfigProvider `.semi-rtl` for icon spacing and separator direction; separator widths keep the same contract in both directions.
- The loading icon spins with the pinned `600ms linear infinite`; `pnpm check:artifacts` verifies root/subpath ESM, declarations, `button.css`, SSR-safe import and the real tarball.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, visual and release evidence lives in the [alignment matrix](./alignment.md).
