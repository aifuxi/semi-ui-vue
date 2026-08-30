# Toast

Toast provides brief and timely feedback after an operation. The Vue port follows Semi Design v2.102.0 and preserves the `.semi-toast-*` DOM/classes, theme tokens, imperative methods, factory instances, and context holder.

## Basic usage

```ts
import { Toast } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/toast.css';

Toast.success('Saved');

const id = Toast.warning({
  content: 'The access credential expires soon',
  duration: 0,
  theme: 'light',
});

Toast.close(id);
```

`info`, `success`, `warning`, and `error` accept either a string or an options object and return an id. Calling a method again with the same id updates the existing Toast and restarts its timer.

```ts
const id = Toast.info({ content: 'Syncing', duration: 10 });
Toast.success({ id, content: 'Sync complete', duration: 3 });
```

## Stack and placement

Use `stack` for multiple Toasts on the same screen; hovering expands the stack. Numeric offsets become pixels, while CSS strings are preserved.

```ts
Toast.config({ top: 24, zIndex: 1200 });
Toast.info({ content: 'First', stack: true });
Toast.warning({ content: 'Second', stack: true });
```

Call `Toast.config` before the current instance first opens. Once the wrapper exists, `zIndex` and `getPopupContainer` do not migrate it; explicitly supplied offsets can still update it.

## Vue context holder

Call `useToast` inside `<script setup>` and render the returned holder where it should inherit ConfigProvider context.

```vue
<script setup lang="ts">
import { useToast } from '@aifuxi/semi-ui-vue';

const [toast, ToastHolder] = useToast();
const submit = () => toast.open({ content: 'Processing', duration: 0 });
</script>

<template>
  <ToastHolder />
  <button type="button" @click="submit">Submit</button>
</template>
```

The holder API also exposes `open(options)` for the `default` type.

## Independent factories

Use `ToastFactory.create` for a different container or defaults. Each instance owns an isolated wrapper, configuration, and destroy boundary.

```ts
import { ToastFactory } from '@aifuxi/semi-ui-vue';

const LocalToast = ToastFactory.create({
  getPopupContainer: () => document.querySelector('#toast-host') as HTMLElement,
  top: 12,
});

LocalToast.info('Local feedback');
LocalToast.destroyAll();
```

## API

| Option                  | Type                        | Default         | Description                                |
| ----------------------- | --------------------------- | --------------- | ------------------------------------------ |
| `content`               | `VNodeChild`                | `''`            | Toast content                              |
| `icon`                  | `VNodeChild`                | by type         | Custom icon                                |
| `showClose`             | `boolean`                   | `true`          | Shows the close button                     |
| `textMaxWidth`          | `number \| string`          | `450`           | Maximum content width                      |
| `duration`              | `number`                    | `3`             | Auto-close delay in seconds; 0 disables it |
| `theme`                 | `'normal' \| 'light'`       | `'normal'`      | Fill style                                 |
| `stack`                 | `boolean`                   | `false`         | Stacks multiple Toasts                     |
| `direction`             | `'ltr' \| 'rtl'`            | context or LTR  | Text direction                             |
| `id`                    | `string \| number`          | generated       | Custom id; the same id updates             |
| `onClose`               | `() => void`                | -               | Close callback                             |
| `className`             | Vue class value             | -               | Class on the Toast root                    |
| `style`                 | `StyleValue`                | -               | Style on the Toast root                    |
| `top/right/bottom/left` | `number \| string`          | -               | Wrapper offsets                            |
| `zIndex`                | `number`                    | `1010`          | Initial wrapper z-index                    |
| `getPopupContainer`     | `() => HTMLElement \| null` | `document.body` | Initial wrapper parent                     |

Methods: `Toast.info`, `success`, `warning`, `error`, `close`, `destroyAll`, `config`, `ToastFactory.create`, and `useToast` / `Toast.useToast`.

## Accessibility and SSR

Each Toast has `role="alert"` and a `{type} type` aria-label. The close control reuses Button's native keyboard and focus behavior; Toast does not capture Escape or move focus.

Both the root entry and `@aifuxi/semi-ui-vue/toast` are SSR-safe to import. Imperative methods are browser-only, while an empty holder can render on the server.
