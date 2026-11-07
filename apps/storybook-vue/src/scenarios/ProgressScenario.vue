<script setup lang="ts">
import { shallowRef } from 'vue';
import { Progress, type ProgressSize } from '@aifuxi/semi-ui-vue/progress';

/** 专项参数用于看三档进度尺寸及空/满边界，不改变默认截图。 */
const reviewQuery = new URLSearchParams(window.location.search);
/** 三档公开尺寸。 */
const reviewSize = (
  ['small', 'default', 'large'].includes(reviewQuery.get('reviewSize') ?? '')
    ? reviewQuery.get('reviewSize')
    : undefined
) as ProgressSize | undefined;
/** 只额外接受明确的零和百分之百边界。 */
const reviewPercent =
  reviewQuery.get('reviewPercent') === '0'
    ? 0
    : reviewQuery.get('reviewPercent') === '100'
      ? 100
      : undefined;

const gradientStroke = [
  { percent: 50, color: '#fff' },
  { percent: 52, color: 'rgba(0, 0, 0, 0)' },
];
const motionPercent = shallowRef(50);
</script>

<template>
  <div class="progress-scenario" data-testid="progress-vue">
    <button class="progress-scenario__motion-control" type="button" @click="motionPercent = 80">
      Animate
    </button>
    <div class="progress-scenario__line-stack">
      <Progress
        aria-label="Default progress"
        data-parity-target="progress-line-default"
        :percent="reviewPercent ?? motionPercent"
        :size="reviewSize ?? 'default'"
        show-info
        style="width: 100%"
      />
      <Progress
        aria-label="Large progress"
        data-parity-target="progress-line-info"
        :motion="false"
        orbit-stroke="var(--semi-color-warning-light-default)"
        :percent="reviewPercent ?? 80"
        show-info
        :size="reviewSize ?? 'large'"
        stroke="var(--semi-color-warning)"
        style="width: 100%"
      />
    </div>
    <div class="progress-scenario__vertical">
      <Progress
        aria-label="Vertical progress"
        data-parity-target="progress-vertical"
        direction="vertical"
        :motion="false"
        :percent="reviewPercent ?? 65"
        show-info
        :size="reviewSize ?? 'large'"
      />
    </div>
    <div class="progress-scenario__circles">
      <Progress
        aria-label="Circular progress"
        data-parity-target="progress-circle-default"
        :motion="false"
        :percent="reviewPercent ?? 65"
        :size="reviewSize ?? 'default'"
        show-info
        type="circle"
      />
      <Progress
        aria-label="Gradient progress"
        data-parity-target="progress-circle-gradient"
        :format="(percent) => `${percent}‰`"
        :motion="false"
        :percent="reviewPercent ?? 51"
        :size="reviewSize ?? 'default'"
        show-info
        :stroke="gradientStroke"
        stroke-gradient
        stroke-linecap="square"
        :stroke-width="8"
        type="circle"
        :width="96"
      />
      <Progress
        aria-label="Small progress"
        data-parity-target="progress-circle-small"
        :motion="false"
        :percent="reviewPercent ?? 30"
        show-info
        :size="reviewSize ?? 'small'"
        type="circle"
      />
    </div>
  </div>
</template>
