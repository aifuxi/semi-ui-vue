<script setup lang="ts">
import { generateProgressColor, ProgressAnimation } from '@workspace/foundation-integration';
import {
  computed,
  onBeforeUnmount,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue';

import ProgressCircle from './ProgressCircle.vue';
import ProgressLine from './ProgressLine.vue';
import type { ProgressProps, ProgressSlots } from './types';

defineOptions({ name: 'Progress', inheritAttrs: false });
const props = withDefaults(defineProps<ProgressProps>(), {
  className: '',
  direction: 'horizontal',
  format: (percent: number) => `${percent}%`,
  motion: true,
  percent: 0,
  showInfo: false,
  size: 'default',
  strokeGradient: false,
  strokeLinecap: 'round',
  strokeWidth: 4,
  type: 'line',
});
defineSlots<ProgressSlots>();
const attrs = useAttrs();
const slots = useSlots();
const percentNumber = shallowRef(props.percent);
let animation: ProgressAnimation | undefined;
let mounted = true;

function clampPercent(percent: number): number {
  if (percent > 100) return 100;
  if (percent < 0) return 0;
  return percent;
}

function stopAnimation(): void {
  animation?.destroy();
  animation = undefined;
}

watch(
  () => props.percent,
  (percent, previousPercent) => {
    if (Number.isNaN(percent) || Number.isNaN(previousPercent)) {
      throw new Error('[Semi Progress]:percent can not be NaN');
    }
    stopAnimation();
    if (!props.motion) {
      percentNumber.value = percent;
      return;
    }
    animation = new ProgressAnimation(
      { from: { value: previousPercent }, to: { value: percent } },
      { duration: 300, easing: 'linear' },
    );
    animation.on('frame', ({ value }) => {
      if (!mounted) return;
      percentNumber.value = Number.parseInt(String(value), 10);
    });
    animation.on('rest', () => {
      if (!mounted) return;
      percentNumber.value = props.percent;
    });
    animation.start();
  },
);

onBeforeUnmount(() => {
  mounted = false;
  stopAnimation();
});

const clampedPercent = computed(() => clampPercent(props.percent));
const clampedPercentNumber = computed(() => clampPercent(percentNumber.value));
const ariaLabel = computed(() => props.ariaLabel ?? (attrs['aria-label'] as string | undefined));
const ariaLabelledby = computed(
  () => props.ariaLabelledby ?? (attrs['aria-labelledby'] as string | undefined),
);
const ariaValuetext = computed(
  () => props.ariaValuetext ?? (attrs['aria-valuetext'] as string | undefined),
);
const selectedStroke = computed(() => {
  if (typeof props.stroke === 'string') return props.stroke;
  if (!props.stroke) return undefined;
  return generateProgressColor(props.stroke, props.percent, props.strokeGradient);
});
const formattedContent = computed<VNodeChild>(() => {
  const percent = clampedPercentNumber.value;
  return slots.format?.({ percent }) ?? props.format(percent);
});
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
</script>

<template>
  <ProgressLine
    v-if="props.type === 'line'"
    :id="props.id"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-valuetext="ariaValuetext"
    :content="formattedContent"
    :data-attrs="dataAttrs"
    :direction="props.direction"
    :native-class="attrs.class"
    :native-style="attrs.style"
    :orbit-stroke="props.orbitStroke"
    :percent="clampedPercent"
    :root-class="[props.class, props.className]"
    :root-style="props.style"
    :show-info="props.showInfo"
    :size="props.size"
    :stroke="selectedStroke"
  />
  <ProgressCircle
    v-else
    :id="props.id"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-valuetext="ariaValuetext"
    :content="formattedContent"
    :data-attrs="dataAttrs"
    :native-class="attrs.class"
    :native-style="attrs.style"
    :orbit-stroke="props.orbitStroke"
    :percent="clampedPercent"
    :percent-number="clampedPercentNumber"
    :root-class="[props.class, props.className]"
    :root-style="props.style"
    :show-info="props.showInfo"
    :size="props.size"
    :stroke="selectedStroke"
    :stroke-linecap="props.strokeLinecap"
    :stroke-width="props.strokeWidth"
    :width="props.width"
  />
</template>
