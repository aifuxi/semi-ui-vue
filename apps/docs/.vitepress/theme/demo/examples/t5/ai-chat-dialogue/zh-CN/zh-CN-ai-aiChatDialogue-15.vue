<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
import {
  streamingChatCompletionToMessage,
  type ChatCompletionChunk,
} from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { STREAMING_CHAT_COMPLETION_DATA } from './adapterData';
const chats = ref<Message[]>([]);
let timer: ReturnType<typeof setInterval> | undefined;
let count = 0;
// Replay each prefix without previous state so text deltas are not accumulated twice.
onMounted(() => {
  timer = setInterval(() => {
    count += 1;
    const result = streamingChatCompletionToMessage(
      STREAMING_CHAT_COMPLETION_DATA.slice(0, count) as ChatCompletionChunk[],
    );
    // Like the upstream example, select the first generated answer.
    chats.value = result.messages.slice(0, 1);
    if (count >= STREAMING_CHAT_COMPLETION_DATA.length) clearInterval(timer);
  }, 100);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue v-model:chats="chats" :role-config="roleConfig"></AIChatDialogue
  ></ConfigProvider>
</template>
