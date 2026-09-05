---
title: '模态对话框'
description: '模态对话框用于等待用户响应、告知用户重要信息或在不丢失上下文的情况下展示更多信息'
locale: 'zh-CN'
slug: 'modal'
category: 'show'
order: 76
englishTitle: 'Modal'
icon: 'doc-modal'
upstream: 'show/modal'
---

## 代码演示

### 如何引入

```ts
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import '@aifuxi/semi-theme-default/modal.css';
```

### 基本

::demo-block{demo="modal/zh-cn/Basic" title="基本"}
::

### 底部撑满

设置 footerFill 为 true 可使 Modal footer 底部按钮撑满排列

::demo-block{demo="modal/zh-cn/FooterFill" title="底部撑满"}
::

### 点击遮罩层不可关闭

修改 `maskClosable` 为 `false` 则不可通过点击遮罩层来关闭对话框。

::demo-block{demo="modal/zh-cn/MaskClosable" title="点击遮罩层不可关闭"}
::

### 自定义按钮文字

通过设置 `okText` 与 `cancelText` 属性可自定义按钮显示的文字。

注意：命令式调用的 Modal 需要通过这两个属性来设置 i18 的文本，因为我们无法修改 Vue 组件树，命令式调用插入的 Component 无法消费到 Locale 相关的 Context

::demo-block{demo="modal/zh-cn/ButtonText" title="自定义按钮文字"}
::

### 自定义按钮属性

通过设置 `okButtonProps` 与 `cancelButtonProps` 属性可自定义按钮的属性。

::demo-block{demo="modal/zh-cn/ButtonProps" title="自定义按钮属性"}
::

### 自定义对话框头部和页脚

如果需要实现更丰富的个性化需求，可以通过 `header` 自定义头部，`footer` 自定义页脚的按钮。把 `header` 设为 `null`时则不展示头部区域；不需要显示任何按钮时，同样可以把 `footer` 设为 `null`。

::demo-block{demo="modal/zh-cn/HeaderFooter" title="自定义对话框头部和页脚"}
::

### 自定义对话框的样式

通过设置 `style` 可以自定义样式及位置如 `style.top`，也可以通过 `centered` 使对话框居中显示。也可以通过设置 `maskStyle` 自定义遮罩样式，及 `bodyStyle` 自定义对话框内容样式。

::demo-block{demo="modal/zh-cn/Style" title="自定义对话框的样式"}
::

### 自定义的对话框

通过灵活使用使用 `header`，`footer`等属性可以实现一个完全自定义的对话框。

::demo-block{demo="modal/zh-cn/Custom" title="自定义的对话框"}
::

### 全屏 Modal

使用 `full-screen` 可以开启全屏对话框

::demo-block{demo="modal/zh-cn/Fullscreen" title="全屏 Modal"}
::

### 命令式调用

使用 `confirm()` 可以设置一个确认框。支持各种类型的信息提示。命令式调用也可以自定义 icon , 支持 string 和 VNodeChild 类型。其他 Modal 支持的 props 都可以传入。

::demo-block{demo="modal/zh-cn/Imperative" title="命令式调用"}
::

### Hooks 用法

通过 Modal.useModal 创建支持读取 context 的 contextHolder。

::demo-block{demo="modal/zh-cn/Context" title="Hooks 用法"}
::

### 可拖拽 Modal

通过 `modalRender` 自定义渲染 Modal 内容，可拖拽 Modal 通过 DragMove 组件实现。

::demo-block{demo="modal/zh-cn/Draggable" title="可拖拽 Modal"}
::

## API 参考

### Modal

| 属性              | 说明                                                                                                                         | 类型                                                         | 默认值              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------- |
| afterClose        | 对话框完全关闭后的回调函数 <br/>                                                                                             | () => void                                                   | 无                  |
| bodyStyle         | 对话框内容的样式                                                                                                             | CSSProperties                                                | 无                  |
| cancelButtonProps | 取消按钮的 props                                                                                                             | [ButtonProps](/zh-cn/components/button/#API参考)             | 无                  |
| cancelText        | 取消按钮的文字                                                                                                               | string                                                       | 无                  |
| centered          | 是否居中显示                                                                                                                 | boolean                                                      | false               |
| class             | 可用于设置样式类名                                                                                                           | string                                                       | 无                  |
| closable          | 是否显示右上角的关闭按钮                                                                                                     | boolean                                                      | true                |
| closeIcon         | 关闭按钮的 icon                                                                                                              | VNodeChild                                                   | `<IconClose />`     |
| closeOnEsc        | 允许通过键盘事件 Esc 触发关闭                                                                                                | boolean                                                      | true                |
| confirmLoading    | 确认按钮 loading                                                                                                             | boolean                                                      | false               |
| content           | 对话框内容                                                                                                                   | VNodeChild                                                   | 无                  |
| footer            | 对话框底部                                                                                                                   | VNodeChild                                                   | 无                  |
| fullScreen        | 对话是否是全屏（会覆盖 width height）                                                                                        | boolean                                                      | false               |
| getPopupContainer | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () => HTMLElement                                            | () => document.body |
| hasCancel         | 是否显示取消按钮                                                                                                             | boolean                                                      | true                |
| header            | 对话框头部                                                                                                                   | VNodeChild                                                   | 无                  |
| height            | 高度                                                                                                                         | number \| string                                             | 无                  |
| icon              | 自定义 icon                                                                                                                  | VNodeChild                                                   | -                   |
| keepDOM           | 关闭对话框时是否保留内部组件不销毁                                                                                           | boolean                                                      | false               |
| lazyRender        | 配合 keepDOM 使用，为 true 时挂载时不会渲染对话框组件                                                                        | boolean                                                      | true                |
| mask              | 是否显示遮罩                                                                                                                 | boolean                                                      | true                |
| maskClosable      | 是否允许通过点击遮罩来关闭对话框                                                                                             | boolean                                                      | true                |
| maskStyle         | 遮罩的样式                                                                                                                   | CSSProperties                                                | 无                  |
| modalContentClass | 可用于设置对话框内容的样式类名                                                                                               | string                                                       | 无                  |
| modalRender       | 自定义渲染 Modal                                                                                                             | (modal: VNodeChild) => VNodeChild                            | -                   |
| motion            | 动画效果开关                                                                                                                 | boolean                                                      | true                |
| okButtonProps     | 确认按钮的 props                                                                                                             | [ButtonProps](/zh-cn/components/button/#API参考)             | 无                  |
| okText            | 确认按钮的文字                                                                                                               | string                                                       | 无                  |
| okType            | 确认按钮的类型, 可选: 'primary'、'secondary'、'tertiary'、'warning'、'danger'                                                | string                                                       | primary             |
| preventScroll     | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法，不包含用户传入的组件                                  | boolean                                                      |                     |     |
| size              | 对话框宽度尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，`full-width`(100vw - 64px)                            | string                                                       | 'small'             |
| style             | 可用于设置样式                                                                                                               | CSSProperties                                                | 无                  |
| title             | 对话框的标题                                                                                                                 | VNodeChild                                                   | 无                  |
| visible           | 对话框是否可见                                                                                                               | boolean                                                      | false               |
| width             | 宽度                                                                                                                         | number \| string                                             | 448                 |
| zIndex            | 遮罩的 z-index 值                                                                                                            | number                                                       | 1000                |
| onCancel          | 取消对话框时的回调函数，返回 Promise 时，取消按钮会出现 loading 态                                                           | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | 无                  |
| onOk              | 点击确认按钮时的回调函数，返回 Promise 时，确认按钮会出现 loading 态                                                         | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | 无                  |

### Modal.method()

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

| 属性              | 说明                                                                   | 类型                                                         | 默认值  |
| ----------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------ | ------- |
| bodyStyle         | 对话框内容的样式                                                       | CSSProperties                                                | 无      |
| cancelButtonProps | 取消按钮的 props                                                       | [ButtonProps](/zh-cn/components/button/#API参考)             | 无      |
| cancelText        | 取消按钮的文字                                                         | string                                                       | 无      |
| centered          | 是否居中显示                                                           | boolean                                                      | false   |
| class             | 可用于设置样式类名                                                     | string                                                       | 无      |
| closable          | 是否显示右上角的关闭按钮                                               | boolean                                                      | true    |
| confirmLoading    | 确认按钮 loading                                                       | boolean                                                      | false   |
| content           | 对话框内容                                                             | VNodeChild                                                   | 无      |
| footer            | 对话框底部                                                             | VNodeChild                                                   | 无      |
| footerFill        | 底部按钮是否撑满 (>= 2.xx.0 )                                          | boolean                                                      | false   |
| header            | 对话框头部                                                             | VNodeChild                                                   | 无      |
| height            | 高度                                                                   | number \| string                                             | 无      |
| icon              | 自定义 icon                                                            | VNodeChild                                                   | -       |
| mask              | 是否显示遮罩                                                           | boolean                                                      | true    |
| maskClosable      | 是否允许通过点击遮罩来关闭对话框                                       | boolean                                                      | true    |
| maskStyle         | 遮罩的样式                                                             | CSSProperties                                                | 无      |
| modalContentClass | 可用于设置对话框内容的样式类名                                         | string                                                       | 无      |
| modalRender       | 自定义渲染 Modal                                                       | (modal: VNodeChild) => VNodeChild                            | -       |
| okButtonProps     | 确认按钮的 props                                                       | [ButtonProps](/zh-cn/components/button/#API参考)             | 无      |
| okText            | 确认按钮的文字                                                         | string                                                       | 无      |
| okType            | 确认按钮的类型                                                         | string                                                       | primary |
| style             | 可用于设置样式                                                         | CSSProperties                                                | 无      |
| title             | 对话框的标题                                                           | VNodeChild                                                   | 无      |
| width             | 自定义宽度；默认由 size=small 推导                                     | number \| string                                             | 448     |
| zIndex            | 遮罩的 z-index 值                                                      | number                                                       | 1000    |
| onCancel          | 取消回调，参数为鼠标或键盘事件，返回 promise 时 resolve 后自动关闭     | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | 无      |
| onOk              | 点击确定回调，参数为鼠标或键盘事件，返回 promise 时 resolve 后自动关闭 | (e: MouseEvent \| KeyboardEvent) => void \| Promise<unknown> | 无      |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

```ts
function openAndUpdate() {
  const modal = Modal.info({ title: 'Information', content: 'Content' });
  modal.update({ title: 'Updated title', content: 'Updated content' });
  modal.destroy();
}
```

- `Modal.destroyAll`

使用 Modal.destroyAll() 可以销毁命令式及以上`.info()`等创建的弹窗。

- `Modal.useModal`
  当你需要使用 Context 时，可以通过 Modal.useModal 创建一个 contextHolder 插入相应的节点中。此时通过 hooks 创建的 Modal 将会得到 contextHolder 所在位置的所有上下文。创建的 modal 对象拥有与 [Modal.method](#modalmethod) 相同的创建通知方法。

## Accessibility

### ARIA

WAI-ARIA: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

- role 设置为 `dialog`
- aria-modal 设置为 true
- aria-labelledby 对应 Modal header
- aria-describedby 对应 Modal body

### 键盘和焦点

- Modal 在弹出时自动获得焦点，关闭时焦点自动回归到打开前元素。
- 键盘用户可以使用 `Tab` 键和 `Shift + Tab`，将焦点在 Modal 内移动，包括 Modal 自带的关闭按钮和确定取消按钮，此时 Modal 背后元素不可被 tab 聚焦。
- Modal 打开时默认聚焦到取消按钮, 可通过在 cancelButtonProps 或 okButtonProps 传入 autoFocus 来控制该行为。
- 可通过在 Modal 内容中需要聚焦的表单元素上添加 autoFocus 来让 Modal 打开时自动聚焦到该元素 (需同时设置 cancelButtonProps 的 autoFocus 为 false)。
- 修改 closeOnEsc 默认值为 true，允许用户通过键盘直接关闭 Modal 带来更好的体验

## 文案规范

- 命令式 Modal 与 默认 Modal 两种模态对话框的标题使用 动词 + 名词 的格式，无论是陈述句还是问句

| ✅ 推荐用法   | ❌ 不推荐用法                         |
| ------------- | ------------------------------------- |
| Edit ticket   | Edit                                  |
| Delete form？ | Are you sure you want to delete form? |

- 两种模态对话框的操作按钮在保证标题描述清楚的前提下，只需要使用标题内的动词即可

| ✅ 推荐用法 | ❌ 不推荐用法 |
| ----------- | ------------- |
| Edit        | Edit ticket   |

- 命令式 Modal 的正文规范
  - 对标题进行具体的解释说明，不要重复标题的信息
  - 确保用户知道在必要时如何采取行动

## 设计变量

::token-table{component="modal"}
::

## FAQ

- #### 为什么使用 ConfigProvider 后， Modal.confirm 确认、取消按钮的文本没有国际化？

  Modal 使用 Portal 将浮层节点插入到 DOM 树中。但这个操作仅能改变节点在 DOM 树中的位置，无法改变节点在 Vue 组件树中的位置，ConfigProvider是基于 Context 机制传递的，必须是从属的 Vue 子组件才可消费到 Local 相关 Context。因此命令式的 Modal 的内置文本无法自动适配国际化。
  你可以通过 `okText` 和 `cancelText` 这两个属性来根据 Locale 重新设置 i18 的文本。  
  在1.2版本之后，你也可以通过 Modal.useModal 方法来返回 modal 实体以及 contextHolder 节点。将 contextHolder 插入到你需要获取 context 位置，即可使 Modal 获取到对应的 Context，如 ConfigProvider 或者 ConfigProvider 的配置。

- #### 为什么 title 和 content 的间距在命令式调用和非命令式调用下不同?
  命令式调用场景下，标题和内容的相关性更强，所以用更近的距离表达这种强相关性，符合预期。用户如果不想要这种效果，可以自己做样式覆盖。

## React → Vue 迁移

| React                                      | Vue                                                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| visible / onCancel                         | v-model:visible，或 visible prop 与 onCancel 回调                               |
| children                                   | 默认插槽；body 插槽优先于默认插槽，content prop 最后回退                        |
| title / icon / closeIcon / header / footer | 同名插槽或 VNodeChild prop；header/footer 显式 null 隐藏区域                    |
| onOk / onCancel                            | `:on-ok="handleOk"` / `:on-cancel="handleCancel"`，回调返回值由 Foundation 读取 |
| afterClose                                 | `:after-close="afterClose"`；也支持 onAfterClose                                |
| modalRender(node)                          | 返回 VNodeChild 的函数，复杂包装使用 Vue h                                      |
| Modal.info/success/error/warning/confirm   | 保留方法，参数 ModalProps，返回 ModalHandle                                     |
| modal.update / modal.destroy               | 更新配置 / 关闭该句柄对应的弹窗                                                 |
| Modal.useModal()                           | useModal() 或 Modal.useModal()；返回 methods 与 ContextHolder 组件              |

Modal 仅发出 update:visible，onOk/onCancel 是支持 Promise 返回值的回调 props，不是普通无返回值 emit。命令式回调参数为 MouseEvent 或 KeyboardEvent，并非上游表格所写的关闭函数；返回 Promise 时 resolve 后关闭，reject 后保留。普通受控 Modal 的显示状态仍由调用方更新。

Modal 还公开 cancelLoading（默认 false）、footerFill（默认 false）、maskFixed（默认 false）、direction（继承配置）、getContainerContext。普通和命令式 Modal 都按 size 选择宽度，默认 small=448px；width/height 支持 number 或 string，fullScreen 优先。静态方法使用独立挂载树，不能自动读取当前 ConfigProvider；通过 okText/cancelText 设置语言，或用 useModal 的 ContextHolder 读取上下文。destroyAll 只管理静态方法创建的弹窗，不管理 useModal 实例。

浮层默认通过 Teleport 渲染到 document.body。自定义 getPopupContainer 使用本实例 template ref，容器设置 position: relative；需要限制显示区域时设置 overflow: hidden。不要在 setup 顶层查询 document 或调用静态弹窗方法。组件会清理自身的监听、焦点与定位资源，业务创建的计时器、静态句柄仍由业务在卸载时清理。
