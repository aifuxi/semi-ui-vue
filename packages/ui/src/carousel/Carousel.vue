<script setup lang="ts">
import {
  Comment,
  computed,
  Fragment,
  onBeforeUnmount,
  Text,
  useAttrs,
  useSlots,
  type CSSProperties,
  type VNode,
} from 'vue';

import CarouselArrow from './CarouselArrow.vue';
import CarouselIndicator from './CarouselIndicator.vue';
import CarouselItemRenderer from './CarouselItemRenderer';
import type { CarouselEmits, CarouselMethods, CarouselProps, CarouselSlots } from './types';
import { useCarouselFoundation } from './use-carousel-foundation';

defineOptions({ name: 'Carousel', inheritAttrs: false });
const props = withDefaults(defineProps<CarouselProps>(), {
  animation: 'slide',
  arrowType: 'always',
  autoPlay: true,
  defaultActiveIndex: 0,
  indicatorPosition: 'center',
  indicatorSize: 'small',
  indicatorType: 'dot',
  showArrow: true,
  showIndicator: true,
  slideDirection: 'left',
  speed: 300,
  theme: 'light',
  trigger: 'click',
});
const emit = defineEmits<CarouselEmits>();
defineSlots<CarouselSlots>();
const attrs = useAttrs();
const slots = useSlots();

function flattenElements(nodes: VNode[] | undefined, result: VNode[] = []): VNode[] {
  for (const node of nodes ?? []) {
    if (node.type === Comment || node.type === Text) continue;
    if (node.type === Fragment && Array.isArray(node.children)) {
      flattenElements(node.children as VNode[], result);
      continue;
    }
    result.push(node);
  }
  return result;
}

const children = computed(() => flattenElements(slots.default?.()));
const { foundation, state } = useCarouselFoundation(props, children, emit);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([attributeName]) => !['class', 'style'].includes(attributeName)),
  ),
);
const contentClasses = computed(() => [
  'semi-carousel-content',
  `semi-carousel-content-${props.animation}`,
  {
    'semi-carousel-content-reverse':
      props.slideDirection === 'left' ? state.isReverse : !state.isReverse,
  },
]);
const animationStyle = computed<CSSProperties>(() => ({
  transitionTimingFunction: 'ease',
  transitionDuration: `${props.speed}ms`,
  animationTimingFunction: 'ease',
  animationDuration: `${props.speed}ms`,
}));
const showIndicator = computed(() => props.showIndicator && children.value.length > 1);
const showArrow = computed(() => props.showArrow && children.value.length > 1);

let enterTimer: ReturnType<typeof setTimeout> | undefined;
let leaveTimer: ReturnType<typeof setTimeout> | undefined;

function clearHoverTimers(): void {
  if (enterTimer !== undefined) clearTimeout(enterTimer);
  if (leaveTimer !== undefined) clearTimeout(leaveTimer);
  enterTimer = undefined;
  leaveTimer = undefined;
}

function handleMouseenter(): void {
  if (enterTimer !== undefined) clearTimeout(enterTimer);
  enterTimer = setTimeout(() => {
    if (
      props.autoPlay === true ||
      (typeof props.autoPlay === 'object' && props.autoPlay.hoverToPause)
    ) {
      foundation.stop();
    }
  }, 400);
}

function handleMouseleave(): void {
  if (leaveTimer !== undefined) clearTimeout(leaveTimer);
  leaveTimer = setTimeout(() => {
    if (
      (typeof props.autoPlay !== 'object' || props.autoPlay.hoverToPause) &&
      !foundation.getIsControlledComponent()
    ) {
      foundation.handleAutoPlay();
    }
  }, 400);
}

function itemClasses(index: number) {
  const isCurrent = index === state.activeIndex;
  const previousIndex = children.value.length
    ? foundation.getValidIndex(state.activeIndex - 1)
    : -1;
  const nextIndex = children.value.length ? foundation.getValidIndex(state.activeIndex + 1) : -1;
  return {
    'semi-carousel-content-item': true,
    'semi-carousel-content-item-active': isCurrent,
    'semi-carousel-content-item-current': isCurrent,
    'semi-carousel-content-item-next': index === nextIndex,
    'semi-carousel-content-item-prev': index === previousIndex,
    'semi-carousel-content-item-slide-in':
      props.animation === 'slide' && !state.isInit && isCurrent,
    'semi-carousel-content-item-slide-out':
      props.animation === 'slide' && !state.isInit && index === state.preIndex,
  };
}

function play(): void {
  foundation.setForcePlay(true);
  foundation.handleAutoPlay();
}
function stop(): void {
  foundation.setForcePlay(false);
  foundation.stop();
}
function goTo(targetIndex: number): void {
  foundation.goTo(targetIndex);
}
function prev(): void {
  foundation.prev();
}
function next(): void {
  foundation.next();
}
function handleIndicatorChange(index: number): void {
  foundation.onIndicatorChange(index);
}

defineExpose<CarouselMethods>({ goTo, next, play, prev, stop });
onBeforeUnmount(clearHoverTimers);
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="semi-carousel"
    :class="[attrs.class, props.class, props.className]"
    :style="[attrs.style, props.style]"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div :class="contentClasses" x-semi-prop="children">
      <CarouselItemRenderer
        v-for="(child, index) in children"
        :key="child.key ?? index"
        :item-class="itemClasses(index)"
        :item-style="animationStyle"
        :node="child"
      />
    </div>
    <div v-if="showIndicator" class="semi-carousel-indicator">
      <CarouselIndicator
        :active-index="state.activeIndex"
        :position="props.indicatorPosition"
        :size="props.indicatorSize"
        :theme="props.theme"
        :total="children.length"
        :trigger="props.trigger"
        :type="props.indicatorType"
        @change="handleIndicatorChange"
      />
    </div>
    <CarouselArrow
      v-if="showArrow"
      :arrow-props="props.arrowProps"
      :theme="props.theme"
      :type="props.arrowType"
      @next="next"
      @prev="prev"
    >
      <template v-if="slots.leftArrow" #leftArrow><slot name="leftArrow" /></template>
      <template v-if="slots.rightArrow" #rightArrow><slot name="rightArrow" /></template>
    </CarouselArrow>
  </div>
</template>
