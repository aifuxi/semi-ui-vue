# AIChatDialogue

`AIChatDialogue` mirrors Semi Design v2.102.0 for controlled AI conversations, role layouts, three bubble modes, OpenAI Response content items, files, reasoning, references, feedback actions, selection, and scrolling.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';

const chats = ref<AIChatDialogueMessage[]>([
  { id: '1', role: 'user', content: 'What is Semi?', status: 'completed' },
  { id: '2', role: 'assistant', content: 'Semi is a design system.', status: 'completed' },
]);
</script>

<template>
  <AIChatDialogue
    v-model:chats="chats"
    :role-config="{ user: { name: 'User' }, assistant: { name: 'Assistant' } }"
    :hints="['Learn more']"
  />
</template>
```

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

See [alignment.md](./alignment.md) for parity gates and [react-to-vue.md](./react-to-vue.md) for migration.
