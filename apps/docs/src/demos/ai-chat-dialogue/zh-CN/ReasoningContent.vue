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
