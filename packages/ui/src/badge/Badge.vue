<script setup lang="ts">
import { computed, inject, Comment, Text, useAttrs, useSlots, type VNode } from 'vue';

import { configContextKey } from '../config-provider/config-context';

import BadgeNodeRenderer from './BadgeNodeRenderer';
import type { BadgeEmits, BadgeProps, BadgeSlots } from './types';

defineOptions({ name: 'Badge', inheritAttrs: false });
const props = withDefaults(defineProps<BadgeProps>(), {
  dot: false,
  theme: 'solid',
  type: 'primary',
});
const emit = defineEmits<BadgeEmits>();
defineSlots<BadgeSlots>();
const attrs = useAttrs();
const slots = useSlots();
const config = inject(configContextKey, undefined);

const childNodes = computed(() => slots.default?.() ?? []);
const hasChildren = computed(() =>
  childNodes.value.some((node) => {
    if (typeof node !== 'object' || node === null) return Boolean(node);
    const vnode = node as VNode;
    if (vnode.type === Comment) return false;
    if (vnode.type === Text) return Boolean(vnode.children);
    return true;
  }),
);
const slottedCount = computed(() => slots.count?.());
const rawCount = computed(() => (slots.count ? slottedCount.value : props.count));
const isPrimitiveCount = computed(
  () => typeof rawCount.value === 'number' || typeof rawCount.value === 'string',
);
const isCustomCount = computed(() => Boolean(rawCount.value) && !isPrimitiveCount.value);
const showBadge = computed(() => rawCount.value !== null && rawCount.value !== undefined);
const position = computed(
  () => props.position ?? (config?.value.direction === 'rtl' ? 'leftTop' : 'rightTop'),
);
const countClasses = computed(() => [
  props.countClassName,
  !isCustomCount.value ? `semi-badge-${props.type}` : undefined,
  !isCustomCount.value ? `semi-badge-${props.theme}` : undefined,
  hasChildren.value ? `semi-badge-${position.value}` : undefined,
  !hasChildren.value ? 'semi-badge-block' : undefined,
  props.dot ? 'semi-badge-dot' : undefined,
  !props.dot && !isCustomCount.value && showBadge.value ? 'semi-badge-count' : undefined,
  isCustomCount.value ? 'semi-badge-custom' : undefined,
]);
const displayedCount = computed(() => {
  if (typeof rawCount.value !== 'number') return rawCount.value;
  return props.overflowCount && props.overflowCount < rawCount.value
    ? `${props.overflowCount}+`
    : `${rawCount.value}`;
});
</script>

<template>
  <span
    v-bind="attrs"
    class="semi-badge"
    :class="[props.class, props.className]"
    @click="emit('click', $event)"
    @mouseenter="emit('mouseenter', $event)"
    @mouseleave="emit('mouseleave', $event)"
  >
    <BadgeNodeRenderer :content="childNodes" />
    <span :class="countClasses" :style="props.style || props.countStyle" x-semi-prop="count">
      <BadgeNodeRenderer v-if="!props.dot" :content="displayedCount" />
    </span>
  </span>
</template>
