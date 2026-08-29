# Modal

Modal presents a task above the current page when the user must confirm or provide information. This implementation is aligned exclusively with the local Semi Design v2.102.0 source and preserves the `.semi-modal*`, Portal, focus, mask, motion, RTL, and theme contracts.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Modal } from '@workspace/ui';

const visible = ref(false);
</script>

<template>
  <Button @click="visible = true">Open</Button>
  <Modal v-model:visible="visible" title="Publish changes" @ok="visible = false">
    Publish these changes now?
  </Modal>
</template>
```

The `#title`, `#header`, `#body`, default, `#footer`, `#icon`, and `#closeIcon` slots replace their matching content props. Pass `footer=null` explicitly to remove the default footer.

## Promise and imperative APIs

When `onOk` or `onCancel` returns a Promise, the default footer exposes its pending state. Imperative confirm dialogs close after resolution and stay open after rejection.

```ts
import { Modal } from '@workspace/ui';

const handle = Modal.confirm({
  title: 'Delete project',
  content: 'This action cannot be undone.',
  onOk: async () => save(),
});

handle.update({ content: 'Checking dependencies…' });
```

Use `const [modal, ContextHolder] = Modal.useModal()` and render `ContextHolder` when an imperative dialog needs the current ConfigProvider context.

## API

| Prop                                                                  | Type                                             | Default         | Description                               |
| --------------------------------------------------------------------- | ------------------------------------------------ | --------------- | ----------------------------------------- |
| `visible`                                                             | `boolean`                                        | `false`         | Visibility; supports `v-model:visible`    |
| `title` / `header` / `footer` / `content`                             | `VNodeChild`                                     | -               | Content regions with matching slots       |
| `closable` / `closeOnEsc` / `mask` / `maskClosable` / `hasCancel`     | `boolean`                                        | `true`          | Close, mask, and default-footer behavior  |
| `centered` / `fullScreen` / `maskFixed` / `keepDOM` / `preventScroll` | `boolean`                                        | `false`         | Layout, retained DOM, and scroll behavior |
| `lazyRender` / `motion`                                               | `boolean`                                        | `true`          | First render and transitions              |
| `size`                                                                | `'small' \| 'medium' \| 'large' \| 'full-width'` | `'small'`       | Preset size                               |
| `width` / `height`                                                    | `string \| number`                               | -               | Custom dimensions                         |
| `okText` / `cancelText`                                               | `string`                                         | Locale          | Button labels                             |
| `okType`                                                              | `ButtonType`                                     | `'primary'`     | Confirm button type                       |
| `confirmLoading` / `cancelLoading`                                    | `boolean`                                        | `false`         | Explicit button loading state             |
| `getPopupContainer`                                                   | `() => HTMLElement`                              | `document.body` | Portal container                          |
| `zIndex`                                                              | `number`                                         | `1000`          | Portal stacking level                     |
| `modalRender`                                                         | `(dialog) => VNodeChild`                         | -               | Wraps the dialog VNode                    |

Events: `update:visible`, `onOk`, `onCancel`, and `afterClose` / `onAfterClose`. Static methods: `confirm`, `info`, `success`, `warning`, `error`, `destroyAll`, and `useModal`.

## Accessibility, Portal, and SSR

The dialog preserves `role="dialog"`, `aria-modal`, and title/body relationships. Opening creates a focus trap and closing restores the previous focus. ESC, mask, and unmount paths clean document listeners. The public entry is SSR-safe; the Teleport target is resolved after client mount and hydration is covered.

See the [alignment matrix](./alignment.md) for source evidence, defaults, event ordering, and the visual matrix.
