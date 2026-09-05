---
title: '`_base` 基础设施'
description: '`_base` 提供固定 Semi v2.102.0 Foundation 架构在 Vue 中的公共基础边界。它不渲染'
locale: 'zh-CN'
slug: '_base'
category: 'other'
order: 100
englishTitle: '`_base`'
---

`_base` 提供固定 Semi v2.102.0 Foundation 架构在 Vue 中的公共基础边界。它不渲染
独立 UI；业务组件继续使用 Composition API，只有需要构造自定义 Foundation adapter
时才直接使用这里的控制器和类型。

## 导入

```ts
import { BaseComponent, BaseFoundation, useBaseComponent } from '@aifuxi/semi-ui-vue/_base';
import type { BaseProps, ValidateStatus } from '@aifuxi/semi-ui-vue/_base';
```

## 在 setup 中绑定生命周期

```ts
const controller = useBaseComponent({
  props,
  state: shallowReactive({ visible: true }),
  context: { locale: 'zh-CN' },
});

controller.foundation = new CustomFoundation(controller.adapter);
```

`useBaseComponent` 在组件挂载后调用 `foundation.init()`，卸载时调用
`foundation.destroy()` 并清空 cache。`isControlled(key)` 使用 own-property 判断，显式
传入 `undefined` 也属于受控。

## 子路径

- `/_base`：完整公开入口。
- `/_base/base`：基础 props、动效与 `ValidateStatus` 类型。
- `/_base/base-foundation`：固定 `BaseFoundation` 公共 facade。
- `/_base/base-component`：控制器与 `useBaseComponent`。
- `/_base/component-utils`：Vue 组件、VNode、HTMLElement 与空 children 判定。

该模块没有专属 DOM 或 CSS；默认主题根入口已经包含固定 base 样式。

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
