<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue';

import type { SpaceProps, SpaceSlots } from './types';

defineOptions({
  name: 'Space',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<SpaceProps>(), {
  align: 'center',
  spacing: 'tight',
  vertical: false,
  wrap: false,
});
defineSlots<SpaceSlots>();

const attrs = useAttrs();

const spacingClasses = computed(() => {
  const horizontalSpacing = Array.isArray(props.spacing) ? props.spacing[0] : props.spacing;
  const verticalSpacing = Array.isArray(props.spacing) ? props.spacing[1] : props.spacing;
  const classes: string[] = [];

  if (typeof horizontalSpacing === 'string') {
    classes.push(`semi-space-${horizontalSpacing}-horizontal`);
  }
  if (typeof verticalSpacing === 'string') {
    classes.push(`semi-space-${verticalSpacing}-vertical`);
  }

  return classes;
});
const spaceClasses = computed(() => [
  'semi-space',
  `semi-space-align-${props.align}`,
  props.vertical ? 'semi-space-vertical' : 'semi-space-horizontal',
  props.wrap && !props.vertical ? 'semi-space-wrap' : null,
  ...spacingClasses.value,
  attrs.class,
]);
const spacingStyle = computed<CSSProperties>(() => {
  if (typeof props.spacing === 'number') {
    const gap = `${props.spacing}px`;
    return { columnGap: gap, rowGap: gap };
  }

  if (!Array.isArray(props.spacing)) return {};

  const [horizontalSpacing, verticalSpacing] = props.spacing;
  return {
    ...(typeof horizontalSpacing === 'number' ? { columnGap: `${horizontalSpacing}px` } : {}),
    ...(typeof verticalSpacing === 'number' ? { rowGap: `${verticalSpacing}px` } : {}),
  };
});
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
const spaceStyle = computed(() => [attrs.style, spacingStyle.value]);
</script>

<template>
  <div v-bind="rootAttrs" :class="spaceClasses" :style="spaceStyle" x-semi-prop="children">
    <slot />
  </div>
</template>
