<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue';
import { AIChatDialogue, type Message } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/ai-chat-dialogue.css';
const roleConfig = {
  user: { name: 'User', avatar: '/demos/one.svg' },
  assistant: { name: 'Assistant', avatar: '/demos/two.svg' },
  system: { name: 'System', avatar: '/demos/two.svg' },
};
import { Radio, RadioGroup } from '@aifuxi/semi-ui-vue/radio';
import type { AIChatDialogueExpose } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
const initialMessages = [
  {
    role: 'system',
    id: '1',
    createAt: 1715676751919,
    content: "Hello, I'm your AI assistant.",
  },
  {
    role: 'user',
    id: '2',
    createAt: 1715676751919,
    content: 'Give an example of using the Semi Design Button component',
  },
  {
    role: 'assistant',
    id: '3',
    createAt: 1715676751919,
    content:
      'Here is a Vue Button example:\n```vue\n<script setup>\nimport { Button } from "@aifuxi/semi-ui-vue/button";\n\u003c/script>\n<template><Button>Click me</Button></template>\n```',
  },
];
const chats = ref<Message[]>(initialMessages);
const dialogue = useTemplateRef<AIChatDialogueExpose>('dialogue');
const align = ref<'leftRight' | 'leftAlign'>('leftRight');
const selecting = ref(true);
const selection = ref('allSelect');
const selected = ref<string[]>([]);
onMounted(() => dialogue.value?.selectAll());
function changeSelection(value: unknown) {
  selection.value = String(value);
  if (value === 'allSelect') dialogue.value?.selectAll();
  else dialogue.value?.deselectAll();
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px">
      <RadioGroup v-model="align" type="button"
        ><Radio value="leftRight">leftRight</Radio
        ><Radio value="leftAlign">leftAlign</Radio></RadioGroup
      ><RadioGroup v-model="selecting" type="button"
        ><Radio :value="true">Enable</Radio><Radio :value="false">Disable</Radio></RadioGroup
      ><RadioGroup :model-value="selection" type="button" @update:model-value="changeSelection"
        ><Radio value="allSelect">Select all</Radio
        ><Radio value="cancelSelect">Deselect all</Radio></RadioGroup
      >
    </div>
    <AIChatDialogue
      ref="dialogue"
      v-model:chats="chats"
      :role-config="roleConfig"
      :align="align"
      :selecting="selecting"
      @select="selected = $event"
    ></AIChatDialogue
    ><output>Selected: {{ selected.join(',') }}</output></ConfigProvider
  >
</template>
