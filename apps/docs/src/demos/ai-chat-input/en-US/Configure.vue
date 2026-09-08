<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import ConfigurationControls from './ConfigurationControls.vue';
const sent = ref<MessageContent>();
const configuration = ref({});
const configured = ref(false);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      @configure-change="configuration = $event"
      @message-send="sent = $event"
      ><template #configure
        ><ConfigurationControls @configure="configured = true" /></template></AIChatInput
    ><output>{{ JSON.stringify(configuration) }} {{ configured }}</output>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
