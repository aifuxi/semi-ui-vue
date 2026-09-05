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

## Basic usage

::demo-block{demo="hot-keys/en-US/Example1" title="Basic usage"}
::

The ordinary key is matched through `KeyboardEvent.code`, so letter casing does not change the
combination. Modifiers that are not configured must also be released: Control+Shift+S does not
match a Control+S shortcut.

## Custom listener target

::demo-block{demo="hot-keys/en-US/Example2" title="Custom listener target"}
::

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

| React v2.102.0                              | Vue 3                                         | 说明                                      |
| ------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| `<HotKeys hotKeys={keys} onHotKey={run} />` | `<HotKeys :hot-keys="keys" @hot-key="run" />` | 组合值、事件 payload 和严格修饰键语义不变 |
| `content={['Ctrl', 'K']}`                   | `:content="['Ctrl', 'K']"`                    | 只改变显示文本                            |
| `render={<Tag>...</Tag>}`                   | 默认 slot                                     | ReactNode 映射为 Vue slot                 |
| `render={() => node}`                       | 默认 slot                                     | slot 只求值一次                           |
| `onClick={run}`                             | `@click="run"`                                | Vue 回调接收原生 `MouseEvent`             |
| `className` / `style`                       | `class` / `style`，也兼容 `className`         | Vue 原生 attrs 可继续透传                 |
| `HotKeys.Keys.Control`                      | `HotKeys.Keys.Control`                        | 静态键表保持同名                          |

`hotKeys` 在上游类型中可选，但固定 Foundation 在 mounted 时要求合法组合；Vue 声明
将它标为必填，以便在编译期表达真实运行时契约。

固定 v2.102.0 Foundation 虽读取 `mergeMetaCtrl`，但没有使用该值。因此即使设为
`true`，Meta 也不会匹配 Control 组合，Vue 版本不擅自引入更新版本语义。

组件默认监听 `document.body`，也可用 `getListenerTarget` 限定到某个 HTMLElement。
它不自动聚焦目标，不增加 role/tabindex；需要可聚焦局部快捷键区时由调用方设置。
