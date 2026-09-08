<script setup lang="ts">
import { ref } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { IconUpload } from '@aifuxi/semi-icons-vue';
const sent = ref<MessageContent>();
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput :upload-props="uploadProps" style="margin: 12px" @message-send="sent = $event"
      ><template #uploadButton="{ openFileDialog, disabled }"
        ><button
          type="button"
          :disabled="disabled"
          class="semi-button semi-button-borderless"
          aria-label="自定义上传"
          @click.stop="openFileDialog"
        >
          <IconUpload /></button></template
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
