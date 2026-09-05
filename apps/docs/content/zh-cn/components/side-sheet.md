---
title: '滑动侧边栏'
description: '可从屏幕边沿滑出的浮层面板，通常用于承载二级操作页面'
locale: 'zh-CN'
slug: 'side-sheet'
category: 'show'
order: 80
englishTitle: 'SideSheet'
icon: 'doc-sidesheet'
upstream: 'show/sidesheet'
---

## 代码演示

### 如何引入

```ts
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
```

### 基本

默认侧边栏从右滑出，支持点击遮罩区关闭。

::demo-block{demo="side-sheet/zh-cn/Basic" title="基本"}
::

### 自定义位置

可以通过设置 `placement` 属性设置侧边栏滑出位置，支持`top`, `bottom`, `left`, `right`。

::demo-block{demo="side-sheet/zh-cn/Placement" title="自定义位置"}
::

### 自定义尺寸

可以通过设置 `size` 属性设置侧边栏尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，仅在 `placement` 为 `left` 或 `right` 时生效。若默认的尺寸不满足你的需求，你还可以通过设置 `width` 属性自行设置宽度，例如 `:width="900"` / `width="800px"`

::demo-block{demo="side-sheet/zh-cn/Size" title="自定义尺寸"}
::

### 可操作的外部区域

当 `:mask="false"`时允许对外部区域进行操作。

当 SideSheet 是默认渲染在 body 中时（即不传入 getPopupContainer 参数），会在打开时自动给 body 添加 overflow: hidden 来禁止滚动。如果你希望外部区域依然可滚动，可以将 disableScroll 设为false

::demo-block{demo="side-sheet/zh-cn/Outside" title="可操作的外部区域"}
::

### 渲染在指定容器

可以通过 `getPopupContainer` 指定父级 DOM，弹层将会渲染至该 DOM 中。

容器需要手动设置样式 `overflow: hidden`，否则会导致动画溢出

::demo-block{demo="side-sheet/zh-cn/Container" title="渲染在指定容器"}
::

### 自定义内容区域

可以通过自定义 `title`，`footer` 等创建出丰富的内容样式。

::demo-block{demo="side-sheet/zh-cn/Custom" title="自定义内容区域"}
::

## API 参考

| 属性                  | 说明                                                                                                                         | 类型                                     | 默认值          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------- |
| @after-visible-change | 面板展示/隐藏时动画结束触发的回调                                                                                            | (isVisible: boolean) => void             | -               |
| bodyStyle             | 面板内容的样式                                                                                                               | CSSProperties                            | -               |
| class                 | 类名                                                                                                                         | string                                   | -               |
| closable              | 是否允许通过右上角的关闭按钮关闭                                                                                             | boolean                                  | true            |
| closeIcon             | 关闭按钮的 icon                                                                                                              | VNodeChild                               | `<IconClose />` |
| closeOnEsc            | 允许通过键盘事件 Esc 触发关闭                                                                                                | boolean                                  | false           |
| disableScroll         | 默认渲染在 document.body 层时是否禁止 body 的滚动，即给 body 添加 `overflow: hidden`                                         | boolean                                  | true            |
| footer                | 侧边栏底部                                                                                                                   | VNodeChild                               | null            |
| getPopupContainer     | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () => HTMLElement                        | -               |
| headerStyle           | 面板头部的样式                                                                                                               | CSSProperties                            | -               |
| height                | 高度，位置为 `top` 或 `bottom` 时生效                                                                                        | number \| string                         | 448             |
| keepDOM               | 关闭 SideSheet 时是否保留内部组件不销毁                                                                                      | boolean                                  | false           |
| mask                  | 是否显示遮罩，当 `:mask="false"` 时允许对外部区域进行操作                                                                    | boolean                                  | true            |
| maskClosable          | 是否允许通过点击遮罩来关闭面板                                                                                               | boolean                                  | true            |
| maskStyle             | 遮罩的样式                                                                                                                   | CSSProperties                            | -               |
| motion                | 是否允许动画                                                                                                                 | boolean                                  | true            |
| placement             | 侧边栏滑出位置，支持`top`, `bottom`, `left`, `right`                                                                         | string                                   | `right`         |
| size                  | 尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，仅在 `left` 或 `right` 时生效                                   | string                                   | `small`         |
| style                 | 可用于设置样式                                                                                                               | CSSProperties                            | -               |
| title                 | 面板的标题                                                                                                                   | VNodeChild                               | -               |
| visible               | 面板是否可见                                                                                                                 | boolean                                  | false           |
| width                 | 宽度，位置为 `left` 或 `right` 时生效                                                                                        | number \| string                         | 448             |
| zIndex                | 弹层 z-index 值                                                                                                              | number                                   | 1000            |
| @cancel               | 取消面板时的回调函数                                                                                                         | (e: MouseEvent \| KeyboardEvent) => void | -               |

## Accessibility

### ARIA

- SideSheet 具有 `dialog` role 来表示它是一个弹窗组件， 内部 header 具有 `heading` role 表明是 header。

## 设计变量

::token-table{component="sideSheet"}
::

## FAQ:

- SideSheet 会自动禁止 body 的滚动吗？当 SideSheet 是默认渲染在 body 中时（即不传入 getPopupContainer 参数），会在打开时自动给 body 添加 `overflow: hidden` 来禁止滚动。可以通过 `:disable-scroll="false"` 允许滚动。

## React → Vue 迁移

| React                      | Vue                                                          |
| -------------------------- | ------------------------------------------------------------ |
| children                   | 默认插槽                                                     |
| title / footer / closeIcon | 同名插槽或 VNodeChild prop                                   |
| visible / onCancel         | v-model:visible 或 visible + @cancel                         |
| afterVisibleChange         | @after-visible-change；也支持同名回调 prop                   |
| onCancel                   | @cancel，参数 MouseEvent 或 KeyboardEvent；兼容同名回调 prop |
| className                  | class，兼容 className                                        |

SideSheet 不公开 open/close 命令式方法。height 在 top/bottom 方向的默认值是固定 Foundation 的448px，而非上游表格的400。canVerticalSetWidth 允许垂直方向应用 width。默认 closeOnEsc=false；需要 Esc 关闭时显式设置 true。关闭默认销毁内容，keepDOM 可以保留表单状态。自定义容器应设置 position: relative 与 overflow: hidden。

浮层默认通过 Teleport 渲染到 document.body。自定义 getPopupContainer 使用本实例 template ref，容器设置 position: relative；需要限制显示区域时设置 overflow: hidden。不要在 setup 顶层查询 document 或调用静态弹窗方法。组件会清理自身的监听、焦点与定位资源，业务创建的计时器、静态句柄仍由业务在卸载时清理。
