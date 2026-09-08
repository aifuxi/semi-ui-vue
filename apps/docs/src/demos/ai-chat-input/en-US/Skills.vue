<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import {
  AIChatInput,
  type MessageContent,
  type AIChatInputExposed,
} from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { h } from 'vue';
import { AIChatInputConfigure } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { IconTemplateStroked, IconSearch } from '@aifuxi/semi-icons-vue';
import TemplatePanel from './TemplatePanel.vue';
const sent = ref<MessageContent>();
const input = useTemplateRef<AIChatInputExposed>('input');
function chooseTemplate(content: string) {
  input.value?.setContentWhileSaveTool(content);
  input.value?.focusEditor();
}
const skills = [
  {
    icon: null,
    value: 'writing',
    label: 'Writing',
    hasTemplate: true,
  },
  {
    icon: null,
    value: 'AI coding',
    label: 'AI coding',
  },
].map((item, index) => ({ ...item, icon: h(index ? IconSearch : IconTemplateStroked) }));
const modelOptions = [
  {
    value: 'GPT-5',
    label: 'GPT-5',
  },
  {
    value: 'GPT-4o',
    label: 'GPT-4o',
  },
  {
    value: 'Claude 3.5 Sonnet',
    label: 'Claude 3.5 Sonnet',
  },
];
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      ref="input"
      :upload-props="uploadProps"
      style="margin: 12px"
      :skills="skills"
      skill-hot-key="/"
      @message-send="sent = $event"
      ><template #configure
        ><AIChatInputConfigure.Select
          :option-list="modelOptions"
          field="model"
          init-value="GPT-4o" /></template
      ><template #template="{ skill }"
        ><TemplatePanel v-if="skill?.value === 'writing'" @select="chooseTemplate" /></template
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
