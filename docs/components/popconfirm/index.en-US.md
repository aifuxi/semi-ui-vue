# Popconfirm

Use Popconfirm before destructive or irreversible actions. This Vue implementation is aligned with the pinned Semi Design v2.102.0 source and reuses Popover for Portal placement, keyboard handling, and focus management.

## Basic usage

```vue
<script setup lang="ts">
import { Button, Popconfirm } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/popconfirm.css';

function confirm(): void {
  console.log('confirmed');
}
</script>

<template>
  <Popconfirm title="Save this change?" content="This change cannot be undone." @confirm="confirm">
    <Button>Save</Button>
  </Popconfirm>
</template>
```

## Promise loading

`confirm` and `cancel` listeners may return a Promise. The panel closes after resolution; rejection keeps it open and clears the corresponding loading state.

```vue
<Popconfirm
  title="Delete this record?"
  content="The record cannot be restored."
  :on-confirm="() => removeRecord()"
  ok-type="danger"
>
  <Button type="danger">Delete</Button>
</Popconfirm>
```

Both `@confirm="removeRecord"` and `:on-confirm="removeRecord"` are Vue event listeners. When Promise behavior is required, avoid a wrapper expression that discards the return value.

## Controlled visibility

```vue
<Popconfirm v-model:visible="visible" trigger="custom" title="Continue?" content="Confirm first">
  <Button @click="visible = !visible">Toggle</Button>
</Popconfirm>
```

## Custom content and focus

```vue
<Popconfirm title="Submit note" :cancel-button-props="{ autoFocus: true }">
  <template #content="{ initialFocusRef }">
    <input :ref="initialFocusRef" placeholder="Note" />
  </template>
  <Button>Open</Button>
</Popconfirm>
```

Button autofocus priority is cancel, then confirm. The scoped `initialFocusRef` is managed by the underlying focus guard. Uncontrolled click mode returns focus to the trigger after close; explicit `visible` forces the custom trigger mode, matching the React baseline, and does not restore trigger focus automatically.

## API

| Prop                                  | Type                    | Default                              | Description                                          |
| ------------------------------------- | ----------------------- | ------------------------------------ | ---------------------------------------------------- |
| `visible`                             | `boolean`               | -                                    | Controlled visibility; supports `v-model:visible`    |
| `defaultVisible`                      | `boolean`               | `false`                              | Initial uncontrolled visibility                      |
| `disabled`                            | `boolean`               | `false`                              | Renders only the trigger                             |
| `title` / `content` / `icon`          | `VNodeChild`            | - / - / warning icon                 | Content props with matching slots                    |
| `okText` / `cancelText`               | `string`                | locale                               | Action labels                                        |
| `okType` / `cancelType`               | `ButtonType`            | `primary` / `tertiary`               | Button types                                         |
| `okButtonProps` / `cancelButtonProps` | `PopconfirmButtonProps` | -                                    | Forwarded Button options with `autoFocus`            |
| `showCloseIcon`                       | `boolean`               | `true`                               | Shows the top-right close button                     |
| `position`                            | `PopoverPosition`       | LTR `bottomLeft` / RTL `bottomRight` | Popup placement                                      |
| `trigger`                             | `PopoverTrigger`        | `click`                              | Trigger mode; controlled mode uses custom internally |
| `showArrow`                           | `boolean`               | `false`                              | Shows the arrow                                      |
| `motion`                              | `boolean`               | `true`                               | Enables motion                                       |
| `getPopupContainer`                   | `() => HTMLElement`     | `document.body`                      | Portal container; provide a positioning context      |
| `zIndex`                              | `number`                | `1030`                               | Portal z-index                                       |

Events: `confirm(event)`, `cancel(event)`, `visibleChange(visible)`, `update:visible`, `clickOutside(event)`, and `escKeydown(event)`.

Slots: the default slot is the trigger; `title` and `icon`; `content` receives `{ initialFocusRef }`.

## Accessibility

- The trigger receives `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`.
- Enter/Space can activate the panel. Escape, the focus guard, and focus restoration in uncontrolled click mode follow Popover.
- For destructive actions, prefer `cancelButtonProps.autoFocus: true`.

## SSR

The server renders only the trigger and does not create a Portal. Import and SSR rendering do not access the DOM; the confirmation layer is created after hydration.
