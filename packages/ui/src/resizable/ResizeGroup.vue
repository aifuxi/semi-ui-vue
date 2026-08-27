<script setup lang="ts">
import { computed, provide, useAttrs, useTemplateRef } from 'vue';

import { resizeGroupContextKey } from './resizable-context';
import type { ResizeGroupProps, ResizeGroupSlots } from './types';
import { useResizeGroup } from './use-resize-group';

defineOptions({ name: 'ResizeGroup', inheritAttrs: false });

const props = withDefaults(defineProps<ResizeGroupProps>(), { direction: 'horizontal' });
defineSlots<ResizeGroupSlots>();
const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const direction = computed(() => props.direction);
const { state, context } = useResizeGroup(direction, root);
provide(resizeGroupContextKey, context);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    :class="[attrs.class, 'semi-resizable-group']"
    :style="[{ flexDirection: props.direction === 'vertical' ? 'column' : 'row' }, attrs.style]"
  >
    <div
      v-if="state.isResizing"
      class="semi-resizable-background"
      :style="{ cursor: state.backgroundStyle.cursor }"
    />
    <slot />
  </div>
</template>
