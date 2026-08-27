<script setup lang="ts">
import { shallowRef } from 'vue';
import { ConfigProvider, Slider, type SliderValue } from '@workspace/ui';

defineProps<{ direction: 'ltr' | 'rtl' }>();

const MARKS = { 0: '0', 20: '20°C', 50: '50°C', 80: '80°C', 100: '100' };
const status = shallowRef('none');
const updateStatus = (name: string, value: SliderValue) => {
  status.value = `${name}:${String(value)}`;
};
</script>

<template>
  <ConfigProvider :direction="direction">
    <div class="slider-scenario" data-testid="slider-vue">
      <section class="slider-scenario__section" aria-label="基础滑动选择器">
        <h3>基础与范围</h3>
        <div class="slider-scenario__stack">
          <Slider
            aria-label="基础值"
            :default-value="30"
            data-parity-target="slider-basic"
            @change="updateStatus('basic', $event)"
          />
          <Slider
            aria-label="范围值"
            range
            :default-value="[20, 70]"
            data-parity-target="slider-range"
            @change="updateStatus('range', $event)"
          />
          <Slider
            aria-label="禁用值"
            disabled
            :default-value="55"
            data-parity-target="slider-disabled"
          />
        </div>
      </section>

      <section class="slider-scenario__section" aria-label="刻度与纵向">
        <h3>刻度与纵向</h3>
        <div class="slider-scenario__row">
          <div class="slider-scenario__marks">
            <Slider
              aria-label="温度范围"
              range
              :step="10"
              :marks="MARKS"
              :default-value="[20, 60]"
              :handle-dot="[
                { color: 'var(--semi-color-primary)', size: '6px' },
                { color: 'var(--semi-color-danger)', size: '6px' },
              ]"
              data-parity-target="slider-marks"
              @change="updateStatus('marks', $event)"
            />
          </div>
          <div class="slider-scenario__vertical">
            <Slider
              aria-label="纵向值"
              vertical
              :default-value="40"
              data-parity-target="slider-vertical"
              @change="updateStatus('vertical', $event)"
            />
          </div>
        </div>
      </section>

      <output class="slider-scenario__status" aria-live="polite"> 最近变化：{{ status }} </output>
    </div>
  </ConfigProvider>
</template>
