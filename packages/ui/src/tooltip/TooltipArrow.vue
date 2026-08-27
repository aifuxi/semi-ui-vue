<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  backgroundColor?: string | undefined;
  placement: string;
  prefixCls: string;
}>();

const vertical = computed(
  () => props.placement.includes('left') || props.placement.includes('right'),
);
</script>

<template>
  <svg
    v-if="vertical"
    aria-hidden="true"
    :class="`${prefixCls}-icon-arrow`"
    :style="{ color: backgroundColor, fill: 'currentColor' }"
    width="7"
    height="24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <path d="M0 0L1 0C1 4, 2 5.5, 4 7.5S7,10 7,12S6 14.5, 4 16.5S1,20 1,24L0 24L0 0z" />
  </svg>
  <svg
    v-else
    aria-hidden="true"
    :class="`${prefixCls}-icon-arrow`"
    :style="{ color: backgroundColor, fill: 'currentColor' }"
    width="24"
    height="7"
    viewBox="0 0 24 7"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 0V1C20 1 18.5 2 16.5 4C14.5 6 14 7 12 7C10 7 9.5 6 7.5 4C5.5 2 4 1 0 1V0H24Z" />
  </svg>
</template>
