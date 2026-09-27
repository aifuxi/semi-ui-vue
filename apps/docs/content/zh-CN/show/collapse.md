---
title: 'Collapse 折叠面板'
description: '可以展开或折叠展示内容区域。'
type: 'show'
order: 67
icon: 'doc-accordion'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/collapse` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-collapse-1" title="如何引入" kind="import" />

### 基本用法

可以同时展开多个面板，可以通过 `defaultActiveKey` 设置默认展开的面板。

<DemoBlock id="zh-CN-show-collapse-2" title="基本用法" kind="live" />

### 手风琴效果

可以通过设置 `accordion` 使每次只允许展开一个面板。

<DemoBlock id="zh-CN-show-collapse-3" title="手风琴效果" kind="live" />

### 禁用面板

可以通过设置 `disabled` 禁用面板。

<DemoBlock id="zh-CN-show-collapse-4" title="禁用面板" kind="live" />

### 隐藏面板展开/收起图标

可以通过设置 `showArrow` 隐藏面板展开/收起图标。

<DemoBlock id="zh-CN-show-collapse-5" title="隐藏面板展开/收起图标" kind="live" />

### 自定义展开图标

可以通过 `expandIcon` 设置展开图标，`collapseIcon` 设置折叠图标。

<DemoBlock id="zh-CN-show-collapse-6" title="自定义展开图标" kind="live" />

### 自定义右上角辅助区域内容

通过 `extra` 设置右上角辅助区域内容。

**仅在 header 为 string 时生效， 如果 header 为 VNodeChild 会包含 extra 所在的区域，可以自行渲染**

<DemoBlock id="zh-CN-show-collapse-7" title="自定义右上角辅助区域内容" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/collapse/types.ts`、`packages/ui/src/collapse/index.ts` 的公开类型为准。

- `v-model:activeKey` 对应 `activeKey` 与 `update:activeKey`。

#### Vue 用法

- `Collapse.Panel` 同时作为 `Collapse.Panel` 静态成员和 `CollapsePanel` 具名导出提供。
- `expandIcon`、`collapseIcon`、Panel 的 `header` 与 `extra` 均保留 VNode prop；同名插槽优先。

#### Vue 事件

**Collapse**

| 事件             | 参数                                              | 说明                   |
| ---------------- | ------------------------------------------------- | ---------------------- |
| change           | [activeKey: CollapseActiveKey, event: MouseEvent] | 展开项变化             |
| update:activeKey | [activeKey: CollapseActiveKey]                    | 更新 v-model:activeKey |

**CollapsePanel**

| 事件      | 参数 | 说明                   |
| --------- | ---- | ---------------------- |
| motionEnd | []   | 面板展开或收起动画结束 |

#### Vue 插槽

**Collapse**

| 插槽         | 作用域参数 | 说明                 |
| ------------ | ---------- | -------------------- |
| default      | {}         | CollapsePanel 子组件 |
| expandIcon   | {}         | 展开图标             |
| collapseIcon | {}         | 折叠图标             |

**CollapsePanel**

| 插槽    | 作用域参数 | 说明                                  |
| ------- | ---------- | ------------------------------------- |
| default | {}         | 面板内容                              |
| header  | {}         | 面板头                                |
| extra   | {}         | 右上角辅助内容；header 为字符串时生效 |

### Collapse

| 属性                | 说明                                            | 类型                    | 默认值                 | 版本   |
| ------------------- | ----------------------------------------------- | ----------------------- | ---------------------- | ------ |
| activeKey           | `v-model:activeKey` 绑定值                      | CollapseActiveKey       | 无                     | -      |
| defaultActiveKey    | 初始化选中面板的 key                            | CollapseActiveKey       | 无                     | -      |
| accordion           | 手风琴模式                                      | boolean                 | false                  | -      |
| clickHeaderToExpand | 点击 Header 展开收起，否则只响应点击箭头        | boolean                 | true                   | 2.32.0 |
| expandIcon          | 展开图标 VNode；expandIcon 插槽优先             | VNodeChild              | 内置 `IconChevronDown` | -      |
| collapseIcon        | 折叠图标 VNode；collapseIcon 插槽优先           | VNodeChild              | 内置 `IconChevronUp`   | -      |
| expandIconPosition  | 展开图标位置                                    | CollapseIconPosition    | `right`                | -      |
| keepDOM             | 是否保留隐藏的面板 DOM 树，默认销毁             | boolean                 | false                  | -      |
| motion              | 是否开启动画                                    | boolean                 | true                   | -      |
| lazyRender          | 配合 keepDOM 使用，为 true 时挂载时不会渲染组件 | boolean                 | false                  | 2.54.1 |
| class               | Vue 原生类名                                    | HTMLAttributes['class'] | —                      |        |
| className           | 样式类名                                        | HTMLAttributes['class'] | ''                     | -      |
| style               | 内联 CSS 样式                                   | StyleValue              | {}                     | -      |

### Collapse.Panel

| 属性      | 说明                                                                  | 类型                    | 默认值 | 版本    |
| --------- | --------------------------------------------------------------------- | ----------------------- | ------ | ------- |
| itemKey   | 必填且唯一，选中状态匹配 `activeKey`，`defaultActiveKey`              | string（必填）          | 无     |         |
| extra     | 右上角辅助 VNode；extra 插槽优先                                      | VNodeChild              | 无     |         |
| header    | 面板头 VNode；header 插槽优先                                         | VNodeChild              | 无     |         |
| class     | Vue 原生类名                                                          | HTMLAttributes['class'] | —      |         |
| className | 样式类名                                                              | HTMLAttributes['class'] | 无     |         |
| reCalcKey | 当 reCalcKey 改变时，将重新计算子节点的高度，用于优化动态渲染时的计算 | number \| string        | 无     | -       |
| style     | 内联 CSS 样式                                                         | StyleValue              | 无     |         |
| showArrow | 是否展示箭头                                                          | boolean                 | true   | v2.17.0 |
| disabled  | 面板是否被禁用                                                        | boolean                 | false  | v2.17.0 |

## Accessibility

### ARIA

- 面板 header 右侧按钮 设置了 `aria-hidden=true`
- 面板 header 可交互部分 设置了 `aria-owns` 值为对应面板内容
- 面板内容 设置了 `aria-hidden` 随面板内容展现隐藏其值在 true 和 false 之间自动切换
- 面板 `aria-disabled` 与 `disabled` 属性同步，表示面板禁用

## 文案规范

折叠面板本质是卡片容器增加了收起和展开的功能，所以折叠面板的文案规范需要和 [卡片文案规范](/zh-CN/show/card#%E6%96%87%E6%A1%88%E8%A7%84%E8%8C%83) 保持一致

## FAQ

- ##### Collapse 内嵌表单收起后表单数据会清空 ?

Collapse 收起之后，默认会销毁相应的 DOM。所以相应的 field 被卸载了，数据也被清空。可以通过给 collapse 增加 `keepDOM=true`，保留对应的 DOM 节点。

- ##### Collapse 中 Typography 截断逻辑失效 ?

如果开启了 `keepDOM` 会导致面板样式 `display: none`，此时会影响截断长度的计算。

- ##### Collapse.Header 整体作为折叠、展开的点击热区， 如果在 Header 中放置了自定义元素（例如 Input），点击时候会导致 Collapse 收起/展开。如何避免？

可以在自定义元素的 `@click` 监听器中阻止事件冒泡至 Collapse header；必要时可外包一层 div 处理 `@click`。

<DemoBlock id="zh-CN-show-collapse-8" title="FAQ" kind="code" />
