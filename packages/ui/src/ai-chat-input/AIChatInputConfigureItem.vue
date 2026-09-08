<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted } from 'vue';

import { configureContextKey } from './configure-context';
import type { AIChatInputConfigureItemProps } from './types';

// A scoped slot is the Vue counterpart of wrapping arbitrary controls with getConfigureItem.
const props = defineProps<Pick<AIChatInputConfigureItemProps, 'field' | 'initValue'>>();
const emit = defineEmits<{ change: [value: unknown] }>();
defineSlots<{
  default?: (props: { value: unknown; onChange: (value: unknown) => void }) => unknown;
}>();
const configure = inject(configureContextKey);
if (!configure) throw new Error('AIChatInput.Configure.Item must be inside AIChatInput.Configure');
const value = computed(() => configure.value.value[props.field]);
onMounted(() => {
  if (props.initValue !== undefined && value.value === undefined)
    configure.change(props.field, props.initValue);
});
onBeforeUnmount(() => configure.remove(props.field));
function change(next: unknown): void {
  configure!.change(props.field, next);
  emit('change', next);
}
</script>

<template><slot :value="value" :on-change="change" /></template>
