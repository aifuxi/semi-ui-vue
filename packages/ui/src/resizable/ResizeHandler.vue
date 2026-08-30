<script setup lang="ts">
import { IconHandle } from '@aifuxi/semi-icons-vue';
import { computed, inject, onBeforeUnmount, onMounted, useAttrs, useTemplateRef } from 'vue';

import { resizeGroupContextKey } from './resizable-context';
import type { ResizeHandlerSlots } from './types';

defineOptions({ name: 'ResizeHandler', inheritAttrs: false });
defineSlots<ResizeHandlerSlots>();
const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const injectedContext = inject(resizeGroupContextKey);
if (!injectedContext) throw new Error('please make sure <ResizeHandler> inside <ResizeGroup>');
const context = injectedContext;
const id = Symbol('resize-handler');
const classes = computed(() => [
  attrs.class,
  'semi-resizable-handler',
  `semi-resizable-handler-${context.direction.value}`,
]);

function handleMouseDown(event: MouseEvent): void {
  context.startResize(id, event, 'mouse');
}

function handleTouchStart(event: TouchEvent): void {
  const touch = event.targetTouches[0];
  if (touch) context.startResize(id, touch, 'touch');
}

onMounted(() => {
  if (root.value) context.registerHandler({ id, element: root.value });
});
onBeforeUnmount(() => context.unregisterHandler(id));
</script>

<template>
  <div
    ref="root"
    :class="classes"
    :style="attrs.style"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
  >
    <slot>
      <IconHandle
        size="inherit"
        :style="{ rotate: context.direction.value === 'horizontal' ? '0deg' : '90deg' }"
      />
    </slot>
  </div>
</template>
