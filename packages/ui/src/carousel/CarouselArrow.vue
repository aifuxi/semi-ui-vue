<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@aifuxi/semi-icons-vue';
import { computed, useSlots, type VNodeChild } from 'vue';

import CarouselNodeRenderer from './CarouselNodeRenderer';
import type { CarouselArrowProps, CarouselArrowType, CarouselTheme } from './types';

const props = defineProps<{
  arrowProps?: CarouselArrowProps | undefined;
  theme: CarouselTheme;
  type: CarouselArrowType;
}>();
const emit = defineEmits<{ next: []; prev: [] }>();
const slots = useSlots();

const rootClasses = computed(() => [
  'semi-carousel-arrow',
  `semi-carousel-arrow-${props.theme}`,
  { 'semi-carousel-arrow-hover': props.type === 'hover' },
]);
const resolveArrowAttrs = (
  configured: Record<string, unknown> | undefined,
  fallbackClass: string[],
  onClick: () => void,
) => {
  const attrs = { ...(configured ?? {}) };
  const configuredClass = attrs.class ?? attrs.className;
  delete attrs.class;
  delete attrs.className;
  return {
    class: configuredClass ?? fallbackClass,
    onClick,
    ...attrs,
  };
};
const leftAttrs = computed(() =>
  resolveArrowAttrs(
    props.arrowProps?.leftArrow?.props,
    ['semi-carousel-arrow-prev', `semi-carousel-arrow-${props.theme}`],
    () => emit('prev'),
  ),
);
const rightAttrs = computed(() =>
  resolveArrowAttrs(
    props.arrowProps?.rightArrow?.props,
    ['semi-carousel-arrow-next', `semi-carousel-arrow-${props.theme}`],
    () => emit('next'),
  ),
);
const leftContent = computed<VNodeChild | undefined>(
  () => slots.leftArrow?.() ?? props.arrowProps?.leftArrow?.children,
);
const rightContent = computed<VNodeChild | undefined>(
  () => slots.rightArrow?.() ?? props.arrowProps?.rightArrow?.children,
);
</script>

<template>
  <div :class="rootClasses">
    <div v-bind="leftAttrs" x-semi-prop="arrowProps.leftArrow.children">
      <CarouselNodeRenderer v-if="leftContent" :content="leftContent" />
      <IconChevronLeft v-else aria-label="Previous index" size="inherit" />
    </div>
    <div v-bind="rightAttrs" x-semi-prop="arrowProps.rightArrow.children">
      <CarouselNodeRenderer v-if="rightContent" :content="rightContent" />
      <IconChevronRight v-else aria-label="Next index" size="inherit" />
    </div>
  </div>
</template>
