<script setup lang="ts">
import { shallowRef } from 'vue';

import {
  ScrollItem,
  ScrollList,
  type ScrollItemData,
  type ScrollItemSelectData,
} from '@aifuxi/semi-ui-vue/scroll-list';

const periods: ScrollItemData[] = [
  { value: 'AM', transform: () => 'Morning' },
  { value: 'PM' },
  { value: 'Night', disabled: true },
];
const hours: ScrollItemData[] = Array.from({ length: 8 }, (_, index) => ({
  value: index + 1,
  disabled: index === 5,
}));
const minutes: ScrollItemData[] = Array.from({ length: 8 }, (_, index) => ({
  value: index * 5,
  disabled: index === 3,
}));

const normalPeriod = shallowRef(0);
const normalHour = shallowRef(2);
const wheelPeriod = shallowRef(1);
const wheelHour = shallowRef(3);
const wheelMinute = shallowRef(4);

function selectNormal(data: ScrollItemSelectData): void {
  if (data.type === 'normal-period') normalPeriod.value = data.index;
  if (data.type === 'normal-hour') normalHour.value = data.index;
}

function selectWheel(data: ScrollItemSelectData): void {
  if (data.type === 'wheel-period') wheelPeriod.value = data.index;
  if (data.type === 'wheel-hour') wheelHour.value = data.index;
  if (data.type === 'wheel-minute') wheelMinute.value = data.index;
}
</script>

<template>
  <div class="scroll-list-scenario" data-testid="scroll-list-vue">
    <section data-parity-target="scroll-list-normal">
      <ScrollList :body-height="180">
        <template #header>Normal columns</template>
        <ScrollItem
          aria-label="Normal period"
          :list="periods"
          mode="normal"
          :selected-index="normalPeriod"
          type="normal-period"
          @select="selectNormal"
        />
        <ScrollItem
          aria-label="Normal hour"
          :list="hours"
          mode="normal"
          :selected-index="normalHour"
          :transform="(value) => `${String(value)} h`"
          type="normal-hour"
          @select="selectNormal"
        />
        <template #footer><span>Click to select</span></template>
      </ScrollList>
    </section>
    <section data-parity-target="scroll-list-wheel">
      <ScrollList :body-height="180">
        <template #header>Wheel columns</template>
        <ScrollItem
          aria-label="Wheel period"
          :list="periods"
          mode="wheel"
          :motion="false"
          :selected-index="wheelPeriod"
          type="wheel-period"
          @select="selectWheel"
        />
        <ScrollItem
          aria-label="Wheel hour"
          cycled
          :list="hours"
          mode="wheel"
          :motion="false"
          :selected-index="wheelHour"
          type="wheel-hour"
          @select="selectWheel"
        />
        <ScrollItem
          aria-label="Wheel minute"
          :list="minutes"
          mode="wheel"
          :motion="false"
          :selected-index="wheelMinute"
          :transform="(value) => `${String(value)} min`"
          type="wheel-minute"
          @select="selectWheel"
        />
        <template #footer><span>Scroll to select</span></template>
      </ScrollList>
    </section>
  </div>
</template>
