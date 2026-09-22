<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';

const sent = ref<MessageContent>();
const references = ref([
  {
    id: '1',
    type: 'text',
    content:
      '测试文本，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字,这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字，这里是一段很长的文字',
  },
  {
    id: '2',
    name: '飞书文档.docx',
    type: 'file',
  },
  {
    id: '3',
    name: '飞书文档.pdf',
    type: 'file',
  },
  {
    id: '4',
    name: 'Music.mp4',
    type: 'file',
  },
  {
    id: '5',
    name: 'Image.jpeg',
    url: '/demos/photo.svg',
    type: 'file',
  },
  {
    id: '6',
    name: 'code.json',
    type: 'file',
  },
]);
const clicked = ref('');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      :references="references"
      @reference-delete="references = references.filter((r) => r.id !== $event.id)"
      @reference-click="clicked = $event.id"
      @message-send="sent = $event"
    ></AIChatInput
    ><output>{{ clicked }}</output>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
