<script setup lang="ts">
import { useSlots } from 'vue';

import TypographyBase from './TypographyBase.vue';
import type { TextProps, TypographyContentSlots, TypographyEmits } from './types';

defineOptions({ name: 'TypographyText' });
const props = withDefaults(defineProps<TextProps>(), {
  component: 'span',
  code: false,
  copyable: false,
  delete: false,
  disabled: false,
  ellipsis: false,
  link: false,
  mark: false,
  size: 'normal',
  spacing: 'normal',
  strong: false,
  type: 'primary',
  underline: false,
});
const emit = defineEmits<TypographyEmits>();
defineSlots<TypographyContentSlots>();
const slots = useSlots();
</script>

<template>
  <TypographyBase
    v-bind="props"
    @copy="(...arguments_) => emit('copy', ...arguments_)"
    @expand="(...arguments_) => emit('expand', ...arguments_)"
  >
    <template #default><slot /></template>
    <template v-if="slots.icon" #icon><slot name="icon" /></template>
    <template v-if="slots.copyIcon" #copyIcon="slotProps">
      <slot name="copyIcon" v-bind="slotProps" />
    </template>
    <template v-if="slots.copied" #copied><slot name="copied" /></template>
    <template v-if="slots.tooltip" #tooltip="slotProps">
      <slot name="tooltip" v-bind="slotProps" />
    </template>
  </TypographyBase>
</template>
