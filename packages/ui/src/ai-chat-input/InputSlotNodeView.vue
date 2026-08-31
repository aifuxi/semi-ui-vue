<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';

const props = defineProps(nodeViewProps);
const placeholder = computed(() => String(props.node.attrs.placeholder ?? ''));
</script>

<template>
  <NodeViewWrapper as="span" class="input-slot">
    <span
      v-if="!props.node.textContent || props.node.textContent === '\u200B'"
      data-placeholder="true"
      contenteditable="false"
      class="input-slot-placeholder"
    >
      {{ placeholder }}
    </span>
    <NodeViewContent as="span" class="content" />
  </NodeViewWrapper>
</template>
