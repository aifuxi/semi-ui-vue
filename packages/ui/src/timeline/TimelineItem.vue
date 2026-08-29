<script setup lang="ts">
import { computed, useAttrs, useSlots, type PropType, type VNodeChild } from 'vue';

import TimelineNodeRenderer from './TimelineNodeRenderer';
import type {
  TimelineItemEmits,
  TimelineItemProps,
  TimelineItemSlots,
  TimelineItemType,
} from './types';

defineOptions({ name: 'TimelineItem', inheritAttrs: false });
const props = defineProps({
  class: { type: null as unknown as PropType<TimelineItemProps['class']>, default: undefined },
  className: {
    type: null as unknown as PropType<TimelineItemProps['className']>,
    default: undefined,
  },
  color: { type: String, default: undefined },
  dot: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  extra: { type: null as unknown as PropType<VNodeChild>, default: undefined },
  position: {
    type: String as PropType<TimelineItemProps['position']>,
    default: undefined,
  },
  style: { type: null as unknown as PropType<TimelineItemProps['style']>, default: undefined },
  time: { type: null as unknown as PropType<VNodeChild>, default: '' },
  type: { type: String as PropType<TimelineItemType>, default: 'default' },
});
const emit = defineEmits<TimelineItemEmits>();
defineSlots<TimelineItemSlots>();
const attrs = useAttrs();
const slots = useSlots();

const prefixCls = 'semi-timeline-item';
const rootClasses = computed(() => [prefixCls, props.class, props.className, attrs.class]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const dotContent = computed<VNodeChild>(() => slots.dot?.() ?? props.dot);
const extraContent = computed<VNodeChild>(() => slots.extra?.() ?? props.extra);
const timeContent = computed<VNodeChild>(() => slots.time?.() ?? props.time);
const hasDot = computed(() => Boolean(slots.dot?.().length || props.dot));
const hasExtra = computed(() => Boolean(slots.extra?.().length || props.extra));
const hasTime = computed(() => Boolean(slots.time?.().length || props.time));
const dotClasses = computed(() => [
  `${prefixCls}-head`,
  hasDot.value ? `${prefixCls}-head-custom` : undefined,
  `${prefixCls}-head-${props.type}`,
]);
</script>

<template>
  <li
    v-bind="dataAttrs"
    :class="rootClasses"
    :style="[props.style, attrs.style]"
    @click="emit('click', $event)"
  >
    <div :class="`${prefixCls}-tail`" aria-hidden="true" />
    <div
      :class="dotClasses"
      :style="color ? { backgroundColor: color } : undefined"
      aria-hidden="true"
    >
      <TimelineNodeRenderer v-if="hasDot" :content="dotContent" />
    </div>
    <div :class="`${prefixCls}-content`">
      <slot />
      <div v-if="hasExtra" :class="`${prefixCls}-content-extra`">
        <TimelineNodeRenderer :content="extraContent" />
      </div>
      <div v-if="hasTime" :class="`${prefixCls}-content-time`">
        <TimelineNodeRenderer :content="timeContent" />
      </div>
    </div>
  </li>
</template>
