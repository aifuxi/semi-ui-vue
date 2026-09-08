---
title: 'AIChatDialogue'
description: 'Display AI chat conversation messages to users'
locale: 'en-US'
slug: 'ai-chat-dialogue'
category: 'ai'
order: 102
englishTitle: 'AIChatDialogue'
icon: 'doc-aiDialogue'
upstream: 'ai/aiChatDialogue'
---

`AIChatDialogue` mirrors Semi Design v2.102.0 for controlled AI conversations, role layouts, three bubble modes, OpenAI Response content items, files, reasoning, references, feedback actions, selection, and scrolling.

::demo-block{demo="ai-chat-dialogue/en-US/Example1" title="AIChatDialogue"}
::

## Upstream examples

React code text is adapted to Vue, with local avatars/images and slots/local SFCs for render props. Missing upstream hook, Toast and adapter imports are resolved or replaced with visible event output. Streaming Chat Completion replays each prefix independently to avoid stale closures or repeated deltas; Response retains shuffled, duplicate and delayed sequences with nextState.

### Basic usage

::demo-block{demo="ai-chat-dialogue/en-US/Basic" title="Basic usage"}
::

### Message status

::demo-block{demo="ai-chat-dialogue/en-US/Status" title="Message status"}
::

### Message types

::demo-block{demo="ai-chat-dialogue/en-US/MessageTypes" title="Message types"}
::

### References

::demo-block{demo="ai-chat-dialogue/en-US/References" title="References"}
::

### Selection

::demo-block{demo="ai-chat-dialogue/en-US/Selecting" title="Selection"}
::

### Hints

::demo-block{demo="ai-chat-dialogue/en-US/Hints" title="Hints"}
::

### Custom hints

::demo-block{demo="ai-chat-dialogue/en-US/CustomHints" title="Custom hints"}
::

### Custom chat box

::demo-block{demo="ai-chat-dialogue/en-US/CustomBox" title="Custom chat box"}
::

### Custom message content

::demo-block{demo="ai-chat-dialogue/en-US/CustomContent" title="Custom message content"}
::

### Chat Completion adapter

::demo-block{demo="ai-chat-dialogue/en-US/ChatCompletion" title="Chat Completion adapter"}
::

### Streaming Chat Completion adapter

::demo-block{demo="ai-chat-dialogue/en-US/StreamingChatCompletion" title="Streaming Chat Completion adapter"}
::

### Response adapter

::demo-block{demo="ai-chat-dialogue/en-US/Response" title="Response adapter"}
::

### Streaming Response adapter

The fixed upstream example uses English deltas but keeps Chinese text in its final completed response; this data difference is preserved.

::demo-block{demo="ai-chat-dialogue/en-US/StreamingResponse" title="Streaming Response adapter"}
::

## Main API

| Prop                        | Type                                     | Default       | Description                                                |
| --------------------------- | ---------------------------------------- | ------------- | ---------------------------------------------------------- |
| `chats`                     | `AIChatDialogueMessage[]`                | `[]`          | Controlled messages; supports `v-model:chats`              |
| `roleConfig`                | `AIChatDialogueRoleConfig`               | required      | Role metadata or a `Map` keyed by `message.name`           |
| `align`                     | `'leftRight' \| 'leftAlign'`             | `'leftRight'` | Split user messages or align all messages left             |
| `mode`                      | `'bubble' \| 'noBubble' \| 'userBubble'` | `'bubble'`    | Bubble presentation                                        |
| `hints`                     | `string[]`                               | `[]`          | Suggestions that append a user message before `hint-click` |
| `selecting`                 | `boolean`                                | `false`       | Shows message checkboxes                                   |
| `escapeHtml`                | `boolean`                                | `true`        | Escapes HTML in user Markdown                              |
| `showReset`                 | `boolean`                                | `true`        | Shows retry on the last assistant message                  |
| `showReference`             | `boolean`                                | `false`       | Shows reference affordances for user text/files            |
| `disabledFileItemClick`     | `boolean`                                | `false`       | Emits `file-click` but prevents navigation                 |
| `markdownRenderProps`       | `Partial<MarkdownRenderProps>`           | -             | Forwarded to MarkdownRender                                |
| `dialogueRenderConfig`      | `DialogueRenderConfig`                   | -             | Custom avatar/title/content/action/full rendering          |
| `renderDialogueContentItem` | `DialogueContentItemRendererMap`         | -             | Item-type and tool-name renderers                          |

Events include `update:chats`, `chats-change`, `select`, `hint-click`, annotation/reference/file/image events, and all copy/share/edit/delete/reset/feedback message events.

The component ref exposes `selectAll()`, `deselectAll()`, `scrollToBottom(animation?)`, `scrollToTop(animation?)`, and `getContainerElement()`.

Vue-native scoped slots map the React render props: `dialogue-avatar`, `dialogue-title`, `dialogue-content`, `dialogue-action`, `full-dialogue`, `hint`, and `message-edit`. Static widgets are also available as `AIChatDialogueReasoning`, `AIChatDialogueStep`, `AIChatDialogueAnnotation`, and `AIChatDialogueCode`.

See [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/ai-chat-dialogue/alignment.md) for parity gates and [react-to-vue.md](#react-vue) for migration.

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
