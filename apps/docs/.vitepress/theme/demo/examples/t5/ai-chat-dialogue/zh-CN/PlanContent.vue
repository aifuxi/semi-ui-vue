<script setup lang="ts">
import { computed, h } from 'vue';
import { AIChatDialogueStep } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { IconSearchStroked, IconCodeStroked, IconBriefStroked } from '@aifuxi/semi-icons-vue';
const props = defineProps<{
  item: {
    content: Array<{
      summary: string;
      steps: Array<{ summary: string; description: string; type: string }>;
    }>;
  };
}>();
const steps = computed(() =>
  props.item.content.map((item) => ({
    summary: item.summary,
    status: 'completed',
    actions: item.steps.map((action) => ({
      ...action,
      icon: h(
        action.type === 'search'
          ? IconSearchStroked
          : action.type === 'docs'
            ? IconBriefStroked
            : IconCodeStroked,
      ),
    })),
  })),
);
</script>
<template><AIChatDialogueStep :steps="steps" /></template>
