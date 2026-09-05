---
title: '`_base` infrastructure'
description: '`_base` exposes the public Vue boundary for the Foundation architecture pinned to Semi'
locale: 'en-US'
slug: '_base'
category: 'other'
order: 100
englishTitle: '`_base` infrastructure'
---

`_base` exposes the public Vue boundary for the Foundation architecture pinned to Semi
v2.102.0. It does not render standalone UI. Application components should continue to use the
Composition API and only reach for this module when implementing a custom Foundation adapter.

## Import

```ts
import { BaseComponent, BaseFoundation, useBaseComponent } from '@aifuxi/semi-ui-vue/_base';
import type { BaseProps, ValidateStatus } from '@aifuxi/semi-ui-vue/_base';
```

## Bind lifecycle in setup

```ts
const controller = useBaseComponent({
  props,
  state: shallowReactive({ visible: true }),
  context: { locale: 'en-US' },
});

controller.foundation = new CustomFoundation(controller.adapter);
```

`useBaseComponent` calls `foundation.init()` after mount, then calls `foundation.destroy()` and
clears the cache during unmount. `isControlled(key)` uses an own-property check, so an explicitly
passed `undefined` value is still controlled.

## Subpaths

- `/_base`: complete public entry.
- `/_base/base`: base props, motion, and `ValidateStatus` types.
- `/_base/base-foundation`: pinned `BaseFoundation` public facade.
- `/_base/base-component`: controller and `useBaseComponent`.
- `/_base/component-utils`: Vue component, VNode, HTMLElement, and empty-child checks.

The module owns no DOM or CSS. The default theme root already includes the pinned base styles.

## React → Vue

## 类继承 → Composition API 控制器

React 组件可以继承 `BaseComponent` 并依赖类生命周期。Vue 不使用 Options API 或类组件
继承，改为在 `<script setup>` 中组合控制器：

```ts
const controller = useBaseComponent({ props, state });
controller.foundation = new CustomFoundation(controller.adapter);
```

| React v2.102.0          | Vue                               | 说明                           |
| ----------------------- | --------------------------------- | ------------------------------ |
| `extends BaseComponent` | `useBaseComponent(...)`           | 生命周期由 composable 绑定     |
| `componentDidMount`     | `mount` / Vue `onMounted`         | 调用 Foundation `init`         |
| `componentWillUnmount`  | `unmount` / Vue `onBeforeUnmount` | 调用 `destroy` 并清 cache      |
| `this.props`            | readonly Vue props                | props 向下，只读               |
| `this.state`            | shallow/reactive state            | adapter 的 `setState` 原位合并 |
| `className`             | `class`                           | Vue 原生 attribute             |
| `children`              | 默认 slot                         | Vue 原生内容分发               |
| `reactUtils`            | `component-utils`                 | 使用 Vue component/VNode 判定  |

`BaseFoundation` 名称、adapter 方法职责、受控判定、cache 和 `data-*` 转发保持不变。
