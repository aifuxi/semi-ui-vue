# Tooltip

Tooltip presents supplemental information on hover, focus, click, or context menu. This implementation uses local Semi Design v2.102.0 as its sole baseline and preserves its DOM classes, Portal, placement, delays, keyboard behavior, and ARIA contract.

## Basic usage

```vue
<script setup lang="ts">
import { Tooltip, Button } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/tooltip.css';
</script>

<template>
  <Tooltip content="Copy link">
    <Button>Hover me</Button>
  </Tooltip>
</template>
```

## Controlled visibility and content slot

```vue
<script setup lang="ts">
import { shallowRef } from 'vue';

const visible = shallowRef(false);
</script>

<template>
  <Tooltip v-model:visible="visible" trigger="click" position="bottomRight">
    <template #content="{ initialFocusRef }">
      <button :ref="initialFocusRef">First action</button>
    </template>
    <button>Open</button>
  </Tooltip>
</template>
```

## API

| Prop                                  | Description                                                   | Type                                                         | Default                 |
| ------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------- |
| `content`                             | Tooltip content; prefer the `content` slot for complex markup | `VNodeChild`                                                 | -                       |
| `visible`                             | Controlled visibility; supports `v-model:visible`             | `boolean`                                                    | -                       |
| `trigger`                             | Trigger mode                                                  | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`               |
| `position`                            | 12 regular placements and four `*Over` placements             | `TooltipPosition`                                            | `'top'`                 |
| `mouseEnterDelay` / `mouseLeaveDelay` | Hover show/hide delay in milliseconds                         | `number`                                                     | `50`                    |
| `showArrow`                           | Shows the default arrow or accepts a VNode                    | `boolean \| VNodeChild`                                      | `true`                  |
| `spacing`                             | Gap between trigger and popup                                 | `number \| { x; y }`                                         | `8`                     |
| `margin`                              | Positioning margin                                            | `number \| TooltipMargin`                                    | `0`                     |
| `autoAdjustOverflow`                  | Flips or reduces placement when overflowing                   | `boolean`                                                    | `true`                  |
| `getPopupContainer`                   | Returns the Portal container                                  | `() => HTMLElement`                                          | ConfigProvider / `body` |
| `keepDOM`                             | Keeps the hidden popup DOM after closing                      | `boolean`                                                    | `false`                 |
| `closeOnEsc` / `guardFocus`           | Escape closing and popup focus loop                           | `boolean`                                                    | `false`                 |
| `role`                                | Popup role; `dialog` changes trigger ARIA                     | `string`                                                     | `'tooltip'`             |
| `class` / `style`                     | Popup wrapper class/style                                     | Vue class / style                                            | -                       |
| `wrapperClassName`                    | Wrapper span class for special triggers                       | Vue class                                                    | -                       |
| `wrapperId`                           | Stable popup id                                               | `string`                                                     | generated               |
| `zIndex`                              | Portal z-index                                                | `number`                                                     | `1060`                  |

| Event            | Payload                  | Description                               |
| ---------------- | ------------------------ | ----------------------------------------- |
| `visibleChange`  | `(visible: boolean)`     | Visibility changed                        |
| `update:visible` | `(visible: boolean)`     | Updates `v-model:visible`                 |
| `clickOutside`   | `(event: MouseEvent)`    | Pointer pressed outside popup and trigger |
| `escKeydown`     | `(event: KeyboardEvent)` | Escape close notification                 |
| `afterClose`     | `()`                     | Exit motion and DOM handling completed    |

| Slot      | Description                            |
| --------- | -------------------------------------- |
| `default` | Trigger content                        |
| `content` | Tooltip content with `initialFocusRef` |
| `arrow`   | Custom arrow                           |

The component instance exposes `focusTrigger()`, `rePosition()`, and `getPopupId()`. See the [alignment matrix](./alignment.md) for full source evidence, event order, SSR, and React-to-Vue migration details.
