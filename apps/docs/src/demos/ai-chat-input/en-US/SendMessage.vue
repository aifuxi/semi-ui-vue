<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';

const sent = ref<MessageContent>();
const references = ref([
  {
    id: '1',
    type: 'text',
    content: 'Test text: This is a long text repeated many times for demonstration purposes...',
  },
]);
const generating = ref(false);
const initialUploadProps = {
  ...uploadProps,
  defaultFileList: [
    {
      uid: '1',
      name: 'dy.jpeg',
      status: 'success' as const,
      size: '130kb',
      url: '/demos/photo.svg',
    },
    {
      uid: '5',
      name: 'resso.jpeg',
      status: 'success' as const,
      percent: 50,
      size: '222kb',
      url: '/demos/photo.svg',
    },
  ],
};
function send(message: MessageContent) {
  sent.value = message;
  generating.value = true;
  references.value = [];
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="initialUploadProps"
      style="margin: 12px"
      :default-content="'Click Send to observe attachment, reference, and input changes'"
      :generating="generating"
      :references="references"
      @stop-generate="generating = false"
      @reference-delete="references = references.filter((r) => r.id !== $event.id)"
      @message-send="send"
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
