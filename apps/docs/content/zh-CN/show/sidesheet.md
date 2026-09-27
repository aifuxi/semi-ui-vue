---
title: 'SideSheet 滑动侧边栏'
description: '可从屏幕边沿滑出的浮层面板，通常用于承载二级操作页面'
type: 'show'
order: 80
icon: 'doc-sidesheet'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/side-sheet` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-sidesheet-1" title="如何引入" kind="import" />

### 基本

默认侧边栏从右滑出，支持点击遮罩区关闭。

<DemoBlock id="zh-CN-show-sidesheet-2" title="基本" kind="live" />

### 自定义位置

可以通过设置 `placement` 属性设置侧边栏滑出位置，支持`top`, `bottom`, `left`, `right`。

<DemoBlock id="zh-CN-show-sidesheet-3" title="自定义位置" kind="live" />

### 自定义尺寸

可以通过设置 `size` 属性设置侧边栏尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，仅在 `placement` 为 `left` 或 `right` 时生效。若默认的尺寸不满足你的需求，你还可以通过设置 `width` 属性自行设置宽度，例如 `:width="900"` / `width="800px"`

<DemoBlock id="zh-CN-show-sidesheet-4" title="自定义尺寸" kind="live" />

### 可操作的外部区域

当 `:mask="false"`时允许对外部区域进行操作。

<DemoBlock id="zh-CN-show-sidesheet-5" title="可操作的外部区域" kind="live" />

### 渲染在指定容器

可以通过 `getPopupContainer` 指定父级 DOM，弹层将会渲染至该 DOM 中。

<DemoBlock id="zh-CN-show-sidesheet-6" title="渲染在指定容器" kind="live" />

### 自定义内容区域

可以通过自定义 `title`，`footer` 等创建出丰富的内容样式。

<DemoBlock id="zh-CN-show-sidesheet-7" title="自定义内容区域" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/side-sheet/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。

#### Vue 用法

- `getPopupContainer` 返回 Portal 容器；不传时渲染到 document.body。
- `afterVisibleChange` 保留 callback prop，并同时提供同名 Vue 事件。
- `title`、`footer`、`closeIcon` 保留 VNode prop 入口；同名插槽优先。

#### Vue 事件

**SideSheet**

| 事件               | 参数                                 | 说明                             |
| ------------------ | ------------------------------------ | -------------------------------- |
| cancel             | [event: MouseEvent \| KeyboardEvent] | 点击关闭、遮罩或按 Escape 时触发 |
| afterVisibleChange | [visible: boolean]                   | 显隐动画完成                     |
| update:visible     | [visible: boolean]                   | 关闭时更新 v-model:visible       |

#### Vue 插槽

**SideSheet**

| 插槽      | 作用域参数 | 说明         |
| --------- | ---------- | ------------ |
| default   | {}         | 面板主体内容 |
| title     | {}         | 面板标题     |
| footer    | {}         | 底部操作区   |
| closeIcon | {}         | 关闭图标     |

| 属性                | 说明                                                                                                                         | 类型                          | 默认值  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ------- |
| aria-label          | 对话框的可访问名称                                                                                                           | string                        | —       |
| afterVisibleChange  | 显隐动画完成 callback；同时触发同名事件                                                                                      | (visible: boolean) =&gt; void | -       |
| bodyStyle           | 面板内容的样式                                                                                                               | StyleValue                    | -       |
| canVerticalSetWidth | —                                                                                                                            | boolean                       | false   |
| class               | Vue 原生类名                                                                                                                 | HTMLAttributes['class']       | —       |
| className           | 样式类名                                                                                                                     | HTMLAttributes['class']       | -       |
| closable            | 是否允许通过右上角的关闭按钮关闭                                                                                             | boolean                       | true    |
| closeIcon           | 关闭图标 VNode；closeIcon 插槽优先                                                                                           | VNodeChild                    | —       |
| closeOnEsc          | 允许通过键盘事件 Esc 触发关闭                                                                                                | boolean                       | false   |
| disableScroll       | 默认渲染在 document.body 层时是否禁止 body 的滚动，即给 body 添加 `overflow: hidden`                                         | boolean                       | true    |
| footer              | 底部 VNode；footer 插槽优先                                                                                                  | VNodeChild                    | null    |
| getPopupContainer   | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement          | -       |
| headerStyle         | 面板头部的样式                                                                                                               | StyleValue                    | -       |
| height              | 高度，位置为 `top` 或 `bottom` 时生效                                                                                        | number \| string              | 400     |
| keepDOM             | 关闭 SideSheet 时是否保留内部组件不销毁                                                                                      | boolean                       | false   |
| mask                | 是否显示遮罩，当 `:mask="false"` 时允许对外部区域进行操作                                                                    | boolean                       | true    |
| maskClosable        | 是否允许通过点击遮罩来关闭面板                                                                                               | boolean                       | true    |
| maskStyle           | 遮罩的样式                                                                                                                   | StyleValue                    | -       |
| motion              | 是否允许动画                                                                                                                 | boolean                       | true    |
| placement           | 侧边栏滑出位置，支持`top`, `bottom`, `left`, `right`                                                                         | SideSheetPlacement            | `right` |
| size                | 尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，仅在 `left` 或 `right` 时生效                                   | SideSheetSize                 | `small` |
| style               | 可用于设置样式                                                                                                               | StyleValue                    | -       |
| title               | 标题 VNode；title 插槽优先                                                                                                   | VNodeChild                    | -       |
| visible             | 面板是否可见                                                                                                                 | boolean                       | false   |
| width               | 宽度，位置为 `left` 或 `right` 时生效                                                                                        | number \| string              | 448     |
| zIndex              | 弹层 z-index 值                                                                                                              | number                        | 1000    |

## Accessibility

### ARIA

- SideSheet 具有 `dialog` role 来表示它是一个弹窗组件， 内部 header 具有 `heading` role 表明是 header。

## FAQ:

- SideSheet 会自动禁止 body 的滚动吗？当 SideSheet 是默认渲染在 body 中时（即不传入 getPopupContainer 参数），会在打开时自动给 body 添加 `overflow: hidden` 来禁止滚动。可以通过 `:disable-scroll="false"` 允许滚动。
