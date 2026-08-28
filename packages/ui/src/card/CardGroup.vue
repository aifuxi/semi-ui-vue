<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import { Space } from '../space';
import type { CardGroupProps, CardGroupSlots } from './types';

defineOptions({ name: 'CardGroup', inheritAttrs: false });
const props = withDefaults(defineProps<CardGroupProps>(), { spacing: 16 });
defineSlots<CardGroupSlots>();
const attrs = useAttrs();

const isGrid = computed(() => props.type === 'grid');
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
</script>

<template>
  <Space
    v-bind="rootAttrs"
    :class="[
      'semi-card-group',
      { 'semi-card-group-grid': isGrid },
      attrs.class,
      props.class,
      props.className,
    ]"
    :spacing="isGrid ? 0 : props.spacing"
    :style="[attrs.style, props.style]"
    wrap
  >
    <slot />
  </Space>
</template>
