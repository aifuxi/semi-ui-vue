<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
import {
  streamingResponseToMessage,
  type StreamingResponseState,
  type ResponseChunk,
} from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { FIXED_SHUFFLED_INDICES, REASONING_CHUNKS } from './adapterData';
const chats = ref<Message[]>([]);
let timer: ReturnType<typeof setInterval> | undefined;
let count = 0;
let state: StreamingResponseState | undefined;
// Preserve duplicate and delayed sequence numbers from the fixed upstream example.
onMounted(() => {
  timer = setInterval(() => {
    count += 1;
    const chunks = FIXED_SHUFFLED_INDICES.slice(0, count).map(
      (i) => REASONING_CHUNKS[i],
    ) as ResponseChunk[];
    const result = streamingResponseToMessage(chunks, state);
    if (result?.message) {
      chats.value = [result.message];
      state = result.nextState ?? undefined;
    }
    if (count >= FIXED_SHUFFLED_INDICES.length) clearInterval(timer);
  }, 200);
});
onBeforeUnmount(() => clearInterval(timer));
</script>
<template>
  <ConfigProvider :locale="locale"
    ><AIChatDialogue v-model:chats="chats" :role-config="roleConfig"></AIChatDialogue
  ></ConfigProvider>
</template>
