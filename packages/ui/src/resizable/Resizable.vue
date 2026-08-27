<script setup lang="ts">
import { computed, useAttrs, useTemplateRef } from 'vue';

import ResizableNodeRenderer from './ResizableNodeRenderer';
import SingleResizeHandle from './SingleResizeHandle.vue';
import {
  RESIZE_DIRECTIONS,
  type ResizableEmits,
  type ResizableProps,
  type ResizableSlots,
} from './types';
import { useSingleResize } from './use-single-resize';

defineOptions({ name: 'Resizable', inheritAttrs: false });

const props = withDefaults(defineProps<ResizableProps>(), {
  grid: () => [1, 1] as const,
  snapGap: 0,
  boundsByDirection: false,
  lockAspectRatio: false,
  lockAspectRatioExtraWidth: 0,
  lockAspectRatioExtraHeight: 0,
  enable: () => ({}),
  scale: 1,
  ratio: 1,
});
const emit = defineEmits<ResizableEmits>();
defineSlots<ResizableSlots>();
const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const { state, sizeStyle, constraintStyle, startResize } = useSingleResize(props, emit, root);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'),
  ),
);
const handleWrapperAttrs = computed(() => ({
  ...(props.handleWrapperClass ? { class: props.handleWrapperClass } : {}),
  ...(props.handleWrapperStyle ? { style: props.handleWrapperStyle } : {}),
}));
</script>

<template>
  <div
    v-bind="rootAttrs"
    ref="root"
    :class="[attrs.class, 'semi-resizable-resizable']"
    :style="[constraintStyle, attrs.style, sizeStyle]"
  >
    <div
      v-if="state.isResizing"
      class="semi-resizable-background"
      :style="{ cursor: state.backgroundStyle.cursor }"
    />
    <slot />
    <div v-if="props.enable !== false" v-bind="handleWrapperAttrs">
      <template v-for="direction in RESIZE_DIRECTIONS" :key="direction">
        <SingleResizeHandle
          v-if="props.enable?.[direction] !== false"
          :direction="direction"
          :class="props.handleClass?.[direction]"
          :style="props.handleStyle?.[direction]"
          @start="startResize"
        >
          <slot :name="`handle-${direction}`">
            <ResizableNodeRenderer :content="props.handleNode?.[direction]" />
          </slot>
        </SingleResizeHandle>
      </template>
    </div>
  </div>
</template>
