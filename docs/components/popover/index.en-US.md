# Popover

Popover renders an interactive card next to its trigger. It reuses Tooltip's positioning and Portal state machine while providing defaults intended for complex content and keyboard interaction.

## Import

```ts
import { Popover } from '@workspace/ui';
import '@workspace/theme-default/popover.css';
```

## Basic usage

```vue
<Popover>
  <template #content>
    <article class="card">Buttons, forms, and other complex content are supported.</article>
  </template>
  <button>Hover here</button>
</Popover>
```

Use the `content` prop for a static VNode. The `#content` slot is the idiomatic Vue form and takes precedence over the prop.

## Controlled visibility and focus

```vue
<Popover v-model:visible="visible" trigger="click">
  <template #content="{ initialFocusRef }">
    <input :ref="initialFocusRef" placeholder="Focused after opening" />
  </template>
  <button>Open</button>
</Popover>
```

click/custom use the `dialog` role; hover/focus/contextMenu use `tooltip`. Focus guarding, Escape close, and focus restoration are enabled by default.

## Arrow, custom color, and container

```vue
<Popover
  show-arrow
  position="right"
  :style="{ backgroundColor: '#0064fa', borderColor: '#0064fa', color: 'white' }"
  :arrow-style="{ backgroundColor: '#0064fa', borderColor: '#0064fa' }"
  :get-popup-container="() => popupHost"
>
  <template #content><div class="card">Right-side card</div></template>
  <button>Trigger</button>
</Popover>
```

The custom container must exist before the Popover is first shown and should use `position: relative`. Default `spacing` is `4` without an arrow and `10` with one.

## API

| Property               | Type                                                         | Default               | Description                              |
| ---------------------- | ------------------------------------------------------------ | --------------------- | ---------------------------------------- |
| `content`              | `VNodeChild`                                                 | -                     | Static content; `#content` wins          |
| `visible`              | `boolean`                                                    | -                     | Works with `v-model:visible`             |
| `trigger`              | `'hover' \| 'focus' \| 'click' \| 'custom' \| 'contextMenu'` | `'hover'`             | Trigger mode                             |
| `position`             | `PopoverPosition`                                            | `'bottom'`            | Popup placement                          |
| `showArrow`            | `boolean`                                                    | `false`               | Render the two-layer arrow               |
| `arrowPointAtCenter`   | `boolean`                                                    | `true`                | Point the arrow at the trigger center    |
| `arrowStyle`           | `PopoverArrowStyle`                                          | -                     | Arrow background, border, and opacity    |
| `spacing`              | `number \| { x, y }`                                         | `4 / 10`              | Distance from the trigger                |
| `autoAdjustOverflow`   | `boolean`                                                    | `true`                | Adjust placement near boundaries         |
| `condition`            | `boolean`                                                    | `true`                | Enable non-custom triggers               |
| `closeOnEsc`           | `boolean`                                                    | `true`                | Close on Escape                          |
| `guardFocus`           | `boolean`                                                    | `true`                | Cycle Tab inside the panel               |
| `returnFocusOnClose`   | `boolean`                                                    | `true`                | Restore trigger focus                    |
| `disableFocusListener` | `boolean`                                                    | `true`                | Ignore focus in hover mode               |
| `clickToHide`          | `boolean`                                                    | `false`               | Close after clicking content             |
| `keepDOM`              | `boolean`                                                    | `false`               | Keep content DOM after close             |
| `contentClassName`     | `ClassValue`                                                 | -                     | Class for the inner `.semi-popover` card |
| `class` / `style`      | Vue class / `StyleValue`                                     | -                     | Positioning wrapper class/style          |
| `getPopupContainer`    | `() => HTMLElement`                                          | ConfigProvider / body | Portal container                         |
| `rePosKey`             | `string \| number`                                           | -                     | Request repositioning when changed       |
| `zIndex`               | `number`                                                     | `1030`                | Portal z-index                           |

Events are `@visibleChange`, `@update:visible`, `@clickOutside`, `@escKeydown`, and `@afterClose`. The component ref exposes `focusTrigger()`.

## SSR, RTL, and themes

SSR renders only the trigger; the Portal is created after hydration. Popover has no locale strings. ConfigProvider drives RTL, and fixed Semi tokens provide light/dark colors.
