# AIChatDialogue 智能对话

`AIChatDialogue` 对齐 Semi Design v2.102.0 的 AI 对话展示组件，覆盖受控消息、三种气泡模式、角色布局、OpenAI Response 内容项、附件、推理、引用、反馈操作、选择与滚动。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { AIChatDialogue, type AIChatDialogueMessage } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';

const chats = ref<AIChatDialogueMessage[]>([
  { id: '1', role: 'user', content: '什么是 Semi？', status: 'completed' },
  { id: '2', role: 'assistant', content: 'Semi 是现代应用设计系统。', status: 'completed' },
]);
</script>

<template>
  <AIChatDialogue
    v-model:chats="chats"
    :role-config="{ user: { name: '用户' }, assistant: { name: '助手' } }"
    :hints="['继续了解']"
    @hint-click="console.log"
  />
</template>
```

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

完整差异和验收门禁见 [alignment.md](./alignment.md)，React 迁移见 [react-to-vue.md](./react-to-vue.md)。
