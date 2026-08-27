<script setup lang="ts">
import { useSlots } from 'vue';

import TypographyBase from './TypographyBase.vue';
import type { ParagraphProps, TypographyActionSlots, TypographyEmits } from './types';

defineOptions({ name: 'TypographyParagraph' });
const props = withDefaults(defineProps<ParagraphProps>(), {
  component: 'p',
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
defineSlots<TypographyActionSlots>();
const slots = useSlots();
</script>

<template>
  <TypographyBase
    v-bind="props"
    paragraph
    @copy="(...arguments_) => emit('copy', ...arguments_)"
    @expand="(...arguments_) => emit('expand', ...arguments_)"
  >
    <template #default><slot /></template>
    <template v-if="slots.copyIcon" #copyIcon="slotProps">
      <slot name="copyIcon" v-bind="slotProps" />
    </template>
    <template v-if="slots.copied" #copied><slot name="copied" /></template>
    <template v-if="slots.tooltip" #tooltip="slotProps">
      <slot name="tooltip" v-bind="slotProps" />
    </template>
  </TypographyBase>
</template>
