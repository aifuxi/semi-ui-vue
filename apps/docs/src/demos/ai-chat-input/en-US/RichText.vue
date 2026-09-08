<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import type { AIChatInputExposed } from '@aifuxi/semi-ui-vue/ai-chat-input';
const sent = ref<MessageContent>();
const input = useTemplateRef<AIChatInputExposed>('input');
const templates = {
  'input-slot': 'I am an <input-slot placeholder="[Occupation]">engineer</input-slot>',
  'select-slot':
    'I am a <select-slot value="Front-end Developer" options=\'["Designer","Front-end Developer","Back-end Developer"]\'></select-slot>, please help me complete...',
  'skill-slot':
    '<skill-slot data-label="AI Coding" data-value="AI Coding"></skill-slot> Please help me complete...',
};
const active = ref('input-slot');
function setTemplate(name: keyof typeof templates) {
  active.value = name;
  input.value?.setContent(templates[name]);
  input.value?.focusEditor();
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="display: flex; gap: 8px">
      <button
        v-for="(_, name) in templates"
        :key="name"
        :aria-pressed="active === name"
        @click="setTemplate(name)"
      >
        {{ name }}
      </button>
    </div>
    <AIChatInput
      ref="input"
      :upload-props="uploadProps"
      style="margin: 12px"
      :default-content="templates['input-slot']"
      @message-send="sent = $event"
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
