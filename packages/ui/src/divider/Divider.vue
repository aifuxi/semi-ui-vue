<script setup lang="ts">
import { Comment, Text, computed, useAttrs, useSlots, type CSSProperties, type VNode } from 'vue';

import DividerContentRenderer from './DividerContentRenderer';
import type { DividerProps, DividerSlots } from './types';

defineOptions({
  name: 'Divider',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<DividerProps>(), {
  align: 'center',
  dashed: false,
  layout: 'horizontal',
});
defineSlots<DividerSlots>();

const attrs = useAttrs();
const slots = useSlots();

const contentNodes = computed(() => (slots.default?.() ?? []) as VNode[]);
const hasRenderableContent = computed(() =>
  contentNodes.value.some(
    (node) => node.type !== Comment && !(node.type === Text && node.children === ''),
  ),
);
const hasHorizontalContent = computed(
  () => props.layout === 'horizontal' && hasRenderableContent.value,
);
const dividerClasses = computed(() => [
  'semi-divider',
  `semi-divider-${props.layout}`,
  props.dashed ? 'semi-divider-dashed' : null,
  hasHorizontalContent.value ? 'semi-divider-with-text' : null,
  hasHorizontalContent.value ? `semi-divider-with-text-${props.align}` : null,
  attrs.class,
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
const marginStyle = computed<CSSProperties>(() => {
  if (props.margin === undefined) return {};
  const margin = typeof props.margin === 'number' ? `${props.margin}px` : props.margin;

  return props.layout === 'vertical'
    ? { marginLeft: margin, marginRight: margin }
    : { marginTop: margin, marginBottom: margin };
});
const dividerStyle = computed(() => [marginStyle.value, attrs.style]);
</script>

<template>
  <div v-bind="rootAttrs" :class="dividerClasses" :style="dividerStyle">
    <DividerContentRenderer v-if="hasHorizontalContent" :nodes="contentNodes" />
  </div>
</template>
