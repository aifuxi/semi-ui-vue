<script setup lang="ts">
import {
  AIChatDialogueReasoning,
  AIChatDialogueAnnotation,
  type Annotation,
  type AIChatDialogueReasoningItem,
} from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import { computed } from 'vue';
const props = defineProps<{
  item: {
    status?: string;
    summary?: AIChatDialogueReasoningItem[];
    annotations?: Annotation[];
  };
}>();
const emit = defineEmits<{ annotation: [] }>();
const reasoningProps = computed(() => ({
  ...(props.item.status === undefined ? {} : { status: props.item.status }),
  ...(props.item.summary === undefined ? {} : { summary: props.item.summary }),
}));
</script>
<template>
  <AIChatDialogueReasoning
    v-bind="reasoningProps"
    completed-text="已思考完成"
    thinking-text="正在思考中..."
    ><template #default
      ><AIChatDialogueAnnotation
        :annotation="props.item.annotations ?? []"
        description="参考资料"
        :max-count="3"
        @click="emit('annotation')" />
      <div style="margin-top: 8px">
        <MarkdownRender format="md" :raw="props.item.summary?.[0]?.text ?? ''" /></div></template
  ></AIChatDialogueReasoning>
</template>
