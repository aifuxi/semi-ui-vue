<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useAttrs } from 'vue';

import RadioGroup from '../radio/RadioGroup';
import { configureContextKey, type ConfigureContextValue } from './configure-context';
import type { AIChatInputConfigureItemProps } from './types';

defineOptions({ name: 'AIChatInputConfigureRadioButton', inheritAttrs: false });
const props = defineProps<AIChatInputConfigureItemProps>();
const emit = defineEmits<{ change: [value: unknown] }>();
const attrs = useAttrs();
const context = inject(configureContextKey) as ConfigureContextValue | undefined;
if (!context)
  throw new Error('AIChatInput.Configure.RadioButton must be inside AIChatInput.Configure');
const configure = context;

const value = computed(() => configure.value.value[props.field]);
onMounted(() => {
  if (props.initValue !== undefined && value.value === undefined)
    configure.change(props.field, props.initValue);
});
onBeforeUnmount(() => configure.remove(props.field));

function handleChange(event: { target?: { value?: unknown } } | unknown): void {
  const next =
    typeof event === 'object' && event !== null && 'target' in event
      ? (event as { target?: { value?: unknown } }).target?.value
      : event;
  configure.change(props.field, next);
  emit('change', next);
}
</script>

<template>
  <RadioGroup
    v-bind="attrs as any"
    type="button"
    :value="value as any"
    :class="['semi-aiChatInput-footer-configure-radio-button', props.class, props.className]"
    @change="handleChange"
  />
</template>
