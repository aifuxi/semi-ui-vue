# Chat 对话

`Chat` 对齐 Semi Design `v2.102.0`，提供受控消息、角色气泡、Markdown、附件、建议问题、反馈操作、上下文分隔和输入区。

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Chat, type ChatMessage } from '@aifuxi/semi-ui-vue';
import '@aifuxi/semi-theme-default/chat.css';

const chats = ref<ChatMessage[]>([
  { id: 'welcome', role: 'assistant', content: '你好，我能帮你做什么？' },
]);
</script>

<template>
  <Chat
    v-model:chats="chats"
    :hints="['介绍一下 Semi']"
    :role-config="{ assistant: { name: '助手' }, user: { name: '用户' } }"
    @message-send="(content, attachment) => console.log(content, attachment)"
  />
</template>
```

## Vue API

| 属性                                    | 说明                                             | 默认值      |
| --------------------------------------- | ------------------------------------------------ | ----------- |
| `chats` / `v-model:chats`               | 受控消息数组                                     | `[]`        |
| `align`                                 | `leftRight` 或 `leftAlign`                       | `leftRight` |
| `mode`                                  | `bubble`、`noBubble`、`userBubble`               | `bubble`    |
| `hints`                                 | 建议问题                                         | `[]`        |
| `roleConfig`                            | user/assistant/自定义角色名称、头像和颜色        | -           |
| `enableUpload`                          | 总开关或点击/粘贴/拖放三个上传开关               | `true`      |
| `sendHotKey`                            | `enter` 或 `shift+enter`                         | `enter`     |
| `canSend`                               | 显式覆盖发送可用状态                             | 自动计算    |
| `showStopGenerate` / `showClearContext` | 显示停止生成/清空上下文入口                      | `false`     |
| `escapeHtml`                            | 转义 user 消息中的 HTML                          | `true`      |
| `uploadProps` / `uploadTipProps`        | Upload 与上传提示配置                            | -           |
| `markdownRenderProps`                   | Markdown `breaks`、`linkify`、`typographer` 配置 | -           |

消息 `content` 可以是字符串，也可以是 `text`、`image_url`、`file_url` 内容数组。事件包括 `chats-change`、`message-send`、`input-change`、`hint-click`、`message-copy`、`message-delete`、`message-reset`、正/负反馈、`clear` 与 `stop-generator`。

React render props 映射为 `#top`、`#bottom`、`#hint`、`#divider`、`#input-area` 和 `#chat-box-*` scoped slots；原函数 prop 也保留用于渐进迁移。组件 ref 暴露 `sendMessage`、`resetMessage`、`clearContext`、`scrollToBottom` 和 `getContainerElement`。

## SSR、安全与可访问性

SSR import/render 不创建 Observer、拖放、剪贴板或滚动监听。textarea 保留多行输入语义，默认 hint 使用原生 button，图标按钮具有 aria-label。Vue 实现不通过 `v-html` 执行消息 HTML：即使显式设置 `escapeHtml=false`，原始 HTML 仍作为文本显示；这是为避免未清洗内容执行脚本而保留的安全 deviation。可信富内容可通过 `#chat-box-content` 自定义渲染。

完整证据见 [alignment.md](./alignment.md)，迁移说明见 [react-to-vue.md](./react-to-vue.md)。
