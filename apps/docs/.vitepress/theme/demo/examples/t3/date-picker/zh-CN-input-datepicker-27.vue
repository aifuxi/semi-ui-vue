<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';
</script>
<template>
  <DatePicker
    :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
    style="width: 260px"
    type="dateRange"
    ><template #fullDate="{ dayNumber, status }"
      ><div
        :class="{
          'components-datepicker-demo-day-inrange': status.isInRange,
          'components-datepicker-demo-day-hover': status.isHover,
          'components-datepicker-demo-day-selected': status.isSelected,
          'components-datepicker-demo-day-selected-start': status.isSelectedStart,
          'components-datepicker-demo-day-selected-end': status.isSelectedEnd,
        }"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80%;
          height: 80%;
          border-radius: var(--semi-border-radius-circle);
        "
      >
        {{ dayNumber }}
      </div></template
    ></DatePicker
  >
</template>

<style>
.components-datepicker-demo-day-inrange,
.components-datepicker-demo-day-hover {
  background: var(--semi-color-primary-light-hover);
}
.components-datepicker-demo-day-selected,
.components-datepicker-demo-day-selected-start,
.components-datepicker-demo-day-selected-end {
  color: var(--semi-color-bg-2);
  background: var(--semi-color-primary);
}
</style>
