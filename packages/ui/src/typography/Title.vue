<script setup lang="ts">
import { computed, useSlots } from 'vue';

import TypographyBase from './TypographyBase.vue';
import type { TitleProps, TypographyActionSlots, TypographyEmits } from './types';

defineOptions({ name: 'TypographyTitle' });
const props = withDefaults(defineProps<TitleProps>(), {
  copyable: false,
  delete: false,
  disabled: false,
  ellipsis: false,
  heading: 1,
  link: false,
  mark: false,
  strong: false,
  type: 'primary',
  underline: false,
});
const emit = defineEmits<TypographyEmits>();
defineSlots<TypographyActionSlots>();
const slots = useSlots();
const headingTag = computed(() => `h${props.heading}` as const);
const component = computed(() => props.component ?? headingTag.value);
</script>

<template>
  <TypographyBase
    v-bind="props"
    :component="component"
    :heading-tag="headingTag"
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
