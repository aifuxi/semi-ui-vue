<script setup lang="ts">
import { useConfigureItem } from './use-configure-item';
import type { AIChatInputConfigureItemProps } from './types';

// A scoped slot is the Vue counterpart of wrapping arbitrary controls with getConfigureItem.
const props = defineProps<Pick<AIChatInputConfigureItemProps, 'field' | 'initValue'>>();
const emit = defineEmits<{ change: [value: unknown] }>();
defineSlots<{
  default?: (props: { value: unknown; onChange: (value: unknown) => void }) => unknown;
}>();
const { value, change: commit } = useConfigureItem(
  () => props.field,
  () => props.initValue,
  'AIChatInput.Configure.Item must be inside AIChatInput.Configure',
);
function change(next: unknown): void {
  commit(next);
  emit('change', next);
}
</script>

<template><slot :value="value" :on-change="change" /></template>
