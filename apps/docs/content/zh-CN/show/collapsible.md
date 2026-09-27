---
title: 'Collapsible 折叠'
description: '行为组件，是一个用于展开或折叠内容的容器。'
type: 'show'
order: 68
icon: 'doc-collapsible'
---

## 使用场景

- `Collapsible` 是一个行为组件，默认开启动画效果。它被用于 Semi 的各种组件中，如：`Navigation`， `Collapse`, `Tree`， `TreeSelect`，以及 `Typography` 中。
- 当上述组件不能满足需求或者需要自定义一些折叠行为时，可以使用 `Collapsible` 来包裹需要展开或者折叠的内容。

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/collapsible` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-collapsible-1" title="如何引入" kind="import" />

### 基本用法

通过 `isOpen` 来控制内容的展开或者折叠。

<DemoBlock id="zh-CN-show-collapsible-2" title="基本用法" kind="live" />

### 自定义动画时间

通过 `duration` 设置动画展开或者折叠的时间，也可以通过 `motion` 来关闭动画。

<DemoBlock id="zh-CN-show-collapsible-3" title="自定义动画时间" kind="live" />

### 嵌套使用

<DemoBlock id="zh-CN-show-collapsible-4" title="嵌套使用" kind="live" />

### 自定义折叠高度

可以使用 collapseHeight 自定义收起的高度

<DemoBlock id="zh-CN-show-collapsible-5" title="自定义折叠高度" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/collapsible/types.ts` 的公开类型为准。

#### Vue 用法

- `isOpen` 是单向受控 prop；组件不提供 `v-model`，由调用方更新展开状态。
- `lazyRender=true` 需配合 `keepDOM`：首次关闭时不挂载内容，打开后保留 DOM。

#### Vue 事件

**Collapsible**

| 事件      | 参数 | 说明                     |
| --------- | ---- | ------------------------ |
| motionEnd | []   | 展开或折叠过渡完成后触发 |

#### Vue 插槽

**Collapsible**

| 插槽    | 作用域参数 | 说明             |
| ------- | ---------- | ---------------- |
| default | {}         | 展开或折叠的内容 |

| 属性                   | 说明                                                                                                                | 类型                    | 默认值  | 版本   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------- | ------ |
| class                  | Vue 原生类名                                                                                                        | HTMLAttributes['class'] | —       |        |
| className              | 类名                                                                                                                | HTMLAttributes['class'] | -       | 0.34.0 |
| collapseHeight         | 折叠高度                                                                                                            | number                  | 0       | 1.0.0  |
| collapseHeightAdaptive | 当内容高度小于 collapseHeight 时，是否自适应内容高度。为 true 时，收起状态高度为 Math.min(内容高度, collapseHeight) | boolean                 | false   | 2.77.0 |
| duration               | 动画执行的时间                                                                                                      | number                  | 250     | -      |
| fade                   | 是否开启淡入淡出                                                                                                    | boolean                 | false   | 2.21.0 |
| id                     | id                                                                                                                  | string                  | -       | 2.3.0  |
| isOpen                 | 是否展开内容区域                                                                                                    | boolean                 | `false` | -      |
| keepDOM                | 是否保留隐藏的面板 DOM 树，默认销毁                                                                                 | boolean                 | `false` | 0.25.0 |
| lazyRender             | 配合 keepDOM 使用，为 true 时挂载时不会渲染组件                                                                     | boolean                 | `false` | 2.54.0 |
| motion                 | 是否开启动画                                                                                                        | boolean                 | `true`  | -      |
| reCalcKey              | 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算                                               | number \| string        | -       | 1.5.0  |
| style                  | 样式                                                                                                                | StyleValue              | -       | 0.34.0 |

## Accessibility

### ARIA

- Collapsible 具有 `id` prop，传入的值会被设置为 wrapper 元素的id, 可以配合其他组件的 `aria-controls` 指明控制关系, 见下方使用示例。

<DemoBlock id="zh-CN-show-collapsible-6" title="ARIA" kind="code" />

## FAQ

- 为什么使用 Collapsible 没有正常展开?
  检查 Collapsible 父级是否设置 display:none，此时因为无法拿到节点高度，会出现无法展开的问题。如果没有设置，可以联系 Semi 客服看是否存在其他问题。
