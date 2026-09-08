<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import ConfigurationControls from './ConfigurationControls.vue';
const sent = ref<MessageContent>();
const round = ref(false);
</script>
<template>
  <ConfigProvider :locale="locale"
    ><RadioGroup v-model="round" name="input-shape"
      ><Radio :value="true">圆形</Radio><Radio :value="false">方形</Radio></RadioGroup
    ><AIChatInput
      :upload-props="uploadProps"
      style="margin: 12px"
      :round="round"
      @message-send="sent = $event"
      ><template #configure><ConfigurationControls /></template
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
