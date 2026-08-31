<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';
import { computed } from 'vue';

const props = defineProps(nodeViewProps);
const options = computed<string[]>(() => {
  try {
    const parsed = JSON.parse(String(props.node.attrs.options ?? '[]'));
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
});

function update(event: Event): void {
  props.updateAttributes({ value: (event.target as HTMLSelectElement).value });
}
</script>

<template>
  <NodeViewWrapper as="span" class="select-slot-wrapper">
    <select
      class="semi-select select-slot"
      :value="String(props.node.attrs.value ?? '')"
      @change="update"
    >
      <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
    </select>
  </NodeViewWrapper>
</template>
