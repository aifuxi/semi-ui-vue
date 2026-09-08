<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { h } from 'vue';
import { AIChatInputConfigure } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { IconTemplateStroked, IconSearch } from '@aifuxi/semi-icons-vue';
import ReferenceItems from './ReferenceItems.vue';
const sent = ref<MessageContent>();
const references = ref([
  {
    type: 'file',
    key: '1',
    name: 'horizontalScroller.tsx',
    path: 'packages/semi-ui/AIChatInput/horizontalScroller.tsx',
    id: '1',
  },
  {
    type: 'folder',
    key: '2',
    name: 'AIChatInput',
    path: 'packages/semi-ui/AIChatInput',
    id: '2',
  },
  {
    type: 'web',
    key: '3',
    name: 'web',
    id: '3',
  },
  {
    type: 'change',
    key: '4',
    name: 'recentChange',
    id: '4',
  },
  {
    type: 'branch',
    key: '5',
    name: 'Branch',
    detail: 'Diff with Main Branch',
    branch: 'feat/aichatinput',
    targetBranch: 'feat/targetBranch',
    id: '5',
  },
  {
    type: 'terminal',
    key: '6',
    name: 'From 1-2',
    from: 1,
    to: 2,
    id: '6',
  },
]);
const options = [
  { label: h(IconTemplateStroked), value: 'fast' },
  { label: h(IconSearch), value: 'think' },
];
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      :references="references"
      :show-upload-file="false"
      :show-reference="false"
      @message-send="sent = $event"
      ><template #configure
        ><AIChatInputConfigure.RadioButton
          :options="options"
          field="mode"
          init-value="fast" /></template
      ><template #top="{ attachments, handleUploadFileDelete }"
        ><ReferenceItems
          :items="references"
          @remove="references.splice($event, 1)" /><ReferenceItems
          :items="attachments"
          @remove="handleUploadFileDelete(attachments[$event]!)" /></template
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
