# Modal

Modal aligns with Semi Design v2.102.0 and keeps the `.semi-modal*` DOM/classes, Portal, mask, scroll lock, focus trap, motion and imperative API contracts. The public entry is the `@aifuxi/semi-ui-vue` root export and the `@aifuxi/semi-ui-vue/modal` subpath, with the named `Modal` (including statics) and `useModal` exports; the default export is the same object.

## Basic usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Modal } from '@aifuxi/semi-ui-vue';

const visible = ref(false);
</script>

<template>
  <Modal v-model:visible="visible" title="Title" @ok="visible = false"> Body content </Modal>
</template>
```

`v-model:visible` binds `visible`; every close path (mask, ESC, close button, cancel button) emits `update:visible(false)`, while `ok`/`cancel` decide nothing on their own. When `onOk`/`onCancel` returns a Promise the matching button enters loading, and a rejection keeps the dialog open.

## Size, full screen and centering

| Need            | Usage                                               | Notes                                                            |
| --------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| Preset size     | `size="small" / "medium" / "large" / "full-width"`  | Defaults to `small`; the first three map to pinned width classes |
| Custom size     | `:width` / `:height` (numbers as px, strings as-is) | Applied to the `.semi-modal` wrapper, not the content node       |
| Full screen     | `fullScreen`                                        | Overrides the preset size and adds the full-screen class         |
| Vertical center | `centered`                                          | Defaults to `false`; centering uses flex on the wrapper          |

## Custom structure

- `title` / `icon` / `header` / `footer` / `closeIcon` all accept a same-named slot; slots win, and function/VNode props stay available.
- No header node is rendered when no header content exists; an explicit `footer={null}` hides the default buttons and removing it restores them.
- `okText` / `cancelText` fall back to LocaleProvider `Modal.ok/cancel`; `okButtonProps` / `cancelButtonProps` forward to Button, `okType` defaults to `primary`, and `footerFill` stretches both buttons.
- `hasCancel={false}` renders only the confirm button; `cancelLoading` / `confirmLoading` control each button individually; `closable={false}` hides the close button.

## Imperative API

```ts
import { Modal } from '@aifuxi/semi-ui-vue';

const handle = Modal.confirm({
  title: 'Delete?',
  content: 'This action cannot be undone',
  onOk: async () => {
    await remove();
  },
});

handle.update({ title: 'Updated' });
handle.destroy();
Modal.destroyAll();
```

`Modal.confirm / info / success / warning / error` return `{ destroy(), update(config) }`; `Modal.useModal()` returns `[methods, holder]`, and rendering the `holder` inside your component tree lets imperative dialogs inherit the current ConfigProvider/Locale context.

## Portal, mask and scrolling

- `getPopupContainer` selects the mount target and defaults to `document.body`; non-body targets do not lock body scrolling.
- `mask` / `maskClosable` / `maskFixed` control mask rendering, click-to-close and fixed positioning; `maskStyle` customizes the mask.
- `closeOnEsc` defaults to `true`; `preventScroll` is forwarded to focus calls; `zIndex` defaults to `1000`.
- `keepDOM` keeps the closed DOM, `lazyRender` (default `true`) renders content only after the first open, and `afterClose`/`onAfterClose` fire once the hidden state is reached.

## API

### Modal Props

| Prop                                                             | Type                                             | Default                             |
| ---------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------- |
| `visible`                                                        | `boolean`                                        | `false`                             |
| `size`                                                           | `'small' \| 'medium' \| 'large' \| 'full-width'` | `'small'`                           |
| `width` / `height`                                               | `string \| number`                               | -                                   |
| `centered` / `fullScreen`                                        | `boolean`                                        | `false`                             |
| `title` / `icon` / `header` / `footer` / `content` / `closeIcon` | `VNodeChild`                                     | -                                   |
| `closable` / `closeOnEsc`                                        | `boolean`                                        | `true`                              |
| `mask` / `maskClosable` / `maskFixed`                            | `boolean`                                        | `true` / `true` / `false`           |
| `maskStyle` / `bodyStyle` / `modalContentClass`                  | style / class                                    | -                                   |
| `hasCancel` / `footerFill`                                       | `boolean`                                        | `true` / `false`                    |
| `okText` / `cancelText` / `okType`                               | `string` / `string` / `ButtonType`               | Locale / Locale / `'primary'`       |
| `okButtonProps` / `cancelButtonProps`                            | `ButtonProps`                                    | -                                   |
| `confirmLoading` / `cancelLoading`                               | `boolean`                                        | -                                   |
| `motion` / `keepDOM` / `lazyRender` / `preventScroll`            | `boolean`                                        | `true` / `false` / `true` / `false` |
| `getPopupContainer` / `getContainerContext`                      | `() => HTMLElement` / `() => unknown`            | `document.body` / -                 |
| `modalRender`                                                    | `(dialog: VNodeChild) => VNodeChild`             | -                                   |
| `zIndex`                                                         | `number`                                         | `1000`                              |
| `direction`                                                      | `'ltr' \| 'rtl'`                                 | ConfigProvider                      |
| `class` / `className` / `style`                                  | Vue native class/style and compatible props      | -                                   |
| `onOk` / `onCancel` / `onAfterClose` / `afterClose`              | callbacks                                        | -                                   |

### Slots

`default` (body), `body`, `title`, `header`, `footer`, `icon`, `closeIcon`.

### Events

`update:visible(visible)`.

### Statics and useModal

| API                                            | Signature                                    | Notes                                                          |
| ---------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| `Modal.confirm`                                | `(config: ModalConfirmProps) => ModalHandle` | Confirm dialog with `type: success/info/warning/error/confirm` |
| `Modal.info` / `success` / `warning` / `error` | `(config) => ModalHandle`                    | Matching confirm types                                         |
| `Modal.destroyAll`                             | `() => void`                                 | Closes every imperative dialog                                 |
| `Modal.useModal`                               | `() => [ModalMethods, Component]`            | In-component imperative API; `holder` keeps context            |
| `ModalHandle`                                  | `{ destroy(): void; update(config): void }`  | Handle of one imperative instance                              |

## Accessibility, focus and keyboard

- The dialog keeps `role="dialog"`, `aria-modal="true"`, `aria-labelledby="semi-modal-title"` and `aria-describedby="semi-modal-body"`; without a title no invisible header is rendered.
- Opening records the previous `activeElement`, locks body scrolling (body portal only) and installs a focus trap: `autofocus` or the default cancel button receives focus first, `Tab`/`Shift+Tab` cycle, and the hidden state restores focus.
- `closeOnEsc={false}` removes the ESC path; mask, close button and cancel button are controlled by `maskClosable`/`closable`/`hasCancel`.

## Theme, RTL and SSR

- Classes and tokens follow the pinned `.semi-modal*` surface; the per-component style entry is `@aifuxi/semi-theme-default/modal.css`.
- Motion uses the pinned keyframes (mask fade, content zoom); `motion={false}` jumps straight to the hidden state.
- RTL is driven by ConfigProvider `.semi-modal-rtl` for the close button and content direction; the `direction` prop overrides it.
- Import and SSR render never touch the DOM; the Teleport target, scroll lock, focus trap and observers are created on the client and fully cleaned up on unmount.

## React → Vue

See the [React → Vue mapping](./react-to-vue.md). Full public behavior, visual and release evidence lives in the [alignment matrix](./alignment.md).
