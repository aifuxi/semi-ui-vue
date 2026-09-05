<script setup lang="ts">
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';

function send(message: MessageContent) {
  console.log(message.inputContents, message.attachments);
}
import '@aifuxi/semi-theme-default/ai-chat-input.css';
</script>

<template>
  <AIChatInput
    placeholder="输入问题，按 Enter 发送"
    :suggestions="['总结当前页面', '生成行动项']"
    :skills="[{ value: 'search', label: '联网搜索' }]"
    @message-send="send"
  />
</template>
