# Notification

Notification actively presents asynchronous results or status messages. The Vue port aligns with Semi Design v2.102.0 command methods, six placements, timers, updates, themes, motion, ARIA, and the context-holder API.

## Basic usage

```ts
import { Notification } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/notification.css';

const id = Notification.info({
  title: 'Task completed',
  content: '400 tasks succeeded and 600 tasks failed.',
});

Notification.close(id);
```

`open` creates the default type. `info`, `success`, `warning`, and `error` add their pinned default icon and status color. Every display method returns the notification id.

## Update an existing notification

Opening an existing id updates the current DOM instead of adding another card and restarts its automatic-close timer.

```ts
const id = Notification.open({ title: 'Working', content: 'Synchronizing data', duration: 10 });
Notification.open({ id, title: 'Complete', content: 'Data is up to date', duration: 3 });
```

## Placement, theme, and container

```ts
Notification.warning({
  title: 'Configuration expiring',
  content: 'Refresh the credential within four days.',
  position: 'bottomLeft',
  theme: 'light',
  getPopupContainer: () => document.querySelector('#notification-root')!,
});
```

Placements are `top`, `topLeft`, `topRight`, `bottom`, `bottomLeft`, and `bottomRight`. Imperative notifications share the first wrapper. `getPopupContainer` and `zIndex` are resolved only when that wrapper is created; a new wrapper resolves them again after `destroyAll()`.

## Global configuration

```ts
Notification.config({ position: 'top', top: 24, duration: 5, zIndex: 1200 });
```

Precedence is per-call options, `semiGlobal.config.overrideDefaultProps.Notification`, then `Notification.config` and pinned defaults.

## Local context

```vue
<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue';

const [notification, NotificationHolder] = Notification.useNotification();
const show = () => notification.success({ title: 'Saved', content: 'Settings are active.' });
</script>

<template>
  <NotificationHolder />
  <button type="button" @click="show">Save</button>
</template>
```

The holder inherits Vue context such as `ConfigProvider` direction. The pinned v2.102.0 defaults already set `topRight`; RTL changes card direction, but callers should explicitly choose `topLeft` when the placement must mirror.

## API

| Property            | Type                   | Default         | Description                                |
| ------------------- | ---------------------- | --------------- | ------------------------------------------ |
| `content`           | `VNodeChild`           | `''`            | Notification body                          |
| `duration`          | `number`               | `3`             | Auto-close delay in seconds; 0 disables it |
| `getPopupContainer` | `() => HTMLElement`    | `document.body` | Parent of the first imperative wrapper     |
| `icon`              | `VNodeChild`           | -               | Custom leading icon                        |
| `id`                | `string`               | generated       | Reuse an id to update a notification       |
| `position`          | `NotificationPosition` | `topRight`      | Popup placement                            |
| `showClose`         | `boolean`              | `true`          | Whether the close button is rendered       |
| `theme`             | `'normal' \| 'light'`  | `normal`        | Background treatment                       |
| `title`             | `VNodeChild`           | `''`            | Notification title                         |
| `zIndex`            | `number`               | `1010`          | Layer of the first wrapper                 |
| `onClick`           | `(event) => void`      | -               | Card click callback                        |
| `onClose`           | `() => void`           | -               | Auto-close or close-button callback        |
| `onCloseClick`      | `(id) => void`         | -               | Close-button callback                      |

Static methods are `open`, `info`, `success`, `warning`, `error`, `close`, `destroyAll`, `config`, and `useNotification`.

## Accessibility and SSR

Each notification has `role="alert"`; a rendered title is connected through `aria-labelledby`. The close Button remains keyboard focusable and activatable. Root/subpath imports and an empty holder are SSR-safe; imperative display methods require a browser.

See the [alignment matrix](./alignment.md) and [React → Vue migration](./react-to-vue.md) for source evidence and event ordering.
