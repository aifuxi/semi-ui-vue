<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { AIChatInputConfigure } from '@aifuxi/semi-ui-vue/ai-chat-input';
import '@aifuxi/semi-theme-default/cascader.css';
const sent = ref<MessageContent>();
const treeData = [
  {
    label: 'GPT',
    value: 'GPT',
    children: [
      {
        label: 'GPT-4o',
        value: 'GPT-4o',
      },
      {
        value: 'GPT-5',
        label: 'GPT-5',
      },
    ],
  },
  {
    label: 'Claude',
    value: 'Claude',
    children: [
      {
        label: 'Claude 3.5 Sonnet',
        value: 'Claude 3.5 Sonnet',
      },
    ],
  },
];
const configuration = ref({});
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      @configure-change="configuration = $event"
      @message-send="sent = $event"
      ><template #configure
        ><AIChatInputConfigure.Item
          v-slot="{ value, onChange }"
          field="model"
          :init-value="['GPT', 'GPT-4o']"
          ><Cascader
            :model-value="value as string[]"
            :tree-data="treeData"
            @change="onChange" /></AIChatInputConfigure.Item></template></AIChatInput
    ><output>{{ JSON.stringify(configuration) }}</output>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
