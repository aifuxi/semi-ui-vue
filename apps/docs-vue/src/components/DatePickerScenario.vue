<script setup lang="ts">
import { DatePicker } from '@workspace/ui';

const props = defineProps<{ direction: 'ltr' | 'rtl' }>();

const selectedDate = new Date(2024, 4, 10, 0, 0, 0, 0);
const pickerDate = new Date(2024, 4, 1, 0, 0, 0, 0);
</script>

<template>
  <div class="date-picker-scenario" data-testid="date-picker-vue">
    <div data-parity-target="date-picker-trigger">
      <DatePicker
        :default-value="selectedDate"
        :default-picker-value="pickerDate"
        dropdown-class-name="date-picker-target-popup"
        :motion="false"
        :open="true"
        :position="props.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'"
      />
    </div>
  </div>
</template>
