<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { ResizeDirection, ResizeInputType, ResizeStartPointer } from './types';

defineOptions({ name: 'SingleResizeHandle', inheritAttrs: false });

const props = defineProps<{ direction: ResizeDirection }>();
const emit = defineEmits<{
  start: [event: ResizeStartPointer, direction: ResizeDirection, type: ResizeInputType];
}>();
const attrs = useAttrs();
const classes = computed(() => [
  'semi-resizable-resizableHandler',
  `semi-resizable-resizableHandler-${props.direction}`,
  attrs.class,
]);

function handleMouseDown(event: MouseEvent): void {
  emit('start', event, props.direction, 'mouse');
}

function handleTouchStart(event: TouchEvent): void {
  const touch = event.targetTouches[0];
  if (touch) emit('start', touch, props.direction, 'touch');
}
</script>

<template>
  <div
    :class="classes"
    :style="attrs.style"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
  >
    <slot />
  </div>
</template>
