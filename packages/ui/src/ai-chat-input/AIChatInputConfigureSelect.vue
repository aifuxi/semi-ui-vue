<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useAttrs } from 'vue';

import Select from '../select/Select.vue';
import { configureContextKey, type ConfigureContextValue } from './configure-context';
import type { AIChatInputConfigureItemProps } from './types';

defineOptions({ name: 'AIChatInputConfigureSelect', inheritAttrs: false });
const props = defineProps<AIChatInputConfigureItemProps>();
const emit = defineEmits<{ change: [value: unknown] }>();
const attrs = useAttrs();
const context = inject(configureContextKey) as ConfigureContextValue | undefined;
if (!context) throw new Error('AIChatInput.Configure.Select must be inside AIChatInput.Configure');
const configure = context;

const value = computed(() => configure.value.value[props.field]);
onMounted(() => {
  if (props.initValue !== undefined && value.value === undefined)
    configure.change(props.field, props.initValue);
});
onBeforeUnmount(() => configure.remove(props.field));

function handleChange(next: unknown): void {
  configure.change(props.field, next);
  emit('change', next);
}
</script>

<template>
  <Select
    v-bind="attrs"
    :model-value="value as any"
    :class="['semi-aiChatInput-footer-configure-select', props.class, props.className]"
    @change="handleChange"
  />
</template>
