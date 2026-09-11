---
title: 'Toast'
description: "Toast component is used to give timely feedback to user's operations. It could be the result feedback of the operation, such as success, failure, error, warning, etc."
locale: 'en-US'
slug: 'toast'
category: 'feedback'
order: 94
englishTitle: 'Toast'
icon: 'doc-toast'
upstream: 'feedback/toast'
---

Toast provides brief and timely feedback after an operation. The Vue port follows Semi Design v2.102.0 and preserves the `.semi-toast-*` DOM/classes, theme tokens, imperative methods, factory instances, and context holder.

## Demos

### How to import

```ts
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/toast.css';
```

### Basic Usage

Call Toast methods to display feedback. Set `stack: true` to stack multiple Toasts and expand them on hover (since v2.42.0). The second button uses a 10-second leading-only throttle; closing the Toast cancels the throttle so it can open again immediately.

::demo-block{demo="toast/en-US/Basic" title="Basic Usage"}
::

### Other Types

Use `success`, `warning`, and `error` for other feedback types. The success example accepts a string directly.

::demo-block{demo="toast/en-US/Types" title="Other Types"}
::

### Colored Background

Use `theme: 'light'` for a colored background. The default is `normal`.

::demo-block{demo="toast/en-US/Colored" title="Colored Background"}
::

### Stacking styles

The fixed English reference includes this additional demo. Click repeatedly, then hover the Toast stack to expand it.

::demo-block{demo="toast/en-US/Stacking" title="Stacking styles"}
::

### Custom Children with Link

Use Typography for custom single-line and multi-line links.

::demo-block{demo="toast/en-US/Links" title="Custom Children with Link"}
::

### Delay

Set `duration` in seconds. The default is 3 seconds; this example closes after 10 seconds.

::demo-block{demo="toast/en-US/Delay" title="Delay"}
::

### Manual Close

Set `duration: 0` to disable automatic closing. This example saves the returned id, prevents duplicate Toasts, and permits reopening after a manual close.

::demo-block{demo="toast/en-US/ManualClose" title="Manual Close"}
::

### Update Toast Content

Reuse an id to update the existing Toast and restart its close timer. This example changes info to success after one second.

::demo-block{demo="toast/en-US/Update" title="Update Toast Content"}
::

### Destroy all

`Toast.destroyAll()` destroys all Toasts and the wrapper owned by that imperative instance. Destroy independent factory instances separately.

### Consume Context

Call `useToast()` in `<script setup>` and render the returned holder inside the desired Vue context. A separate content component uses `inject` to read Light from `provide`; the message is not computed ahead of time.

::demo-block{demo="toast/en-US/Context" title="Consume Context"}
::

### Create Toast with different configurations

Use `ToastFactory.create(config)` for different defaults or containers. This example isolates the default and custom instances, uses a template ref for the container, and destroys the local instance on unmount.

::demo-block{demo="toast/en-US/Factory" title="Create Toast with different configurations"}
::

A custom container changes the DOM parent, not the fixed positioning. For local layout, set both the container and its `.semi-toast-wrapper` to `position: relative`.

The fixed Chinese reference has nine live demos; English has ten, including Stacking styles at index 4. Shared English button labels are preserved, while links are localized. Bytedance text is replaced with AIFUXI under the independent branding policy. The factory example adds the Toast import missing upstream. The context example omits the unsupported title field and includes its two dependency files in the online editor. All nine demos, plus the English-only Stacking demo, have passed strict React/Vue visual and behavioral acceptance across both languages, light/dark, and the applicable RTL cases.

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
| `onClose`               | `() => void`                | -               | Automatic or close-button callback         |
| `className`             | Vue class value             | -               | Class on the Toast root                    |
| `style`                 | `StyleValue`                | -               | Style on the Toast root                    |
| `top/right/bottom/left` | `number \| string`          | -               | Wrapper offsets                            |
| `zIndex`                | `number`                    | `1010`          | Initial wrapper z-index                    |
| `getPopupContainer`     | `() => HTMLElement \| null` | `document.body` | Initial wrapper parent                     |

Methods: `Toast.info`, `success`, `warning`, `error`, `close`, `destroyAll`, `config`, `ToastFactory.create`, and `useToast` / `Toast.useToast`.

## Config

Call `Toast.config(config)` before the first display. It accepts `top/right/bottom/left`, `duration`, `theme`, `zIndex`, and `getPopupContainer` from the table above. Once created, the wrapper does not change its parent or z-index; explicitly supplied offsets can still update it.

Static methods return string ids; Vue accepts string/number inputs and normalizes them to strings. The upstream docs list number for id, but its public React type is string. Automatic closing and the close button call `onClose`; external `close(id)` and `destroyAll()` do not. Holder methods accept options and create a new entry on every call, and also expose `open(options)`. The static same-id update contract does not apply to the holder.

## Accessibility and SSR

Each Toast has `role="alert"` and a `{type} type` aria-label. The close control reuses Button's native keyboard and focus behavior; Toast does not capture Escape or move focus.

Both the root entry and `@aifuxi/semi-ui-vue/toast` are SSR-safe to import. Imperative methods are browser-only, while an empty holder can render on the server.

## Content Guidelines

- Keep messages short, omit ending periods, and use noun + verb phrasing.
- Offer one clear action such as Retry. Avoid OK, Got it, Dismiss, and Cancel.

| Recommended            | Not recommended                          |
| ---------------------- | ---------------------------------------- |
| Language added         | New language has been added successfully |
| Ticket transfer failed | Can’t transfer ticket                    |
| Retry                  | Dismiss                                  |

The upstream ToastCard illustrations are internal and are not publicly exported; the content rules are retained without inventing a public component.

## Design Tokens

::token-table{component="toast"}
::

## React → Vue

| React v2.102.0                           | Vue 3.5+                           | Notes                                                    |
| ---------------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `Toast.info('Saved')`                    | `Toast.info('Saved')`              | String shorthand is unchanged                            |
| `Toast.success(options)`                 | `Toast.success(options)`           | Returns an id; reuse it to update                        |
| `Toast.close(id)`                        | `Toast.close(id)`                  | Imperative closing is unchanged                          |
| `Toast.config(config)`                   | `Toast.config(config)`             | Call before the first display                            |
| `ToastFactory.create(config)`            | `ToastFactory.create(config)`      | Returns an isolated Vue imperative instance              |
| `const [api, holder] = Toast.useToast()` | `const [api, Holder] = useToast()` | Returns a renderable Vue Component                       |
| `{holder}`                               | `<Holder />`                       | Place the holder inside the desired context              |
| `ReactNode` content/icon                 | `VNodeChild` content/icon          | Use Vue VNodes or components                             |
| React context direction                  | `ConfigProvider` direction         | Holder inherits context; static instances default to LTR |

Vue does not expose React component refs, render props, or ReactElement. Toast is an imperative feedback API and has no v-model binding.
