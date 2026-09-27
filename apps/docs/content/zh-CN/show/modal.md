---
title: 'Modal 模态对话框'
description: '模态对话框用于等待用户响应、告知用户重要信息或在不丢失上下文的情况下展示更多信息'
type: 'show'
order: 76
icon: 'doc-modal'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/modal` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

<DemoBlock id="zh-CN-show-modal-1" title="如何引入" kind="import" />

### 基本

<DemoBlock id="zh-CN-show-modal-2" title="基本" kind="live" />

### 底部撑满

设置 footerFill 为 true 可使 Modal footer 底部按钮撑满排列

<DemoBlock id="zh-CN-show-modal-3" title="底部撑满" kind="live" />

### 点击遮罩层不可关闭

修改 `maskClosable` 为 `false` 则不可通过点击遮罩层来关闭对话框。

<DemoBlock id="zh-CN-show-modal-4" title="点击遮罩层不可关闭" kind="live" />

### 自定义按钮文字

通过设置 `okText` 与 `cancelText` 属性可自定义按钮显示的文字。

注意：命令式 Modal 不在当前组件的注入层级内，需要通过这两个属性显式设置国际化文案。

<DemoBlock id="zh-CN-show-modal-5" title="自定义按钮文字" kind="live" />

### 自定义按钮属性

通过设置 `okButtonProps` 与 `cancelButtonProps` 属性可自定义按钮的属性。

<DemoBlock id="zh-CN-show-modal-6" title="自定义按钮属性" kind="live" />

### 自定义对话框头部和页脚

如果需要实现更丰富的个性化需求，可以通过 `header` 自定义头部，`footer` 自定义页脚的按钮。把 `header` 设为 `null`时则不展示头部区域；不需要显示任何按钮时，同样可以把 `footer` 设为 `null`。

<DemoBlock id="zh-CN-show-modal-7" title="自定义对话框头部和页脚" kind="live" />

### 自定义对话框的样式

通过设置 `style` 可以自定义样式及位置如 `style.top`，也可以通过 `centered` 使对话框居中显示。也可以通过设置 `maskStyle` 自定义遮罩样式，及 `bodyStyle` 自定义对话框内容样式。

<DemoBlock id="zh-CN-show-modal-8" title="自定义对话框的样式" kind="live" />

### 自定义的对话框

通过灵活使用使用 `header`，`footer`等属性可以实现一个完全自定义的对话框。

<DemoBlock id="zh-CN-show-modal-9" title="自定义的对话框" kind="live" />

### 全屏 Modal

使用 `fullScreen={true}` 可以开启全屏对话框

<DemoBlock id="zh-CN-show-modal-10" title="全屏 Modal" kind="live" />

### 命令式调用

使用 `confirm()` 可以设置一个确认框。支持各种类型的信息提示。命令式调用也可以自定义 icon , 支持 string 和 VNodeChild 类型。其他 Modal 支持的 props 都可以传入。

<DemoBlock id="zh-CN-show-modal-11" title="命令式调用" kind="live" />

### useModal 用法

通过 Modal.useModal 创建支持读取 context 的 contextHolder。

<DemoBlock id="zh-CN-show-modal-12" title="useModal 用法" kind="live" />

### 可拖拽 Modal

通过 `modalRender` 自定义渲染 Modal 内容，可拖拽 Modal 通过 DragMove 组件实现。

<DemoBlock id="zh-CN-show-modal-13" title="可拖拽 Modal" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/modal/types.ts` 的公开类型为准。

- `v-model:visible` 对应 `visible` 与 `update:visible`。`onOk` / `onCancel` 是保留的 callback props。

#### Vue 事件

**Modal**

| 事件           | 参数               | 说明                                 |
| -------------- | ------------------ | ------------------------------------ |
| update:visible | [visible: boolean] | 可见状态更新，用于 `v-model:visible` |

#### Vue 插槽

**Modal**

| 插槽           | 作用域参数 | 说明       |
| -------------- | ---------- | ---------- |
| default / body | {}         | 对话框正文 |
| header / title | {}         | 头部或标题 |
| footer         | {}         | 底部操作区 |
| closeIcon      | {}         | 关闭图标   |
| icon           | {}         | 状态图标   |

### Modal

| 属性                | 说明                                                                                                                         | 类型                                  | 默认值                 |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------- |
| afterClose          | 对话框完全关闭后的回调函数                                                                                                   | () =&gt; void                         | 无                     |
| bodyStyle           | 对话框内容的样式                                                                                                             | StyleValue                            | 无                     |
| cancelButtonProps   | 取消按钮的 props                                                                                                             | ModalButtonProps                      | 无                     |
| cancelLoading       | —                                                                                                                            | boolean                               | —                      |
| cancelText          | 取消按钮的文字                                                                                                               | string                                | 无                     |
| centered            | 是否居中显示                                                                                                                 | boolean                               | false                  |
| class               | —                                                                                                                            | HTMLAttributes['class']               | —                      |
| className           | 可用于设置样式类名                                                                                                           | HTMLAttributes['class']               | 无                     |
| closable            | 是否显示右上角的关闭按钮                                                                                                     | boolean                               | true                   |
| closeIcon           | 关闭按钮的 icon                                                                                                              | VNodeChild                            | —                      |
| closeOnEsc          | 允许通过键盘事件 Esc 触发关闭                                                                                                | boolean                               | true                   |
| confirmLoading      | 确认按钮 loading                                                                                                             | boolean                               | false                  |
| content             | 对话框内容                                                                                                                   | VNodeChild                            | 无                     |
| direction           | —                                                                                                                            | ConfigDirection                       | —                      |
| footer              | 对话框底部                                                                                                                   | VNodeChild                            | 无                     |
| footerFill          | —                                                                                                                            | boolean                               | —                      |
| fullScreen          | 对话是否是全屏（会覆盖 width height）                                                                                        | boolean                               | false                  |
| getContainerContext | —                                                                                                                            | () =&gt; unknown                      | —                      |
| getPopupContainer   | 指定父级 DOM，弹层将会渲染至该 DOM 中，自定义需要设置 `position: relative` 这会改变浮层 DOM 树位置，但不会改变视图渲染位置。 | () =&gt; HTMLElement                  | () =&gt; document.body |
| hasCancel           | 是否显示取消按钮                                                                                                             | boolean                               | true                   |
| header              | 对话框头部                                                                                                                   | VNodeChild                            | 无                     |
| height              | 高度                                                                                                                         | string \| number                      | 无                     |
| icon                | 自定义 icon                                                                                                                  | VNodeChild                            | -                      |
| keepDOM             | 关闭对话框时是否保留内部组件不销毁                                                                                           | boolean                               | false                  |
| lazyRender          | 配合 keepDOM 使用，为 true 时挂载时不会渲染对话框组件                                                                        | boolean                               | true                   |
| mask                | 是否显示遮罩                                                                                                                 | boolean                               | true                   |
| maskClosable        | 是否允许通过点击遮罩来关闭对话框                                                                                             | boolean                               | true                   |
| maskFixed           | —                                                                                                                            | boolean                               | —                      |
| maskStyle           | 遮罩的样式                                                                                                                   | StyleValue                            | 无                     |
| modalContentClass   | 可用于设置对话框内容的样式类名                                                                                               | HTMLAttributes['class']               | 无                     |
| modalRender         | 自定义渲染 Modal                                                                                                             | (dialog: VNodeChild) =&gt; VNodeChild | -                      |
| motion              | 动画效果开关                                                                                                                 | boolean                               | true                   |
| okButtonProps       | 确认按钮的 props                                                                                                             | ModalButtonProps                      | 无                     |
| okText              | 确认按钮的文字                                                                                                               | string                                | 无                     |
| okType              | 确认按钮的类型, 可选: 'primary'、'secondary'、'tertiary'、'warning'、'danger'                                                | ButtonType                            | primary                |
| onAfterClose        | —                                                                                                                            | () =&gt; void                         | —                      |
| onCancel            | 取消对话框时的回调函数，返回 Promise 时，取消按钮会出现 loading 态                                                           | ModalActionHandler                    | 无                     |
| onOk                | 点击确认按钮时的回调函数，返回 Promise 时，确认按钮会出现 loading 态                                                         | ModalActionHandler                    | 无                     |
| preventScroll       | 指示浏览器是否应滚动文档以显示新聚焦的元素，作用于组件内的 focus 方法，不包含用户传入的组件                                  | boolean                               | —                      |
| size                | 对话框宽度尺寸，支持 `small`(448px)， `medium`(684px), `large`(920px)，`full-width`(100vw - 64px)                            | ModalSize                             | 'small'                |
| style               | 可用于设置样式                                                                                                               | StyleValue                            | 无                     |
| title               | 对话框的标题                                                                                                                 | VNodeChild                            | 无                     |
| visible             | 对话框是否可见                                                                                                               | boolean                               | false                  |
| width               | 宽度                                                                                                                         | string \| number                      | 448                    |
| zIndex              | 遮罩的 z-index 值                                                                                                            | number                                | 1000                   |

### Modal.method()

- `Modal.info`
- `Modal.success`
- `Modal.error`
- `Modal.warning`
- `Modal.confirm`

| 属性                | 说明                                                             | 类型                                  | 默认值  |
| ------------------- | ---------------------------------------------------------------- | ------------------------------------- | ------- |
| afterClose          | —                                                                | () =&gt; void                         | —       |
| bodyStyle           | 对话框内容的样式                                                 | StyleValue                            | 无      |
| cancelButtonProps   | 取消按钮的 props                                                 | ModalButtonProps                      | 无      |
| cancelLoading       | —                                                                | boolean                               | —       |
| cancelText          | 取消按钮的文字                                                   | string                                | 无      |
| centered            | 是否居中显示                                                     | boolean                               | false   |
| class               | —                                                                | HTMLAttributes['class']               | —       |
| className           | 可用于设置样式类名                                               | HTMLAttributes['class']               | 无      |
| closable            | 是否显示右上角的关闭按钮                                         | boolean                               | true    |
| closeIcon           | —                                                                | VNodeChild                            | —       |
| closeOnEsc          | —                                                                | boolean                               | —       |
| confirmLoading      | 确认按钮 loading                                                 | boolean                               | false   |
| content             | 对话框内容                                                       | VNodeChild                            | 无      |
| direction           | —                                                                | ConfigDirection                       | —       |
| footer              | 对话框底部                                                       | VNodeChild                            | 无      |
| footerFill          | 底部按钮是否撑满 (&gt;= 2.xx.0 )                                 | boolean                               | false   |
| fullScreen          | —                                                                | boolean                               | —       |
| getContainerContext | —                                                                | () =&gt; unknown                      | —       |
| getPopupContainer   | —                                                                | () =&gt; HTMLElement                  | —       |
| hasCancel           | —                                                                | boolean                               | —       |
| header              | 对话框头部                                                       | VNodeChild                            | 无      |
| height              | 高度                                                             | string \| number                      | 无      |
| icon                | 自定义 icon                                                      | VNodeChild                            | -       |
| keepDOM             | —                                                                | boolean                               | —       |
| lazyRender          | —                                                                | boolean                               | —       |
| mask                | 是否显示遮罩                                                     | boolean                               | true    |
| maskClosable        | 是否允许通过点击遮罩来关闭对话框                                 | boolean                               | true    |
| maskFixed           | —                                                                | boolean                               | —       |
| maskStyle           | 遮罩的样式                                                       | StyleValue                            | 无      |
| modalContentClass   | 可用于设置对话框内容的样式类名                                   | HTMLAttributes['class']               | 无      |
| modalRender         | 自定义渲染 Modal                                                 | (dialog: VNodeChild) =&gt; VNodeChild | -       |
| motion              | —                                                                | boolean                               | —       |
| okButtonProps       | 确认按钮的 props                                                 | ModalButtonProps                      | 无      |
| okText              | 确认按钮的文字                                                   | string                                | 无      |
| okType              | 确认按钮的类型                                                   | ButtonType                            | primary |
| onAfterClose        | —                                                                | () =&gt; void                         | —       |
| onCancel            | 取消回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭     | ModalActionHandler                    | 无      |
| onOk                | 点击确定回调，参数为关闭函数，返回 promise 时 resolve 后自动关闭 | ModalActionHandler                    | 无      |
| preventScroll       | —                                                                | boolean                               | —       |
| size                | —                                                                | ModalSize                             | —       |
| style               | 可用于设置样式                                                   | StyleValue                            | 无      |
| title               | 对话框的标题                                                     | VNodeChild                            | 无      |
| visible             | —                                                                | boolean                               | —       |
| width               | 宽度                                                             | string \| number                      | 520     |
| zIndex              | 遮罩的 z-index 值                                                | number                                | 1000    |
| type                | —                                                                | ModalConfirmType                      | —       |

以上函数调用后，会返回一个引用，可以通过该引用更新和关闭弹窗。

<DemoBlock id="zh-CN-show-modal-14" title="Modal.method()" kind="code" />

- `Modal.destroyAll`

使用 Modal.destroyAll() 可以销毁命令式及以上`.info()`等创建的弹窗。

- `Modal.useModal`
  当你需要使用 Context 时，可以通过 Modal.useModal 创建一个 contextHolder 插入相应的节点中。此时通过 hooks 创建的 Modal 将会得到 contextHolder 所在位置的所有上下文。创建的 modal 对象拥有与 [Modal.method](<#Modal.method()>) 相同的创建通知方法。

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

## FAQ

- #### 为什么使用 LocaleProvider 后， Modal.confirm 确认、取消按钮的文本没有国际化？

命令式 Modal 由独立应用实例挂载，不在当前 `ConfigProvider` 的 provide/inject 层级内，因此不会自动继承国际化配置。
你可以通过 `okText` 和 `cancelText` 这两个属性来根据 Locale 重新设置 i18 的文本。
也可以使用 `Modal.useModal()` 获取 modal 方法和 `ContextHolder` 组件，并在需要继承配置的位置渲染该组件，使其读取对应的 `ConfigProvider` 配置。

- #### 为什么 title 和 content 的间距在命令式调用和非命令式调用下不同?

命令式调用场景下，标题和内容的相关性更强，所以用更近的距离表达这种强相关性，符合预期。用户如果不想要这种效果，可以自己做样式覆盖。
