---
title: 'Chat'
description: 'Used to quickly build conversation content'
locale: 'en-US'
slug: 'chat'
category: 'plus'
order: 28
englishTitle: 'Chat'
icon: 'doc-chat'
upstream: 'plus/chat'
---

`Chat` is aligned with Semi Design `v2.102.0` and provides controlled messages, role bubbles, Markdown, attachments, hints, feedback actions, context dividers, and an input area.

::demo-block{demo="chat/en-US/Example1" title="Chat"}
::

## Upstream examples

Messages and states follow the pinned bilingual examples. Repository-owned images replace remote assets; customRequest simulates successful uploads locally without sending files to a remote service.

### Basic usage

::demo-block{demo="chat/en-US/Basic" title="Basic usage"}
::

### Message status

::demo-block{demo="chat/en-US/Status" title="Message status"}
::

### Dynamic data updates

::demo-block{demo="chat/en-US/Streaming" title="Dynamic data updates"}
::

### Clear context

::demo-block{demo="chat/en-US/ClearContext" title="Clear context"}
::

### Custom avatar and title

::demo-block{demo="chat/en-US/AvatarTitle" title="Custom avatar and title"}
::

### Custom actions

::demo-block{demo="chat/en-US/Actions" title="Custom actions"}
::

### Custom sources

::demo-block{demo="chat/en-US/Sources" title="Custom sources"}
::

### Custom full chat box

::demo-block{demo="chat/en-US/FullBox" title="Custom full chat box"}
::

### Custom input area

::demo-block{demo="chat/en-US/InputArea" title="Custom input area"}
::

### Hints

::demo-block{demo="chat/en-US/Hints" title="Hints"}
::

### Custom hints

::demo-block{demo="chat/en-US/CustomHints" title="Custom hints"}
::

The Button response is adapted to a Vue SFC. Scoped slots and local components implement avatar, action, source, full-message and form-input rendering. Language-specific hints are preserved. Source buttons support keyboard expansion/collapse, and image replies describe the local illustration.

## Vue API

| Prop                                    | Description                                             | Default     |
| --------------------------------------- | ------------------------------------------------------- | ----------- |
| `chats` / `v-model:chats`               | Controlled message array                                | `[]`        |
| `align`                                 | `leftRight` or `leftAlign`                              | `leftRight` |
| `mode`                                  | `bubble`, `noBubble`, or `userBubble`                   | `bubble`    |
| `hints`                                 | Suggested questions                                     | `[]`        |
| `roleConfig`                            | Names, avatars, and colors for built-in/custom roles    | -           |
| `enableUpload`                          | Global or click/paste/drag upload switches              | `true`      |
| `sendHotKey`                            | `enter` or `shift+enter`                                | `enter`     |
| `canSend`                               | Explicit send-state override                            | computed    |
| `showStopGenerate` / `showClearContext` | Show generation/context controls                        | `false`     |
| `escapeHtml`                            | Escape HTML in user messages                            | `true`      |
| `uploadProps` / `uploadTipProps`        | Upload and tooltip configuration                        | -           |
| `markdownRenderProps`                   | Markdown `breaks`, `linkify`, and `typographer` options | -           |

Message `content` accepts a string or an array of `text`, `image_url`, and `file_url` items. Events cover controlled changes, send/input/hint, copy/delete/reset, positive/negative feedback, clear, and stop-generation behavior.

React render props map to the typed `#top`, `#bottom`, `#hint`, `#divider`, `#input-area`, and `#chat-box-*` scoped slots. Function props remain available for incremental migrations. The component ref exposes `sendMessage`, `resetMessage`, `clearContext`, `scrollToBottom`, and `getContainerElement`.

## SSR, security, and accessibility

SSR import/render does not create observers, drag/drop, clipboard, or scroll listeners. The textarea retains multiline input semantics, default hints are native buttons, and icon buttons have accessible names. The Vue implementation never executes message HTML through `v-html`: raw HTML stays text even when `escapeHtml=false`. This documented security deviation prevents unsanitized script execution; use `#chat-box-content` for explicitly trusted rich content.

See [alignment.md](https://github.com/aifuxi/semi-ui-vue/blob/master/docs/components/chat/alignment.md) for evidence and [react-to-vue.md](#react-vue) for migration details.

## React → Vue

| Semi React v2.102.0                            | Vue 3.5+                                       |
| ---------------------------------------------- | ---------------------------------------------- |
| `chats` + `onChatsChange`                      | `v-model:chats`，同时发出 `chats-change`       |
| `onMessageSend(content, attachment)`           | `@message-send="(content, attachment) => ..."` |
| `onInputChange({ inputValue, attachment })`    | `@input-change`，payload 形状不变              |
| `renderHintBox(props)`                         | `#hint="{ content, index, onHintClick }"`      |
| `renderDivider(message)`                       | `#divider="{ message }"`                       |
| `renderInputArea(props)`                       | `#input-area="props"`                          |
| `chatBoxRenderConfig.renderChatBoxTitle`       | `#chat-box-title`                              |
| `renderChatBoxAvatar` / `renderChatBoxContent` | `#chat-box-avatar` / `#chat-box-content`       |
| `renderChatBoxAction` / `renderFullChatBox`    | `#chat-box-action` / `#chat-box`               |
| `topSlot` / `bottomSlot` ReactNode             | `#top` / `#bottom`                             |
| React ref methods                              | Vue 模板 ref 上的同名公开方法                  |

Vue 事件统一使用 kebab-case；`Message`、`Content`、角色、状态和枚举值保持固定版本命名。默认值为 `true` 的 `escapeHtml`、`enableUpload` 会区分缺省、显式 `false` 与显式 `true`，上传对象的缺省项仍为 `true`。

上游 `customMarkDownComponents` 中的 React 组件不能直接复用，请传入 Vue 组件映射或使用 `#chat-box-content`。出于安全边界，Vue 不执行未经清洗的原始 HTML；`escapeHtml=false` 仍显示为文本，可信 HTML 应在业务层清洗后通过自定义内容 slot 渲染。
