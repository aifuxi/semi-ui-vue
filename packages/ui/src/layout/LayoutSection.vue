<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { LayoutSectionProps, LayoutSlots } from './types';

defineOptions({
  name: 'LayoutSection',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    LayoutSectionProps & {
      type: 'header' | 'footer' | 'content';
      defaultTagName: 'header' | 'footer' | 'main';
    }
  >(),
  {
    prefixCls: 'semi-layout',
  },
);
defineSlots<LayoutSlots>();

const attrs = useAttrs();
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([attributeName]) => attributeName !== 'class')),
);
const tagName = computed(() => props.tagName ?? props.defaultTagName);
const sectionClasses = computed(() => [`${props.prefixCls}-${props.type}`, attrs.class]);
</script>

<template>
  <component :is="tagName" v-bind="rootAttrs" :class="sectionClasses">
    <slot />
  </component>
</template>
