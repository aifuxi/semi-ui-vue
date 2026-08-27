<script setup lang="ts">
import { FormatNumeral } from '@workspace/foundation-integration';
import { computed, useSlots, type VNodeChild } from 'vue';

import TypographyBase from './TypographyBase.vue';
import { formatTypographyNodes } from './typography-utils';
import type { NumeralProps, TypographyContentSlots, TypographyEmits } from './types';

defineOptions({ name: 'TypographyNumeral' });
const props = withDefaults(defineProps<NumeralProps>(), {
  component: 'span',
  code: false,
  copyable: false,
  delete: false,
  disabled: false,
  link: false,
  mark: false,
  precision: 0,
  rule: 'text',
  size: 'normal',
  strong: false,
  truncate: 'round',
  type: 'primary',
  underline: false,
});
const emit = defineEmits<TypographyEmits>();
defineSlots<TypographyContentSlots>();
const slots = useSlots();

const content = computed<VNodeChild[]>(() => {
  const formatter = (value: string) =>
    new FormatNumeral(value, props.rule, props.precision, props.truncate, props.parser).format();
  return formatTypographyNodes(slots.default?.() ?? [], formatter);
});
</script>

<template>
  <TypographyBase
    :component="component"
    :copyable="copyable"
    :delete="props.delete"
    :disabled="disabled"
    :icon="icon"
    :link="link"
    :mark="mark"
    :size="size"
    :strong="strong"
    :type="type"
    :underline="underline"
    :code="code"
    :content="content"
    @copy="(...arguments_) => emit('copy', ...arguments_)"
    @expand="(...arguments_) => emit('expand', ...arguments_)"
  >
    <template v-if="slots.icon" #icon><slot name="icon" /></template>
    <template v-if="slots.copyIcon" #copyIcon="slotProps">
      <slot name="copyIcon" v-bind="slotProps" />
    </template>
    <template v-if="slots.copied" #copied><slot name="copied" /></template>
  </TypographyBase>
</template>
