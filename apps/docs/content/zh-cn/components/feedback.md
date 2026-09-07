---
title: '反馈'
description: '快速定义各类型反馈'
locale: 'zh-CN'
slug: 'feedback'
category: 'feedback'
order: 89
englishTitle: 'Feedback'
icon: 'doc-feedback'
upstream: 'feedback/feedback'
---

`Feedback` 用 Modal 或底部 SideSheet 收集文本、表情、单选、复选或自定义反馈。实现固定对齐 Semi Design v2.102.0；可见性由调用方通过 `v-model:visible` 控制。

## 代码演示

### 如何引入

```ts
import { Feedback } from '@aifuxi/semi-ui-vue/feedback';
import '@aifuxi/semi-theme-default/feedback.css';
```

### 基本使用

通过 `visible` 控制展示，默认使用 popup 与 emoji；`@value-change` 获取当前选择。示例通过提交或取消回调关闭。

::demo-block{demo="feedback/zh-CN/Basic" title="基本使用"}
::

### 文字类型

`type="text"` 展示多行输入框，通过 `textAreaProps` 设置参数；本例保留上游的 `maxCount: 200`。

::demo-block{demo="feedback/zh-CN/Text" title="文字类型"}
::

### 单选反馈

`type="radio"` 与 `radioGroupProps.options` 展示纵向身份选项。

::demo-block{demo="feedback/zh-CN/Radio" title="单选反馈"}
::

### 多选反馈

`type="checkbox"` 与 `checkboxGroupProps.options` 支持多选产品；清空选择后提交按钮重新禁用。

::demo-block{demo="feedback/zh-CN/Checkbox" title="多选反馈"}
::

### 自定义反馈内容

`type="custom"` 使用默认 slot 替代 React `renderContent`，并通过 `okButtonProps.disabled` 自行控制提交状态。

::demo-block{demo="feedback/zh-CN/Custom" title="自定义反馈内容"}
::

### 模态对话框形式

`mode="modal"` 改为模态对话框。标题按固定上游保留英文。

::demo-block{demo="feedback/zh-CN/Modal" title="模态对话框形式"}
::

### 反馈完成提示

Popup 与 Modal 各有独立状态。提交后展示成功插画与感谢信息，隐藏标题和 footer，1500ms 后关闭，再等待 200ms 复原提示；示例卸载时清理定时器。

::demo-block{demo="feedback/zh-CN/Completion" title="反馈完成提示"}
::

双语示例与固定上游七项顺序一致，无独有示例或额外文件依赖。完成提示的触发按钮、标题保留上游英文；英文示例通过 `ConfigProvider` 传入完整的 `locale/source/en_US` 数据，使内置按钮在页面与在线编辑器都使用英文；只传 `{ code: 'en-US' }` 不会自动补齐 `Feedback` 文案。

自定义示例将上游 `useState(value)` 自引用初始化修正为空字符串；英文受控输入使用 `v-model`，不沿用上游 `useCallback` 遗漏 `value` 依赖的旧值闭包。完成提示沿用现有 Vue 的 `footer: null` 隐藏语义；本批仅验证基础运行，不代表严格 React/Vue 视觉与行为验收。

## 内容类型

- `text`：单个 TextArea；可通过 `textAreaProps` 配置。
- `emoji`：`😞`、`😐`、`😃`；选择 `😞` 后出现可选原因输入框。
- `radio` / `checkbox`：分别通过 `radioGroupProps` / `checkboxGroupProps` 提供 `options`。
- `custom`：渲染默认 slot。若需包裹内置内容，使用 `#content="{ content }"` 或 `renderContent`。

```vue
<Feedback
  v-model:visible="visible"
  mode="modal"
  type="radio"
  title="主要问题是什么？"
  :radio-group-props="{
    options: [
      { label: '交互不清晰', value: 'interaction' },
      { label: '响应较慢', value: 'performance' },
    ],
  }"
  @cancel="visible = false"
  @ok="visible = false"
/>
```

## API

| Prop                                  | 类型                                                     | 默认值    | 说明                                      |
| ------------------------------------- | -------------------------------------------------------- | --------- | ----------------------------------------- |
| `mode`                                | `'popup' \| 'modal'`                                     | `'popup'` | SideSheet 或 Modal 容器                   |
| `type`                                | `'text' \| 'emoji' \| 'radio' \| 'checkbox' \| 'custom'` | `'emoji'` | 反馈内容                                  |
| `visible`                             | `boolean`                                                | `false`   | 容器可见性，支持 `v-model:visible`        |
| `textAreaProps`                       | `FeedbackTextAreaProps`                                  | -         | TextArea 配置                             |
| `radioGroupProps`                     | `FeedbackRadioGroupProps`                                | -         | RadioGroup 配置                           |
| `checkboxGroupProps`                  | `FeedbackCheckboxGroupProps`                             | -         | CheckboxGroup 配置                        |
| `renderContent`                       | `(content: VNodeChild) => VNodeChild`                    | -         | 包裹或替换已生成内容                      |
| `okButtonProps` / `cancelButtonProps` | `FeedbackButtonProps`                                    | -         | 默认 footer 按钮配置                      |
| `footer`                              | `VNodeChild`                                             | 默认按钮  | popup footer；也可用 `#footer`            |
| `onOk` / `onCancel`                   | `(event) => void \| Promise`                             | noop      | 操作回调；popup 可用 Promise 驱动 loading |

`value-change` 返回：文本/单选为字符串，复选为数组，表情为 `{ emoji, text? }`。提交按钮在值为空或复选数组为空时禁用。popup 的确定/取消不会自行修改父级 `visible`，请在回调中关闭；Modal 沿用既有异步关闭规则。

## Portal、国际化与 SSR

可通过 `getPopupContainer` 指定首次挂载时已存在的容器。取消/提交文案来自 `LocaleProvider` 或 `ConfigProvider` 的 `Feedback` locale。模块导入 SSR-safe；Portal 和浏览器监听只在挂载后创建并在卸载时清理。

React 迁移见 [react-to-vue.md](#react-vue)，完整对齐证据见 [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/feedback/alignment.md)。

## React → Vue

| Semi React v2.102.0                           | Vue                                                   |
| --------------------------------------------- | ----------------------------------------------------- |
| `<Feedback visible={visible} />`              | `<Feedback v-model:visible="visible" />`              |
| `mode="popup"` / `mode="modal"`               | 同名 `mode` prop                                      |
| `type="emoji"` 等五种类型                     | 同名 `type` prop                                      |
| `onValueChange={handleValue}`                 | `@value-change="handleValue"`                         |
| `onOk={handleOk}` / `onCancel={handleCancel}` | `@ok="handleOk"` / `@cancel="handleCancel"`           |
| `children` 且 `type="custom"`                 | 默认 slot 且 `type="custom"`                          |
| `renderContent={content => ...}`              | `#content="{ content }"`，或保留 `renderContent` prop |
| `footer={<Footer />}`                         | `#footer`，或 `footer` prop                           |
| `title={<Title />}`                           | `#title`，或 `title` prop                             |
| `className` / `style`                         | 优先使用 Vue 原生 `class` / `style`                   |

`visible` 仍是父级受控状态。popup 的默认按钮只调用 `onOk` / `onCancel`，不会替调用方关闭；Modal 的 Promise 关闭流程由 Modal 处理。回调若必须返回 Promise，请使用 `:on-ok="handler"` / `:on-cancel="handler"`，以保留返回值给内部异步状态机。

固定 React Adapter 的 `className` 拼接存在字面 `.className` 行为，本实现为了像素兼容予以保留；普通 Vue 代码应使用 `class`。emoji 项保持上游可点击 `span` 的语义，没有额外创造键盘角色。
