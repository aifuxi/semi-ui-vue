<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
const content = ref('');
const files = ref(0);
const sent = ref<MessageContent>();
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      placeholder="Enter content or upload files..."
      :upload-props="uploadProps"
      style="margin: 12px"
      @content-change="content = JSON.stringify($event)"
      @upload-change="files = $event.fileList.length"
      @message-send="sent = $event"
    /><output>Content: {{ content }} · Files: {{ files }}</output>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
