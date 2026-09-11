<script setup lang="ts">
import { shallowRef, onMounted, onBeforeUnmount } from 'vue';
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import IconChevronLeft from '@aifuxi/semi-icons-vue/icons/IconChevronLeft';
import IconChevronRight from '@aifuxi/semi-icons-vue/icons/IconChevronRight';
const percent = shallowRef(65);
const automaticPercent = shallowRef(0);
const stroke = [
  { percent: 0, color: 'rgb(249, 57, 32)' },
  { percent: 50, color: '#46259E' },
  { percent: 100, color: 'hsla(125, 50%, 46% / 1)' },
];
const reverseStroke = stroke.map((point, index) => ({
  percent: point.percent,
  color: stroke[stroke.length - 1 - index]!.color,
}));
let timer: ReturnType<typeof setTimeout> | undefined;
function scheduleNext(): void {
  const value = automaticPercent.value;
  timer = setTimeout(
    () => {
      automaticPercent.value = value > 100 ? 0 : value + 3;
      scheduleNext();
    },
    value === 0 || value > 100 ? 1200 : 290 - (value % 50) * 3,
  );
}
// Start in the client and cancel the pending update when this demo is removed.
onMounted(scheduleNext);
onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
  <div>
    <Space :spacing="20">
      <div>
        <Progress
          :percent="automaticPercent"
          :stroke="stroke"
          stroke-gradient
          show-info
          type="circle"
          :width="100"
          aria-label="File download speed"
        />
      </div>
      <div>
        <Progress
          :percent="automaticPercent"
          :stroke="reverseStroke"
          stroke-gradient
          show-info
          type="circle"
          :width="100"
          aria-label="File download speed"
        />
      </div>
    </Space>
    <div style="width: 100%; margin: 20px 0 10px">
      <Progress
        :percent="percent"
        :stroke="stroke"
        stroke-gradient
        show-info
        size="large"
        aria-label="File download speed"
      />
    </div>
    <Button
      theme="light"
      aria-label="Decrease progress"
      :disabled="percent === 0"
      @click="percent -= 5"
      ><template #icon><IconChevronLeft /></template
    ></Button>
    <Button
      theme="light"
      aria-label="Increase progress"
      :disabled="percent >= 100"
      @click="percent += 5"
      ><template #icon><IconChevronRight /></template
    ></Button>
  </div>
</template>
