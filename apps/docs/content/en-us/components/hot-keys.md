---
title: 'HotKeys'
description: 'used to facilitate the customization of keyboard shortcut'
locale: 'en-US'
slug: 'hot-keys'
category: 'plus'
order: 33
englishTitle: 'HotKeys'
icon: 'doc-configprovider'
upstream: 'plus/hotkeys'
---

HotKeys uses the shortcut state machine pinned to Semi Design v2.102.0 while rendering the same
keyboard-hint structure. A combination must contain exactly one non-modifier key and may include
Meta, Shift, Alt, and Control.

```ts
import { HotKeys } from '@aifuxi/semi-ui-vue/hot-keys';
import '@aifuxi/semi-theme-default/hot-keys.css';
```

## Demos

### Basic usage

Press Control+Shift+A to open the modal. The default listener is document.body; unconfigured modifiers must be released.

::demo-block{demo="hot-keys/en-US/Basic" title="Basic usage"}
::

### Custom content

content displays Ctrl, Shift and B without changing the Control+Shift+B shortcut.

::demo-block{demo="hot-keys/en-US/Content" title="Custom content"}
::

### Custom rendering

The default slot replaces React render with a Tag for Control+R. Like the upstream example, it does not prevent the browser’s default shortcut action.

::demo-block{demo="hot-keys/en-US/Render" title="Custom rendering"}
::

### Prevent default behavior

Declare Meta+S and Control+S separately with preventDefault enabled.

::demo-block{demo="hot-keys/en-US/PreventDefault" title="Prevent default behavior"}
::

### Custom listener target

The Input component exposes its actual DOM through input. Press Control+Q while the input is focused; keys outside it do not trigger the shortcut.

::demo-block{demo="hot-keys/en-US/ListenerTarget" title="Custom listener target"}
::

## Basic usage

The ordinary key is matched through `KeyboardEvent.code`, so letter casing does not change the
combination. Modifiers that are not configured must also be released: Control+Shift+S does not
match a Control+S shortcut.

## Custom listener target

The default target is `document.body`. The target is resolved on mount and is not rebound when the
getter changes, matching the pinned v2.102.0 Adapter. Unmount removes the listener from the target
that was actually registered.

## Custom rendering

The default slot is the Vue-native mapping of React's `render` prop. It replaces the generated key
caps while retaining the `.semi-hotKeys` root.

```vue
<HotKeys :hot-keys="[HotKeys.Keys.Control, HotKeys.Keys.K]">
  <strong>Open command palette</strong>
</HotKeys>
```

## API

| Property              | Description                                                   | Type                                     | Default         |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------- | --------------- |
| `hotKeys`             | Valid combination with exactly one ordinary key               | `HotKeysKey[]`                           | required        |
| `content`             | Display labels; does not change the actual combination        | `string[]`                               | `hotKeys`       |
| `getListenerTarget`   | Returns the keydown listener target                           | `() => HTMLElement \| null \| undefined` | `document.body` |
| `preventDefault`      | Prevents the matched event's default action                   | `boolean`                                | `false`         |
| `mergeMetaCtrl`       | v2.102.0 compatibility prop; a no-op in the pinned Foundation | `boolean`                                | `false`         |
| `class` / `className` | Root classes                                                  | `HTMLAttributes['class']`                | -               |
| `style`               | Root inline style                                             | `StyleValue`                             | -               |

Events are `hotKey(event: KeyboardEvent)` and `click(event: MouseEvent)`. The default slot replaces
the key-cap display. The component does not add focusability or an ARIA role; pass business-specific
`role`, `aria-*`, and `data-*` attributes when needed.

See the [alignment matrix](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/hot-keys/alignment.md) for event order, SSR, dark mode, RTL, and accepted
deviations, and the [migration guide](#react-vue) for React mappings.

## React → Vue

| React v2.102.0                              | Vue 3                                         | Notes                                                       |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| `<HotKeys hotKeys={keys} onHotKey={run} />` | `<HotKeys :hot-keys="keys" @hot-key="run" />` | Same key values, event payload and strict modifier matching |
| `content={['Ctrl', 'K']}`                   | `:content="['Ctrl', 'K']"`                    | Only changes labels                                         |
| `render={<Tag>...</Tag>}`                   | Default slot                                  | ReactNode maps to a Vue slot                                |
| `render={() => node}`                       | Default slot                                  | Slot evaluated once                                         |
| `onClick={run}`                             | `@click="run"`                                | Receives the native MouseEvent                              |
| `className` / `style`                       | `class` / `style`; also accepts `className`   | Native Vue attributes are forwarded                         |
| `HotKeys.Keys.Control`                      | `HotKeys.Keys.Control`                        | Same static key table                                       |

The upstream type makes hotKeys optional, but the pinned Foundation requires a valid combination on mount. Vue marks it required to express that runtime contract at compile time.

The pinned v2.102.0 Foundation reads mergeMetaCtrl but does not use it. Even when true, Meta does not match a Control combination; Vue preserves that behavior.

The default listener is document.body. Use getListenerTarget to select an HTMLElement. The component does not focus it or add role/tabindex; configure focusability when a local shortcut area needs it.

## Additional Vue examples

These examples supplement Vue API usage and are not counted as upstream demo mappings.

::demo-block{demo="hot-keys/en-US/Example1" title="Example1"}
::

::demo-block{demo="hot-keys/en-US/Example2" title="Example2"}
::
