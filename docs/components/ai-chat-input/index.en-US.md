# AIChatInput

AIChatInput matches Semi Design v2.102.0 for rich-text input, skills, suggestions, templates, references, attachments, and generating state. It uses Tiptap 3.10.7 and maps the React contract to Vue props, emits, scoped slots, and exposed methods.

```ts
import { AIChatInput } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
```

```vue
<script setup lang="ts">
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue';

function send(message: MessageContent) {
  console.log(message.inputContents, message.attachments);
}
</script>

<template>
  <AIChatInput
    placeholder="Ask a question and press Enter"
    :suggestions="['Summarize this page', 'Create action items']"
    :skills="[{ value: 'search', label: 'Web search' }]"
    @message-send="send"
  />
</template>
```

## Core API

| Prop                                                    | Description                                               | Default            |
| ------------------------------------------------------- | --------------------------------------------------------- | ------------------ |
| `defaultContent` / `placeholder` / `extensions`         | Initial Tiptap content, placeholder, and extra extensions | -                  |
| `references` / `uploadProps`                            | References and Upload configuration                       | `[]` / `{}`        |
| `suggestions` / `skills` / `skillHotKey`                | Suggestions, skills, and the skill shortcut               | -                  |
| `showReference` / `showUploadFile` / `showUploadButton` | Shows references, attachments, and upload control         | `true`             |
| `generating` / `canSend`                                | Generating state and optional send override               | `false` / inferred |
| `sendHotKey`                                            | `'enter'` or `'shift+enter'`                              | `'enter'`          |
| `round` / `dropdownMatchTriggerWidth`                   | Rounded footer and trigger-width popup                    | `true`             |
| `clearContentOnGenerating` / `keepSkillAfterSend`       | Clears on generation and optionally preserves the skill   | `true` / `false`   |

Emits include `contentChange`, `messageSend`, `stopGenerate`, `focus`, `blur`, `paste`, `referenceClick`, `referenceDelete`, `uploadChange`, `configureChange`, `suggestClick`, `skillChange`, and `templateVisibleChange`. Exposed methods are `setContent`, `getEditor`, `focusEditor`, `deleteContent`, `deleteUploadFile`, `changeTemplateVisible`, and `setContentWhileSaveTool`.

## Slots and Configure

`#reference`, `#uploadButton`, `#top`, `#configure`, `#action`, `#suggestion`, `#skill`, and `#template` replace React render props. `AIChatInput.Configure` supplies `Button`, `Select`, `RadioButton`, and `Mcp` items with per-instance provider state.

## SSR and accessibility

SSR import and rendering do not create an EditorView, Portal, or document listener. Tiptap starts after client mount and is destroyed on unmount. The editor is a real `contenteditable`; suggestion and skill panels use listbox/option semantics, and send, stop, upload, and delete controls expose accessible names.

See the [React-to-Vue guide](./react-to-vue.md) and the [alignment matrix](./alignment.md).
