<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/button.css';
import { IconClose, IconChevronDown } from '@aifuxi/semi-icons-vue';
import { shallowRef, computed } from 'vue';
import type { DatePickerValue } from '@aifuxi/semi-ui-vue/date-picker';
const date = shallowRef<DatePickerValue>([]);
const hasValue = computed(() =>
  Array.isArray(date.value) ? date.value.length > 0 : Boolean(date.value),
);
function formatted(value: unknown) {
  if (!(value instanceof Date)) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}
const label = computed(() =>
  Array.isArray(date.value) ? date.value.map(formatted).join(' ~ ') : formatted(date.value),
);
function change(next: Date | Date[] | undefined) {
  date.value = next ?? [];
  console.log(next);
}
</script>
<template>
  <DatePicker
    :default-picker-value="new Date(2024, 7, 15, 10, 24, 30)"
    :value="date"
    type="dateTimeRange"
    @update:model-value="change"
    ><template #trigger
      ><Button theme="light" icon-position="right"
        ><template #icon
          ><IconClose v-if="hasValue" @click.stop="date = []" /><IconChevronDown v-else /></template
        >{{ hasValue ? label : 'Please select date time range' }}</Button
      ></template
    ></DatePicker
  >
</template>
