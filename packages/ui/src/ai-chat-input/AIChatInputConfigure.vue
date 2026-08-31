<script setup lang="ts">
import { provide, readonly, shallowRef, watch } from 'vue';

import { configureContextKey } from './configure-context';
import type {
  AIChatInputConfigureEmits,
  AIChatInputConfigureExposed,
  AIChatInputConfigureProps,
  LeftMenuChangeProps,
} from './types';

defineOptions({ name: 'AIChatInputConfigure' });
const props = defineProps<AIChatInputConfigureProps>();
const emit = defineEmits<AIChatInputConfigureEmits>();
defineSlots<{ default?: () => unknown }>();

const value = shallowRef<LeftMenuChangeProps>({ ...(props.value ?? props.defaultValue ?? {}) });

watch(
  () => props.value,
  (next) => {
    if (next) value.value = { ...next };
  },
  { deep: true },
);

function commit(next: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps): void {
  value.value = next;
  emit('update:value', next);
  emit('change', next, changedValue);
}

function change(field: string, fieldValue: unknown): void {
  const changedValue = { [field]: fieldValue };
  commit({ ...value.value, ...changedValue }, changedValue);
}

function remove(field: string): void {
  if (!(field in value.value)) return;
  const next = { ...value.value };
  delete next[field];
  commit(next);
}

provide(configureContextKey, { value: readonly(value), change, remove });

function getConfigureValue(): LeftMenuChangeProps {
  return value.value;
}

defineExpose<AIChatInputConfigureExposed>({ getConfigureValue });
</script>

<template>
  <slot />
</template>
