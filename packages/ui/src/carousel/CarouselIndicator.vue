<script setup lang="ts">
import { computed } from 'vue';

import type {
  CarouselIndicatorPosition,
  CarouselIndicatorSize,
  CarouselIndicatorType,
  CarouselTheme,
  CarouselTrigger,
} from './types';

const props = defineProps<{
  activeIndex: number;
  position: CarouselIndicatorPosition;
  size: CarouselIndicatorSize;
  theme: CarouselTheme;
  total: number;
  trigger: CarouselTrigger;
  type: CarouselIndicatorType;
}>();
const emit = defineEmits<{ change: [activeIndex: number] }>();

const rootClasses = computed(() => [
  'semi-carousel-indicator',
  `semi-carousel-indicator-${props.type}`,
  `semi-carousel-indicator-${props.position}`,
]);

function handleClick(index: number): void {
  if (props.trigger === 'click') emit('change', index);
}

function handleMouseenter(index: number): void {
  if (props.trigger === 'hover') emit('change', index);
}
</script>

<template>
  <div :class="rootClasses">
    <span
      v-for="index in props.total"
      :key="index - 1"
      :class="[
        'semi-carousel-indicator-item',
        `semi-carousel-indicator-item-${props.theme}`,
        `semi-carousel-indicator-item-${props.size}`,
        { 'semi-carousel-indicator-item-active': index - 1 === props.activeIndex },
      ]"
      :data-index="index - 1"
      @click="handleClick(index - 1)"
      @mouseenter="handleMouseenter(index - 1)"
    />
  </div>
</template>
