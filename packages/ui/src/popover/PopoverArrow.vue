<script setup lang="ts">
import { computed, type CSSProperties, type StyleValue } from 'vue';

import type { PopoverArrowStyle } from './types';

const props = defineProps<{
  arrowStyle?: PopoverArrowStyle | undefined;
  popStyle?: StyleValue | undefined;
  position?: string | undefined;
}>();

const topOrBottom = computed(
  () => props.position?.startsWith('top') || props.position?.startsWith('bottom'),
);
const popStyleObject = computed<CSSProperties | undefined>(() => {
  if (!props.popStyle || typeof props.popStyle !== 'object' || Array.isArray(props.popStyle)) {
    return undefined;
  }
  return props.popStyle as CSSProperties;
});
const borderPathStyle = computed(() => ({
  fill: props.arrowStyle?.borderColor ?? popStyleObject.value?.borderColor,
  opacity: props.arrowStyle?.borderOpacity,
}));
const backgroundPathStyle = computed(() => ({
  fill: props.arrowStyle?.backgroundColor ?? popStyleObject.value?.backgroundColor,
}));
</script>

<template>
  <svg
    v-if="topOrBottom"
    aria-hidden="true"
    class="semi-popover-icon-arrow"
    width="24"
    height="8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 0.5L0 1.5C4 1.5, 5.5 3, 7.5 5S10,8 12,8S14.5 7, 16.5 5S20,1.5 24,1.5L24 0.5L0 0.5z"
      :style="borderPathStyle"
    />
    <path
      d="M0 0L0 1C4 1, 5.5 2, 7.5 4S10,7 12,7S14.5 6, 16.5 4S20,1 24,1L24 0L0 0z"
      :style="backgroundPathStyle"
    />
  </svg>
  <svg
    v-else
    aria-hidden="true"
    class="semi-popover-icon-arrow"
    width="24"
    height="8"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 0L1.5 0C1.5 4, 3 5.5, 5 7.5S8,10 8,12S7 14.5, 5 16.5S1.5,20 1.5,24L0.5 24L0.5 0z"
      :style="borderPathStyle"
    />
    <path
      d="M0 0L1 0C1 4, 2 5.5, 4 7.5S7,10 7,12S6 14.5, 4 16.5S1,20 1,24L0 24L0 0z"
      :style="backgroundPathStyle"
    />
  </svg>
</template>
