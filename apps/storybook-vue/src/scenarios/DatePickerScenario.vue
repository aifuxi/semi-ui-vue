<script setup lang="ts">
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import {
  readDatePickerReviewProps,
  readInputReviewProps,
} from '../../../../packages/test-infra/src/input-theme-review';

/** 双端共享真实 props，保留原固定日期和打开状态。 */
const reviewProps = readInputReviewProps(['size', 'disabled', 'validateStatus']);

const props = defineProps<{ direction: 'ltr' | 'rtl' }>();

const selectedDate = new Date(2024, 4, 10, 0, 0, 0, 0);
const pickerDate = new Date(2024, 4, 1, 0, 0, 0, 0);
/** 与 React 相同的固定日期模式和密度，默认 query 不增加公开属性。 */
const panelProps = readDatePickerReviewProps();
/** 范围和多选使用固定值，不依赖本地当前时间。 */
const reviewValue = panelProps.type?.endsWith('Range')
  ? [selectedDate, new Date(2024, 5, 15)]
  : panelProps.multiple
    ? [selectedDate, new Date(2024, 4, 12)]
    : selectedDate;
</script>

<template>
  <div class="date-picker-scenario" data-testid="date-picker-vue">
    <div data-parity-target="date-picker-trigger">
      <DatePicker
        v-bind="{ ...reviewProps, ...panelProps }"
        :default-value="reviewValue"
        :default-picker-value="pickerDate"
        dropdown-class-name="date-picker-target-popup"
        :motion="false"
        :open="true"
        :position="props.direction === 'rtl' ? 'bottomRight' : 'bottomLeft'"
      />
    </div>
  </div>
</template>
