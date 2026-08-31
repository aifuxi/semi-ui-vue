<script setup lang="ts">
import { IconClose } from '@aifuxi/semi-icons-vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';

const props = defineProps(nodeViewProps);
const label = computed(() => String(props.node.attrs.label ?? props.node.attrs.value ?? ''));

function remove(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();
  props.deleteNode();
}
</script>

<template>
  <NodeViewWrapper v-if="label" as="span" class="skill-slot-wrapper">
    <span class="skill-slot">
      {{ label }}
      <IconClose
        class="skill-slot-delete"
        role="button"
        aria-label="Remove skill"
        @click="remove"
      />
    </span>
  </NodeViewWrapper>
</template>
