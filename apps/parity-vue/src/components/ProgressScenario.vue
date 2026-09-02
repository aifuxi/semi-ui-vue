<script setup lang="ts">
import { shallowRef } from 'vue';
import { Progress } from '@aifuxi/semi-ui-vue';

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
        :percent="motionPercent"
        show-info
        style="width: 100%"
      />
      <Progress
        aria-label="Large progress"
        data-parity-target="progress-line-info"
        :motion="false"
        orbit-stroke="var(--semi-color-warning-light-default)"
        :percent="80"
        show-info
        size="large"
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
        :percent="65"
        show-info
        size="large"
      />
    </div>
    <div class="progress-scenario__circles">
      <Progress
        aria-label="Circular progress"
        data-parity-target="progress-circle-default"
        :motion="false"
        :percent="65"
        show-info
        type="circle"
      />
      <Progress
        aria-label="Gradient progress"
        data-parity-target="progress-circle-gradient"
        :format="(percent) => `${percent}‰`"
        :motion="false"
        :percent="51"
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
        :percent="30"
        show-info
        size="small"
        type="circle"
      />
    </div>
  </div>
</template>
