<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import type { AIChatInputContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
const sent = ref<MessageContent>();
const suggestions = ref<string[]>([]);
const template = ['天气如何', '空气质量', '工作进程', '日程安排'];
function update(contents: AIChatInputContent[]) {
  const value = typeof contents[0]?.text === 'string' ? contents[0].text : '';
  suggestions.value =
    value.length > 0 && value.length < 4 && !value.includes('\n')
      ? template.map((item) => value + '，' + item)
      : [];
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      :suggestions="suggestions"
      @content-change="update"
      @message-send="sent = $event"
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
