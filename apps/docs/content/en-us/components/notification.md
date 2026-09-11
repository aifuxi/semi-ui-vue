---
title: 'Notification'
description: 'Notifications are used to actively send message notifications to users.'
locale: 'en-US'
slug: 'notification'
category: 'feedback'
order: 88
englishTitle: 'Notification'
icon: 'doc-notification'
upstream: 'feedback/notification'
---

Notification actively presents asynchronous results or status messages. The Vue port aligns with Semi Design v2.102.0 command methods, six placements, timers, updates, themes, motion, ARIA, and the context-holder API.

## Demos

### How to import

```ts
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/notification.css';
```

### Basic usage

The most basic notification closes automatically after three seconds.

::demo-block{demo="notification/en-US/Basic" title="Basic usage"}
::

### Position

Notifications can appear in six positions. The default is `topRight`.

::demo-block{demo="notification/en-US/Position" title="Position"}
::

### With icons

`success`, `info`, `warning`, and `error` provide default status icons. A Vue VNode can replace the icon.

::demo-block{demo="notification/en-US/Icons" title="With icons"}
::

### Colored background

Set `theme="light"` for a status-tinted background with stronger contrast. The default is `normal`.

::demo-block{demo="notification/en-US/Colored" title="Colored background"}
::

### Custom children with links

Combine Notification with Typography links to provide actions in more involved messages.

::demo-block{demo="notification/en-US/Links" title="Custom children with links"}
::

### Delay

Use `duration` to customize the automatic-close delay. This example closes after ten seconds; the default is three seconds.

::demo-block{demo="notification/en-US/Delay" title="Delay"}
::

### Manual close

Set `duration: 0` to disable automatic close. The example stores each returned id and closes the oldest notification first.

::demo-block{demo="notification/en-US/ManualClose" title="Manual close"}
::

### Update content

Opening an existing id updates the current notification instead of adding another card, and restarts its automatic-close timer.

::demo-block{demo="notification/en-US/Update" title="Update content"}
::

Both pinned upstream languages contain the same eight live examples in the same order, with no language-only or multi-file examples. The first two English snippets misspell `duration` and `position` as `with` and `Position`; the Vue examples use the real public API. To preserve this repository's independent branding, Bytedance copy and Toutiao/Vigo brand icons are replaced with AIFUXI copy and generic Bell/Star icons while retaining the custom-icon and color behavior; every other button and body string stays identical to the pinned source. The link example keeps the pinned fragment structure, and icon-only buttons carry a bilingual `aria-label`. The update example clears pending timers on unmount. All eight examples have passed strict React/Vue visual and behavioral acceptance across both languages, light/dark, and the applicable RTL cases.

## API Reference

Display methods accept an options object and return the notification id:

- `Notification.open(options)`
- `Notification.info(options)`
- `Notification.error(options)`
- `Notification.warning(options)`
- `Notification.success(options)`

Use `Notification.close(id)` to close one notification and `Notification.destroyAll()` to destroy all notifications and the imperative wrapper.

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

Call global configuration before the first display method:

```ts
Notification.config({ position: 'top', top: 24, duration: 5, zIndex: 1200 });
```

| Option     | Type                   | Default    | Description                 |
| ---------- | ---------------------- | ---------- | --------------------------- |
| `bottom`   | `number \| string`     | -          | Bottom offset               |
| `duration` | `number`               | `3`        | Auto-close delay in seconds |
| `left`     | `number \| string`     | -          | Left offset                 |
| `position` | `NotificationPosition` | `topRight` | Default popup placement     |
| `right`    | `number \| string`     | -          | Right offset                |
| `top`      | `number \| string`     | -          | Top offset                  |
| `zIndex`   | `number`               | `1010`     | Wrapper stacking level      |

Imperative notifications share the first wrapper. `getPopupContainer` and `zIndex` are resolved only when that wrapper is created; displaying again after `destroyAll()` resolves them again.

### Local context

`Notification.useNotification()` returns `[notification, NotificationHolder]`. The holder inherits Vue context such as `ConfigProvider` direction.

```vue
<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue/notification';

const [notification, NotificationHolder] = Notification.useNotification();
</script>

<template>
  <NotificationHolder />
  <button @click="notification.success({ title: 'Saved' })">Save</button>
</template>
```

## Accessibility

### ARIA

- Each notification has `role="alert"`.
- When a title is rendered, `aria-labelledby` references its title id.
- The close button is focusable with `Tab` and activatable with `Enter` or `Space`.

Imports and an empty holder are SSR-safe; imperative display methods require a browser.

## Content Guidelines

- Use a short, clear title and avoid unnecessary punctuation.
- Keep the body to one or two complete sentences. Explain the title rather than repeating it, and use correct punctuation.
- Make action copy specific, such as “Check failed tasks,” rather than a generic “Check.”

The pinned upstream chapter uses an internal `NotificationCard` for a static copy example. It is not a public export, so this site retains the writing guidance without presenting it as a public component demo.

## Design Tokens

::token-table{component="notification"}
::

## React → Vue

| Semi React v2.102.0                                    | Vue equivalent                                               |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `Notification.info(options)`                           | `Notification.info(options)`                                 |
| `Notification.open/success/warning/error`              | Same static methods                                          |
| `Notification.close(id)` / `destroyAll()`              | Same static methods                                          |
| `Notification.config(options)`                         | Same static method                                           |
| `const [api, holder] = Notification.useNotification()` | Same tuple; holder is a Vue `Component`                      |
| `ReactNode` title/content/icon                         | Vue `VNodeChild`                                             |
| JSX `<>{holder}</>`                                    | Template `<NotificationHolder />` or `h(NotificationHolder)` |
| React context inherited at holder                      | Vue provide/inject context inherited at holder               |

The imperative API does not become `v-model` or component slots. `onCloseClick(id)` runs before `onClose()`, and the close button stops the card's `onClick`. External `close(id)` and `destroyAll()` removal do not trigger the individual notification's `onClose`, matching the pinned Adapter. See the [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/notification/alignment.md) for complete evidence and deviation decisions.
