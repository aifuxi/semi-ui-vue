# Dropdown

Dropdown presents an action menu from a trigger. The local Semi Design v2.102.0 source is the sole parity baseline; `.semi-*` DOM, Portal, keyboard focus, and theme contracts are preserved.

## Basic usage

```vue
<script setup lang="ts">
import { Dropdown } from '@workspace/ui';
</script>

<template>
  <Dropdown>
    <button>More actions</button>
    <template #content>
      <Dropdown.Menu>
        <Dropdown.Title>Common actions</Dropdown.Title>
        <Dropdown.Item>Edit</Dropdown.Item>
        <Dropdown.Item disabled>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </template>
  </Dropdown>
</template>
```

Use `menu` for data-driven content and `v-model:visible` for controlled visibility.

```vue
<Dropdown
  v-model:visible="visible"
  trigger="click"
  show-tick
  :menu="[
    { node: 'title', name: 'Actions' },
    { node: 'item', name: 'Edit', active: true },
    { node: 'divider' },
    { node: 'item', name: 'Delete', disabled: true, type: 'danger' },
  ]"
>
  <button>Menu</button>
</Dropdown>
```

## API

### Dropdown

| Prop                | Description                            | Type                                                         | Default               |
| ------------------- | -------------------------------------- | ------------------------------------------------------------ | --------------------- |
| `visible`           | Visibility; supports `v-model:visible` | `boolean`                                                    | -                     |
| `trigger`           | Trigger mode                           | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`             |
| `position`          | Popup position                         | `TooltipPosition`                                            | `'bottom'`            |
| `menu`              | Data-driven menu                       | `readonly DropdownMenuItem[]`                                | -                     |
| `showTick`          | Reserve the Item check column          | `boolean`                                                    | `false`               |
| `contentClassName`  | Content-root class                     | `HTMLAttributes['class']`                                    | -                     |
| `getPopupContainer` | Portal container                       | `() => HTMLElement`                                          | ConfigProvider / body |
| `spacing`           | Trigger-to-popup spacing               | `number \| TooltipSpacing`                                   | 4, or 2 when nested   |
| `motion`            | Enable popup motion                    | `boolean`                                                    | `true`                |
| `closeOnEsc`        | Close on Escape                        | `boolean`                                                    | `true`                |
| `mouseEnterDelay`   | hover/focus open delay                 | `number`                                                     | `50`                  |
| `mouseLeaveDelay`   | hover/focus close delay                | `number`                                                     | `100`                 |
| `zIndex`            | Portal stacking level                  | `number`                                                     | `1060`                |
| `class`             | Popup-wrapper class                    | Vue class                                                    | -                     |
| `style`             | `.semi-dropdown` content-root style    | Vue style                                                    | -                     |

Tooltip positioning and behavior props are retained, including `autoAdjustOverflow`, `margin`, `rePosKey`, `clickToHide`, `clickTriggerToHide`, `stopPropagation`, `keepDOM`, and `preventScroll`.

Events: `visibleChange`, `update:visible`, `clickOutside`, `escKeydown`, and `afterClose`. Exposed methods: `focusTrigger()`, `getPopupId()`, and `rePosition()`.

Slots: the default slot is the trigger; `#content` is the menu content and takes precedence over `menu`.

### Dropdown.Menu

Accepts the default slot plus native Vue `class` / `style` / `data-*` / `aria-*`; renders `role="menu"`.

### Dropdown.Item

| Prop       | Description                                            | Type                                                              | Default |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------- | ------- |
| `active`   | Active state; shows a check when `showTick` is enabled | `boolean`                                                         | `false` |
| `disabled` | Disables pointer actions and keyboard navigation       | `boolean`                                                         | `false` |
| `type`     | Text type                                              | `'primary' \| 'secondary' \| 'tertiary' \| 'warning' \| 'danger'` | -       |
| `icon`     | Leading icon; `#icon` is also supported                | `VNodeChild \| () => VNodeChild`                                  | -       |
| `showTick` | Local check column; the outer value wins               | `boolean`                                                         | `false` |

Events: `click`, `mouseenter`, `mouseleave`, `contextmenu`, and `keydown`. The default slot is the Item content.

### Dropdown.Title / Dropdown.Divider

Both accept native Vue `class`, `style`, and fallthrough attributes. Title accepts the default slot.

## Accessibility and SSR

- The trigger keeps `aria-haspopup`, `aria-expanded`, and `data-popupid`.
- ArrowUp/ArrowDown cycle through enabled items; printable characters jump by first character; Enter/Space activate; Escape closes and restores focus.
- SSR renders the trigger only. Portal DOM and listeners are created on the client and cleaned up on unmount.

See the [React → Vue migration notes](./react-to-vue.md) and [v2.102.0 alignment matrix](./alignment.md).
