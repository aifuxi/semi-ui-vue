<script setup lang="ts">
import { computed, type HTMLAttributes, type StyleValue, type VNodeChild } from 'vue';

import ProgressNodeRenderer from './ProgressNodeRenderer';
import type { ProgressDirection, ProgressSize } from './types';

defineOptions({ name: 'ProgressLine', inheritAttrs: false });
const props = defineProps<{
  ariaLabel?: string | undefined;
  ariaLabelledby?: string | undefined;
  ariaValuetext?: string | undefined;
  content: VNodeChild;
  dataAttrs: Record<string, unknown>;
  direction: ProgressDirection;
  id?: string | undefined;
  nativeClass?: HTMLAttributes['class'] | undefined;
  nativeStyle?: StyleValue | undefined;
  orbitStroke?: string | undefined;
  percent: number;
  rootClass?: HTMLAttributes['class'] | undefined;
  rootStyle?: StyleValue | undefined;
  size: ProgressSize;
  stroke?: string | undefined;
  showInfo: boolean;
}>();

const rootClasses = computed(() => [
  'semi-progress',
  props.direction === 'horizontal' ? 'semi-progress-horizontal' : 'semi-progress-vertical',
  props.size === 'large' ? 'semi-progress-large' : undefined,
  props.rootClass,
  props.nativeClass,
]);
const rootStyles = computed(() => [props.rootStyle, props.nativeStyle]);
const innerStyle = computed(() => ({
  background: props.stroke,
  [props.direction === 'horizontal' ? 'width' : 'height']: `${props.percent}%`,
}));
</script>

<template>
  <div
    v-bind="props.dataAttrs"
    :id="props.id"
    :aria-label="props.ariaLabel"
    :aria-labelledby="props.ariaLabelledby"
    :aria-valuemax="100"
    :aria-valuemin="0"
    :aria-valuenow="props.percent"
    :aria-valuetext="props.ariaValuetext"
    :class="rootClasses"
    role="progressbar"
    :style="rootStyles"
  >
    <div
      aria-hidden="true"
      class="semi-progress-track"
      :style="props.orbitStroke ? { backgroundColor: props.orbitStroke } : undefined"
    >
      <div aria-hidden="true" class="semi-progress-track-inner" :style="innerStyle" />
    </div>
    <div v-if="props.showInfo" class="semi-progress-line-text">
      <ProgressNodeRenderer :content="props.content" />
    </div>
  </div>
</template>
