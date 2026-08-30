<script setup lang="ts">
import {
  TimePicker,
  type TimePickerChangeValue,
  type TimePickerFormattedValue,
} from '@aifuxi/semi-ui-vue';
import { shallowRef } from 'vue';

const status = shallowRef('none');
const stableScroll = { mode: 'normal' as const, cycled: false, motion: false };

function handleChange(
  _date: TimePickerChangeValue | TimePickerFormattedValue,
  value: TimePickerFormattedValue | TimePickerChangeValue,
): void {
  status.value = `change:${String(value)}`;
}
</script>

<template>
  <div class="time-picker-scenario" data-testid="time-picker-vue">
    <section class="time-picker-scenario__section" aria-label="基础时间选择">
      <h3>基础、尺寸与状态</h3>
      <div class="time-picker-scenario__stack">
        <TimePicker
          default-value="10:24:18"
          :motion="false"
          :scroll-item-props="stableScroll"
          :show-clear="false"
          data-parity-target="time-picker-basic"
          @change="handleChange"
        />
        <div class="time-picker-scenario__row">
          <TimePicker
            size="small"
            default-value="08:30:00"
            :motion="false"
            :scroll-item-props="stableScroll"
            :show-clear="false"
            data-parity-target="time-picker-small"
          />
          <TimePicker
            size="large"
            default-value="18:45:30"
            :motion="false"
            :scroll-item-props="stableScroll"
            :show-clear="false"
            data-parity-target="time-picker-large"
          />
        </div>
        <div class="time-picker-scenario__row">
          <TimePicker
            disabled
            default-value="12:00:00"
            :motion="false"
            :show-clear="false"
            data-parity-target="time-picker-disabled"
          />
          <TimePicker
            validate-status="warning"
            default-value="09:15:00"
            :motion="false"
            :scroll-item-props="stableScroll"
            :show-clear="false"
            data-parity-target="time-picker-warning"
          />
        </div>
      </div>
    </section>

    <section class="time-picker-scenario__section" aria-label="范围与十二小时制">
      <h3>范围、步长与 12 小时制</h3>
      <div class="time-picker-scenario__stack">
        <TimePicker
          type="timeRange"
          :default-value="['09:00:00', '18:00:00']"
          :minute-step="15"
          :motion="false"
          :scroll-item-props="stableScroll"
          :show-clear="false"
          data-parity-target="time-picker-range"
        />
        <TimePicker
          use12-hours
          default-value="PM 3:24:18"
          :motion="false"
          :scroll-item-props="stableScroll"
          :show-clear="false"
          data-parity-target="time-picker-12h"
        />
      </div>
    </section>

    <output class="time-picker-scenario__status" aria-live="polite">
      {{ `最近变化：${status}` }}
    </output>
  </div>
</template>
