<script setup lang="ts">
import { computed, type HTMLAttributes, type StyleValue, type VNodeChild } from 'vue';

import ProgressNodeRenderer from './ProgressNodeRenderer';
import type { ProgressSize, ProgressStrokeLinecap } from './types';

defineOptions({ name: 'ProgressCircle', inheritAttrs: false });
const props = defineProps<{
  ariaLabel?: string | undefined;
  ariaLabelledby?: string | undefined;
  ariaValuetext?: string | undefined;
  content: VNodeChild;
  dataAttrs: Record<string, unknown>;
  id?: string | undefined;
  nativeClass?: HTMLAttributes['class'] | undefined;
  nativeStyle?: StyleValue | undefined;
  orbitStroke?: string | undefined;
  percent: number;
  percentNumber: number;
  rootClass?: HTMLAttributes['class'] | undefined;
  rootStyle?: StyleValue | undefined;
  showInfo: boolean;
  size: ProgressSize;
  stroke?: string | undefined;
  strokeLinecap: ProgressStrokeLinecap;
  strokeWidth: number;
  width?: number | undefined;
}>();

const resolvedWidth = computed(() =>
  props.width ? props.width : props.size === 'default' ? 72 : 24,
);
const radius = computed(() => (resolvedWidth.value - props.strokeWidth) / 2);
const circumference = computed(() => radius.value * 2 * Math.PI);
const strokeDasharray = computed(() => `${circumference.value} ${circumference.value}`);
const strokeDashoffset = computed(() => (1 - props.percent / 100) * circumference.value);
const rootClasses = computed(() => ['semi-progress-circle', props.rootClass, props.nativeClass]);
const rootStyles = computed(() => [props.rootStyle, props.nativeStyle]);
</script>

<template>
  <div
    v-bind="props.dataAttrs"
    :id="props.id"
    :aria-label="props.ariaLabel"
    :aria-labelledby="props.ariaLabelledby"
    :aria-valuemax="100"
    :aria-valuemin="0"
    :aria-valuenow="props.percentNumber"
    :aria-valuetext="props.ariaValuetext"
    :class="rootClasses"
    role="progressbar"
    :style="rootStyles"
  >
    <svg
      aria-hidden="true"
      class="semi-progress-circle-ring"
      :height="resolvedWidth"
      :width="resolvedWidth"
    >
      <circle
        aria-hidden="true"
        class="semi-progress-circle-ring-track"
        :cx="resolvedWidth / 2"
        :cy="resolvedWidth / 2"
        fill="transparent"
        :r="radius"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="0"
        :stroke-linecap="props.strokeLinecap"
        :stroke-width="props.strokeWidth"
        :style="props.orbitStroke ? { stroke: props.orbitStroke } : undefined"
      />
      <circle
        aria-hidden="true"
        class="semi-progress-circle-ring-inner"
        :cx="resolvedWidth / 2"
        :cy="resolvedWidth / 2"
        fill="transparent"
        :r="radius"
        :stroke-dasharray="strokeDasharray"
        :stroke-dashoffset="strokeDashoffset"
        :stroke-linecap="props.strokeLinecap"
        :stroke-width="props.strokeWidth"
        :style="props.stroke ? { stroke: props.stroke } : undefined"
      />
    </svg>
    <span v-if="props.showInfo && props.size !== 'small'" class="semi-progress-circle-text">
      <ProgressNodeRenderer :content="props.content" />
    </span>
  </div>
</template>
