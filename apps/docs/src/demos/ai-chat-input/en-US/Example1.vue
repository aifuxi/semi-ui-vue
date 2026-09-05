<script setup lang="ts">
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';

function send(message: MessageContent) {
  console.log(message.inputContents, message.attachments);
}
import '@aifuxi/semi-theme-default/ai-chat-input.css';
</script>

<template>
  <AIChatInput
    placeholder="Ask a question and press Enter"
    :suggestions="['Summarize this page', 'Create action items']"
    :skills="[{ value: 'search', label: 'Web search' }]"
    @message-send="send"
  />
</template>
