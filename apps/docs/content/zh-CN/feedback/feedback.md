---
title: 'Feedback 反馈'
description: '快速定义各类型反馈'
type: 'feedback'
order: 89
icon: 'doc-feedback'
---

> **Vue 使用说明**：从 `@aifuxi/semi-ui-vue/feedback` 子路径引入组件，浏览器构建会自动按需加载默认主题。本页 Vue API 与示例以当前公开实现为准。

## 代码演示

### 如何引入

Feedback 自 2.85.0 支持。

<DemoBlock id="zh-CN-feedback-feedback-1" title="如何引入" kind="import" />

### 基本使用

通过 `v-model:visible` 控制是否显示。默认反馈内容是 emoji 形式；可通过 `onValueChange` callback 获取当前选择。

<DemoBlock id="zh-CN-feedback-feedback-2" title="基本使用" kind="live" />

### 文字类型

设置 `type` 为 `text` 可获得多行输入框形式的 feedback，可通过 `textAreaProps` 设置多行输入框的参数。

<DemoBlock id="zh-CN-feedback-feedback-3" title="文字类型" kind="live" />

### 单选反馈

设置 `type` 为 `radio` 可获得单选形式的 feedback，可通过 `radioGroupProps` 设置单选的参数。

<DemoBlock id="zh-CN-feedback-feedback-4" title="单选反馈" kind="live" />

### 多选反馈

设置 `type` 为 `checkbox` 可获得多选形式的 feedback，可通过 `checkboxGroupProps` 设置多选的参数。

<DemoBlock id="zh-CN-feedback-feedback-5" title="多选反馈" kind="live" />

### 自定义反馈内容

设置 `type` 为 `custom` 可展示自定义反馈内容，可通过 `#content` 插槽或 `renderContent` prop 转换内容。使用自定义反馈时，需通过 `okButtonProps` 自行控制提交按钮状态。

<DemoBlock id="zh-CN-feedback-feedback-6" title="自定义反馈内容" kind="live" />

### 模态对话框形式

可通过 `mode` 反馈的形式，默认是 `popup`, 设置为 `modal` 可获得模态对话框形式的展示。

<DemoBlock id="zh-CN-feedback-feedback-7" title="模态对话框形式" kind="live" />

### 反馈完成提示

反馈完成后，可以切换展示信息提示用户本次反馈已经完成。

<DemoBlock id="zh-CN-feedback-feedback-8" title="反馈完成提示" kind="live" />

## API 参考

### Vue 契约

> 以下内容以 `packages/ui/src/feedback/types.ts`、`packages/ui/src/modal/types.ts`、`packages/ui/src/side-sheet/types.ts` 的公开类型为准。

- `v-model:visible` 对应继承的 `visible` 与 `update:visible`。

#### Vue 用法

- `onOk`、`onCancel`、`onValueChange` 是组件控制流程使用的真实 callback props，不转换为 emits。
- `textAreaProps`、`radioGroupProps`、`checkboxGroupProps` 和按钮配置中的 `onXxx` 是嵌套配置 callback props。
- `content` 插槽优先于 `renderContent`；`header` 插槽仅在 modal 模式生效。
- 其余容器 props 继承自 `ModalProps` 与 `SideSheetProps`，按 mode 转发。

#### Vue 事件

**Feedback**

| 事件           | 参数               | 说明                 |
| -------------- | ------------------ | -------------------- |
| update:visible | [visible: boolean] | 更新 v-model:visible |

#### Vue 插槽

**Feedback**

| 插槽      | 作用域参数  | 说明             |
| --------- | ----------- | ---------------- |
| default   | {}          | 默认反馈内容     |
| content   | { content } | 转换默认反馈内容 |
| title     | {}          | 标题             |
| header    | {}          | modal 模式头部   |
| footer    | {}          | 底部操作区       |
| closeIcon | {}          | 关闭图标         |

### FeedbackProps

除去下面参数列表所列参数外，当 `mode` 为 `modal` 时, FeedbackProps 还支持 [ModalProps](/zh-CN/show/modal#Modal) 中的参数，
当 `mode` 为 `popup` 时, FeedbackProps 还支持 [SideSheetProps](/zh-CN/show/sidesheet#API%20%E5%8F%82%E8%80%83) 中的参数

| 属性                | 说明                                            | 类型                                                   | 默认值  |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------ | ------- |
| afterClose          | —                                               | () =&gt; void                                          | —       |
| bodyStyle           | —                                               | StyleValue                                             | —       |
| cancelLoading       | —                                               | boolean                                                | —       |
| cancelText          | —                                               | string                                                 | —       |
| centered            | —                                               | boolean                                                | —       |
| closable            | —                                               | boolean                                                | —       |
| closeIcon           | —                                               | VNodeChild                                             | —       |
| closeOnEsc          | —                                               | boolean                                                | —       |
| confirmLoading      | —                                               | boolean                                                | —       |
| content             | —                                               | VNodeChild                                             | —       |
| direction           | —                                               | ConfigDirection                                        | —       |
| footerFill          | —                                               | boolean                                                | —       |
| fullScreen          | —                                               | boolean                                                | —       |
| getContainerContext | —                                               | () =&gt; unknown                                       | —       |
| getPopupContainer   | —                                               | () =&gt; HTMLElement                                   | —       |
| hasCancel           | —                                               | boolean                                                | —       |
| header              | —                                               | VNodeChild                                             | —       |
| height              | —                                               | number \| string                                       | —       |
| icon                | —                                               | VNodeChild                                             | —       |
| keepDOM             | —                                               | boolean                                                | —       |
| lazyRender          | —                                               | boolean                                                | —       |
| mask                | —                                               | boolean                                                | —       |
| maskClosable        | —                                               | boolean                                                | —       |
| maskFixed           | —                                               | boolean                                                | —       |
| maskStyle           | —                                               | StyleValue                                             | —       |
| modalContentClass   | —                                               | HTMLAttributes['class']                                | —       |
| modalRender         | —                                               | (dialog: VNodeChild) =&gt; VNodeChild                  | —       |
| motion              | —                                               | boolean                                                | —       |
| okText              | —                                               | string                                                 | —       |
| okType              | —                                               | ButtonType                                             | —       |
| onAfterClose        | —                                               | () =&gt; void                                          | —       |
| preventScroll       | —                                               | boolean                                                | —       |
| size                | —                                               | SideSheetSize                                          | —       |
| style               | —                                               | StyleValue                                             | —       |
| title               | —                                               | VNodeChild                                             | —       |
| visible             | —                                               | boolean                                                | —       |
| width               | —                                               | number \| string                                       | —       |
| zIndex              | —                                               | number                                                 | —       |
| aria-label          | —                                               | string                                                 | —       |
| afterVisibleChange  | —                                               | (visible: boolean) =&gt; void                          | —       |
| canVerticalSetWidth | —                                               | boolean                                                | —       |
| disableScroll       | —                                               | boolean                                                | —       |
| headerStyle         | —                                               | StyleValue                                             | —       |
| placement           | —                                               | SideSheetPlacement                                     | —       |
| cancelButtonProps   | 取消按钮配置；其中事件字段是嵌套 callback props | FeedbackButtonProps                                    | -       |
| checkboxGroupProps  | 多选配置；onChange 是嵌套 callback prop         | FeedbackCheckboxGroupProps                             | -       |
| class               | Vue 原生类名                                    | HTMLAttributes['class']                                | —       |
| className           | 样式类名                                        | HTMLAttributes['class']                                | —       |
| footer              | —                                               | VNodeChild                                             | —       |
| mode                | 展示容器类型                                    | FeedbackMode                                           | `popup` |
| okButtonProps       | 提交按钮配置；其中事件字段是嵌套 callback props | FeedbackButtonProps                                    | -       |
| onCancel            | 取消操作 callback，可返回 Promise               | FeedbackActionHandler                                  | 无      |
| onOk                | 提交操作 callback，可返回 Promise               | FeedbackActionHandler                                  | 无      |
| onValueChange       | 反馈值变化 callback                             | (value: Exclude&lt;FeedbackValue, null&gt;) =&gt; void | —       |
| radioGroupProps     | 单选配置；onChange 是嵌套 callback prop         | FeedbackRadioGroupProps                                | -       |
| renderContent       | 内容转换 callback；content 插槽优先             | (content: VNodeChild) =&gt; VNodeChild                 | -       |
| textAreaProps       | 文本输入配置；onChange 是嵌套 callback prop     | FeedbackTextAreaProps                                  | -       |
| type                | 反馈输入类型                                    | FeedbackType                                           | `emoji` |
