# SideSheet

SideSheet slides from a page edge and hosts a secondary workflow without leaving the current context. The local Semi Design v2.102.0 source is the only parity baseline.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, SideSheet } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/side-sheet.css';

const visible = ref(false);
</script>

<template>
  <Button @click="visible = true">Open details</Button>
  <SideSheet v-model:visible="visible" title="Resource details">
    <p>SideSheet body content.</p>
  </SideSheet>
</template>
```

## Placement, sizing, and container

- `placement` accepts `top`, `right`, `bottom`, and `left`.
- left/right use `size=small|medium|large` (448/684/920px) or a custom `width`.
- top/bottom have a default height of 448px and accept `height`.
- `mask=false` keeps the outside area interactive; also set `disableScroll=false` if the page must remain scrollable.
- An explicit `getPopupContainer` on SideSheet uses absolute positioning inside a stable container with usable dimensions, `position: relative` and `overflow: hidden`. A container inherited only from `ConfigProvider` changes DOM placement while preserving fixed viewport positioning, including an empty relative host.

## Slots and events

- The default slot is the body. `#title`, `#footer`, and `#closeIcon` override their matching props.
- `v-model:visible` is the recommended controlled contract. Close, mask, and an enabled Escape key produce cancellation.
- `@cancel` receives the original MouseEvent/KeyboardEvent. `@after-visible-change` fires when the render state enters or the leave motion finishes.
- `keepDOM=true` preserves child state and hides the closed panel with `.semi-sidesheet-hidden`.

## API

| Prop                                                | Type                                     | Default            |
| --------------------------------------------------- | ---------------------------------------- | ------------------ |
| `visible`                                           | `boolean`                                | `false`            |
| `placement`                                         | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'`          |
| `size`                                              | `'small' \| 'medium' \| 'large'`         | `'small'`          |
| `width` / `height`                                  | `number \| string`                       | size width / `448` |
| `title` / `footer` / `closeIcon`                    | `VNodeChild`                             | -                  |
| `closable` / `mask` / `maskClosable`                | `boolean`                                | `true`             |
| `closeOnEsc`                                        | `boolean`                                | `false`            |
| `disableScroll` / `motion`                          | `boolean`                                | `true`             |
| `keepDOM`                                           | `boolean`                                | `false`            |
| `getPopupContainer`                                 | `() => HTMLElement`                      | `document.body`    |
| `zIndex`                                            | `number`                                 | `1000`             |
| `bodyStyle` / `headerStyle` / `maskStyle` / `style` | `StyleValue`                             | -                  |
| `aria-label`                                        | `string`                                 | -                  |

See `alignment.md` for source evidence, event order, SSR, and deviations, and `react-to-vue.md` for migration details.

## Native close button size

`closeButtonSize` is a Vue extension accepting `ButtonSize`: `'small' | 'default' | 'large'`, with `'small'` as the default. The default theme gives square 24/32/40px hit targets. This is independent of the overlay `size` and of `closeIcon` (prop or slot). To obtain a 32px button with a 20px glyph, set `closeButtonSize="default"` and render `<IconClose size="large" />` through `#closeIcon`. The default glyph stays 16px; custom themes may change pixel dimensions.

`semiGlobal.config.overrideDefaultProps.SideSheet` also accepts this property. Explicit instance values take precedence; omitted/undefined values use the global setting, then `'small'`. `closable=false` still hides the native button.
