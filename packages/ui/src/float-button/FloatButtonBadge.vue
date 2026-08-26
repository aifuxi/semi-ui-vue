<script setup lang="ts">
import { computed } from 'vue';

import FloatButtonNodeRenderer from './FloatButtonNodeRenderer';
import type { FloatButtonBadgeProps } from './types';

defineOptions({
  name: 'FloatButtonBadge',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<FloatButtonBadgeProps>(), {
  dot: false,
  type: 'primary',
  theme: 'solid',
});

const isPrimitiveCount = computed(
  () => typeof props.count === 'number' || typeof props.count === 'string',
);
const isCustomCount = computed(() => Boolean(props.count) && !isPrimitiveCount.value);
const showBadge = computed(() => props.count !== null && props.count !== undefined);
const position = computed(() => props.position ?? 'rightTop');
const countClasses = computed(() => [
  props.countClassName,
  !isCustomCount.value ? `semi-badge-${props.type}` : null,
  !isCustomCount.value ? `semi-badge-${props.theme}` : null,
  `semi-badge-${position.value}`,
  props.dot ? 'semi-badge-dot' : null,
  !props.dot && !isCustomCount.value && showBadge.value ? 'semi-badge-count' : null,
  isCustomCount.value ? 'semi-badge-custom' : null,
]);
const displayedCount = computed(() => {
  if (typeof props.count !== 'number') return props.count;
  return props.overflowCount && props.overflowCount < props.count
    ? `${props.overflowCount}+`
    : `${props.count}`;
});
</script>

<template>
  <span
    class="semi-badge"
    :class="props.className"
    @click="props.onClick?.($event)"
    @mouseenter="props.onMouseEnter?.($event)"
    @mouseleave="props.onMouseLeave?.($event)"
  >
    <slot />
    <span :class="countClasses" :style="props.style || props.countStyle" x-semi-prop="count">
      <FloatButtonNodeRenderer v-if="!props.dot" :content="displayedCount" />
    </span>
  </span>
</template>
