---
title: 'AI对话'
description: '用户展示 AI 聊天中的对话信息'
locale: 'zh-CN'
slug: 'ai-chat-dialogue'
category: 'ai'
order: 102
englishTitle: 'AIChatDialogue'
icon: 'doc-aiDialogue'
upstream: 'ai/aiChatDialogue'
---

`AIChatDialogue` 对齐 Semi Design v2.102.0 的 AI 对话展示组件，覆盖受控消息、三种气泡模式、角色布局、OpenAI Response 内容项、附件、推理、引用、反馈操作、选择与滚动。

::demo-block{demo="ai-chat-dialogue/zh-CN/Example1" title="AI对话"}
::

## 固定上游示例

React代码文本迁移Vue，头像/图片本地化；render props迁移为插槽和局部SFC。上游遗漏的hooks/Toast/适配器导入已补齐或替换为可见事件输出。流式Chat Completion按前缀独立转换，避免闭包状态与重复增量；Response保留乱序、重复和延迟序列并使用返回的nextState。

### 基本用法

::demo-block{demo="ai-chat-dialogue/zh-CN/Basic" title="基本用法"}
::

### 消息状态

::demo-block{demo="ai-chat-dialogue/zh-CN/Status" title="消息状态"}
::

### 消息展示

::demo-block{demo="ai-chat-dialogue/zh-CN/MessageTypes" title="消息展示"}
::

### 引用

::demo-block{demo="ai-chat-dialogue/zh-CN/References" title="引用"}
::

### 选择

::demo-block{demo="ai-chat-dialogue/zh-CN/Selecting" title="选择"}
::

### 提示

::demo-block{demo="ai-chat-dialogue/zh-CN/Hints" title="提示"}
::

### 自定义渲染提示

::demo-block{demo="ai-chat-dialogue/zh-CN/CustomHints" title="自定义渲染提示"}
::

### 自定义渲染会话框

::demo-block{demo="ai-chat-dialogue/zh-CN/CustomBox" title="自定义渲染会话框"}
::

### 自定义渲染消息内容

::demo-block{demo="ai-chat-dialogue/zh-CN/CustomContent" title="自定义渲染消息内容"}
::

### Chat Completion 数据转换

::demo-block{demo="ai-chat-dialogue/zh-CN/ChatCompletion" title="Chat Completion 数据转换"}
::

### 流式 Chat Completion 转换

::demo-block{demo="ai-chat-dialogue/zh-CN/StreamingChatCompletion" title="流式 Chat Completion 转换"}
::

### Response 数据转换

::demo-block{demo="ai-chat-dialogue/zh-CN/Response" title="Response 数据转换"}
::

### 流式 Response 转换

固定上游英文的增量文本为英文，但最终完成响应仍为中文；本例保留这一数据差异。

::demo-block{demo="ai-chat-dialogue/zh-CN/StreamingResponse" title="流式 Response 转换"}
::

## 主要 API

| 属性                        | 类型                                     | 默认值        | 说明                                                                                   |
| --------------------------- | ---------------------------------------- | ------------- | -------------------------------------------------------------------------------------- |
| `chats`                     | `AIChatDialogueMessage[]`                | `[]`          | 受控消息；支持 `v-model:chats`                                                         |
| `roleConfig`                | `AIChatDialogueRoleConfig`               | 必填          | user/assistant/system 或自定义角色元数据；每个角色也可为按 `message.name` 索引的 `Map` |
| `align`                     | `'leftRight' \| 'leftAlign'`             | `'leftRight'` | 用户消息左右分布或全部左对齐                                                           |
| `mode`                      | `'bubble' \| 'noBubble' \| 'userBubble'` | `'bubble'`    | 全气泡、无气泡或仅用户气泡                                                             |
| `hints`                     | `string[]`                               | `[]`          | 建议项，点击后先追加 user 消息再发出 `hint-click`                                      |
| `selecting`                 | `boolean`                                | `false`       | 显示消息选择框                                                                         |
| `escapeHtml`                | `boolean`                                | `true`        | 转义用户 Markdown 中的 HTML                                                            |
| `showReset`                 | `boolean`                                | `true`        | 最后一条 assistant 消息显示重试操作                                                    |
| `showReference`             | `boolean`                                | `false`       | 用户文字/文件消息显示引用入口                                                          |
| `disabledFileItemClick`     | `boolean`                                | `false`       | 保留 `file-click`，阻止附件链接导航                                                    |
| `markdownRenderProps`       | `Partial<MarkdownRenderProps>`           | -             | 透传给 MarkdownRender；`components.code` 可覆盖默认增强代码块                          |
| `dialogueRenderConfig`      | `DialogueRenderConfig`                   | -             | 自定义 avatar/title/content/action/full dialogue                                       |
| `renderDialogueContentItem` | `DialogueContentItemRendererMap`         | -             | 按 item type 或工具函数名自定义内容                                                    |

事件包括 `update:chats`、`chats-change`、`select`、`hint-click`、`annotation-click`、`reference-click`、`file-click`、`image-click`，以及 `message-copy/share/edit/delete/reset/good-feedback/bad-feedback`。

组件 ref 暴露 `selectAll()`、`deselectAll()`、`scrollToBottom(animation?)`、`scrollToTop(animation?)` 和 `getContainerElement()`。

## Vue 插槽

- `#dialogue-avatar`、`#dialogue-title`、`#dialogue-content`、`#dialogue-action`、`#full-dialogue` 对应 React render config。
- `#hint="{ content, index, onHintClick }"` 自定义建议项。
- `#message-edit="{ value }"` 自定义消息编辑区。

静态子组件同时作为命名导出提供：`AIChatDialogueReasoning`、`AIChatDialogueStep`、`AIChatDialogueAnnotation`、`AIChatDialogueCode`。数据适配器可从组件入口或 `@aifuxi/semi-ui-vue/ai-chat-dialogue/data-adapter` 导入。

完整差异和验收门禁见 [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/ai-chat-dialogue/alignment.md)，React 迁移见 [react-to-vue.md](#react-vue)。

## React → Vue

| React v2.102.0                               | Vue 3.5                                                         |
| -------------------------------------------- | --------------------------------------------------------------- |
| `chats={chats}` + `onChatsChange={setChats}` | `v-model:chats="chats"`，或 `:chats` + `@chats-change`          |
| `className`                                  | `class`；`className` 仍兼容                                     |
| `dialogueRenderConfig.renderDialogueAvatar`  | `#dialogue-avatar` 或同名函数配置                               |
| `renderDialogueTitle/Content/Action`         | `#dialogue-title/content/action`                                |
| `renderFullDialogue`                         | `#full-dialogue`                                                |
| `renderHintBox`                              | `#hint="{ content, index, onHintClick }"`                       |
| `messageEditRender`                          | `#message-edit="{ value }"`                                     |
| `onMessageGoodFeedback`                      | `@message-good-feedback`                                        |
| `onMessageBadFeedback`                       | `@message-bad-feedback`                                         |
| `onMessageCopy/Delete/Edit/Reset/Share`      | `@message-copy/delete/edit/reset/share`                         |
| `ref.current.selectAll()`                    | `dialogueRef.selectAll()`                                       |
| `AIChatDialogue.Reasoning`                   | `AIChatDialogue.Reasoning` 或命名导出 `AIChatDialogueReasoning` |
| `AIChatDialogue.defaultComponents.code`      | 同名静态属性或 `AIChatDialogueCode`                             |

Vue 不接受 ReactNode；头像、render 配置和内容 renderer 返回 Vue `VNodeChild`。公开消息与 OpenAI 数据形状保持不变。

```vue
<AIChatDialogue v-model:chats="chats" :role-config="roles">
  <template #dialogue-title="{ message, role }">
    <strong>{{ role?.name }} · {{ message.id }}</strong>
  </template>
</AIChatDialogue>
```

数据转换函数保持名称不变：`chatCompletionToMessage`、`streamingChatCompletionToMessage`、`responseToMessage`、`streamingResponseToMessage`、`chatInputToMessage`、`chatInputToChatCompletion` 和 `messageToChatInput`。
