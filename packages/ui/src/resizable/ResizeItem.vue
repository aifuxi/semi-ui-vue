<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, useAttrs, useTemplateRef } from 'vue';

import { resizeGroupContextKey } from './resizable-context';
import type { ResizeItemEmits, ResizeItemProps, ResizeItemSlots } from './types';

defineOptions({ name: 'ResizeItem', inheritAttrs: false });

const props = defineProps<ResizeItemProps>();
const emit = defineEmits<ResizeItemEmits>();
defineSlots<ResizeItemSlots>();
const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const context = inject(resizeGroupContextKey);
if (!context) throw new Error('please make sure <ResizeItem> inside <ResizeGroup>');
const id = Symbol('resize-item');

onMounted(() => {
  if (!root.value) return;
  context.registerItem({
    id,
    element: root.value,
    ...(props.min === undefined ? {} : { min: props.min }),
    ...(props.max === undefined ? {} : { max: props.max }),
    ...(props.defaultSize === undefined ? {} : { defaultSize: props.defaultSize }),
    onResizeStart: (event, direction) => emit('resizeStart', event, direction),
    onChange: (size, event, direction) => emit('change', size, event, direction),
    onResizeEnd: (size, event, direction) => emit('resizeEnd', size, event, direction),
  });
});
onBeforeUnmount(() => context.unregisterItem(id));
</script>

<template>
  <div ref="root" :class="[attrs.class, 'semi-resizable-item']" :style="attrs.style">
    <slot />
  </div>
</template>
