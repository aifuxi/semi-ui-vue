<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import type { AIChatInputExposed } from '@aifuxi/semi-ui-vue/ai-chat-input';
const sent = ref<MessageContent>();
const input = useTemplateRef<AIChatInputExposed>('input');
const templates = {
  'input-slot': '我是一个<input-slot placeholder="[职业]">程序员</input-slot>',
  'select-slot':
    '我是<select-slot value="前端开发" options=\'["设计","前端开发","后端开发"]\'></select-slot>，帮我完成...',
  'skill-slot':
    '<skill-slot data-label="AI Coding" data-value="AI Coding" data-template=false></skill-slot> 帮我完成...',
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
