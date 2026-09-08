<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { AIChatInput, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { uploadProps } from './mockUpload';
import '@aifuxi/semi-theme-default/ai-chat-input.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Divider } from '@aifuxi/semi-ui-vue/divider';
import { IconDeleteStroked } from '@aifuxi/semi-icons-vue';
import type { AIChatInputExposed } from '@aifuxi/semi-ui-vue/ai-chat-input';
import NodeContent from './NodeContent';
const sent = ref<MessageContent>();
const input = useTemplateRef<AIChatInputExposed>('input');
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatInput
      ref="input"
      :upload-props="uploadProps"
      style="margin: 12px"
      @message-send="sent = $event"
      ><template #action="{ menuItem, className }"
        ><div :class="className">
          <div style="display: flex; align-items: center">
            <Button
              aria-label="Clear input"
              type="tertiary"
              style="border-radius: 50%"
              @click="input?.setContent('')"
              ><template #icon><IconDeleteStroked /></template></Button
            ><Divider layout="vertical" style="margin-left: 8px" />
          </div>
          <NodeContent :content="menuItem" /></div></template
    ></AIChatInput>
    <pre v-if="sent" class="sent-message">{{ JSON.stringify(sent, null, 2) }}</pre>
  </ConfigProvider>
</template>
