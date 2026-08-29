<script setup lang="ts">
import { useAttrs } from 'vue';

import SkeletonNodeRenderer from './SkeletonNodeRenderer';
import type { SkeletonProps, SkeletonSlots } from './types';

defineOptions({ name: 'Skeleton', inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonProps>(), {
  active: false,
  className: '',
  loading: true,
});
defineSlots<SkeletonSlots>();
const attrs = useAttrs();
</script>

<template>
  <div
    v-if="props.loading"
    v-bind="attrs"
    :class="['semi-skeleton', props.active && 'semi-skeleton-active', props.class, props.className]"
    :style="props.style"
    x-semi-prop="placeholder"
  >
    <slot name="placeholder">
      <SkeletonNodeRenderer :content="props.placeholder" />
    </slot>
  </div>
  <slot v-else />
</template>
