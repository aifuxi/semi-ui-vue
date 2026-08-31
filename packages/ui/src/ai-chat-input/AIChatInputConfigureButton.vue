<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, useAttrs } from 'vue';

import Button from '../button/Button.vue';
import { configureContextKey, type ConfigureContextValue } from './configure-context';
import type { AIChatInputConfigureItemProps } from './types';

defineOptions({ name: 'AIChatInputConfigureButton', inheritAttrs: false });
const props = defineProps<AIChatInputConfigureItemProps>();
const emit = defineEmits<{ click: [value: boolean] }>();
const attrs = useAttrs();
const context = inject(configureContextKey) as ConfigureContextValue | undefined;
if (!context) throw new Error('AIChatInput.Configure.Button must be inside AIChatInput.Configure');
const configure = context;

const active = computed(() => Boolean(configure.value.value[props.field]));
onMounted(() => {
  if (props.initValue !== undefined && configure.value.value[props.field] === undefined) {
    configure.change(props.field, props.initValue);
  }
});
onBeforeUnmount(() => configure.remove(props.field));

function toggle(): void {
  const next = !active.value;
  configure.change(props.field, next);
  emit('click', next);
}
</script>

<template>
  <Button
    v-bind="attrs"
    theme="outline"
    type="tertiary"
    :class="[
      'semi-aiChatInput-footer-configure-button',
      { 'semi-aiChatInput-footer-configure-button-active': active },
      props.class,
      props.className,
    ]"
    @click="toggle"
  >
    <slot />
  </Button>
</template>
