# Chat

`Chat` is aligned with Semi Design `v2.102.0` and provides controlled messages, role bubbles, Markdown, attachments, hints, feedback actions, context dividers, and an input area.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/chat.css';

const chats = ref<ChatMessage[]>([
  { id: 'welcome', role: 'assistant', content: 'Hello, how can I help?' },
]);
</script>

<template>
  <Chat
    v-model:chats="chats"
    :hints="['Introduce Semi']"
    :role-config="{ assistant: { name: 'Assistant' }, user: { name: 'User' } }"
    @message-send="(content, attachment) => console.log(content, attachment)"
  />
</template>
```

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

See [alignment.md](./alignment.md) for evidence and [react-to-vue.md](./react-to-vue.md) for migration details.
