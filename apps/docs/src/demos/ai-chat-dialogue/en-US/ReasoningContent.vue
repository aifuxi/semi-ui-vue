<script setup lang="ts">
import {
  AIChatDialogueReasoning,
  AIChatDialogueAnnotation,
  type Annotation,
} from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
const props = defineProps<{
  item: {
    status?: string;
    summary?: Array<{ text?: string; type?: string }>;
    annotations?: Annotation[];
  };
}>();
const emit = defineEmits<{ annotation: [] }>();
</script>
<template>
  <AIChatDialogueReasoning
    :status="props.item.status"
    :summary="props.item.summary"
    completed-text="Thinking completed"
    thinking-text="Thinking..."
    ><template #default
      ><AIChatDialogueAnnotation
        :annotation="props.item.annotations ?? []"
        description="References"
        :max-count="3"
        @click="emit('annotation')" />
      <div style="margin-top: 8px">
        <MarkdownRender format="md" :raw="props.item.summary?.[0]?.text ?? ''" /></div></template
  ></AIChatDialogueReasoning>
</template>
