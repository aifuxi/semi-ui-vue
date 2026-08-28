<script setup lang="ts">
import { computed } from 'vue';

import TimePickerColumn from './TimePickerColumn.vue';
import TimePickerNodeRenderer from './TimePickerNodeRenderer';
import type {
  TimePickerDisabledOptions,
  TimePickerLocale,
  TimePickerPanelType,
  TimePickerScrollItemProps,
} from './types';

interface PanelChange {
  isAM: boolean;
  timeStampValue: number;
  value: string;
}

const props = defineProps<{
  disabledOptions?: TimePickerDisabledOptions | undefined;
  format: string;
  hideDisabledOptions: boolean;
  hourStep?: number | undefined;
  index: number;
  isAM: boolean;
  locale: TimePickerLocale;
  minuteStep?: number | undefined;
  panelFooter?: unknown | undefined;
  panelHeader?: unknown | undefined;
  panelType: TimePickerPanelType;
  scrollItemProps?: TimePickerScrollItemProps | undefined;
  secondStep?: number | undefined;
  showFooter: boolean;
  showHeader: boolean;
  timeStampValue?: Date | undefined;
  use12Hours: boolean;
}>();
const emit = defineEmits<{ change: [value: PanelChange, index: number] }>();

function validStep(value: number | undefined): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : 1;
}

function optionValues(length: number, step: number, disabled: number[]): number[] {
  const output: number[] = [];
  for (let value = 0; value < length; value += step) {
    if (!props.hideDisabledOptions || !disabled.includes(value)) output.push(value);
  }
  return output;
}

const date = computed(() => {
  const input = props.timeStampValue;
  if (input instanceof Date && !Number.isNaN(input.getTime())) return new Date(input);
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
});
const disabledHours = computed(() => props.disabledOptions?.disabledHours?.() ?? []);
const disabledMinutes = computed(
  () => props.disabledOptions?.disabledMinutes?.(date.value.getHours()) ?? [],
);
const disabledSeconds = computed(
  () =>
    props.disabledOptions?.disabledSeconds?.(date.value.getHours(), date.value.getMinutes()) ?? [],
);
const showHour = computed(() => /HH|hh|H|h/.test(props.format));
const showMinute = computed(() => /mm/.test(props.format));
const showSecond = computed(() => /ss/.test(props.format));
const hourValues = computed(() => {
  const values = optionValues(24, validStep(props.hourStep), disabledHours.value);
  return props.use12Hours ? [12, ...values.filter((value) => value > 0 && value < 12)] : values;
});
const hourOptions = computed(() =>
  hourValues.value.map((value) => ({
    value: String(value).padStart(2, '0'),
    disabled: props.use12Hours
      ? disabledHours.value.includes(props.isAM ? value % 12 : (value % 12) + 12)
      : disabledHours.value.includes(value),
  })),
);
const minuteValues = computed(() =>
  optionValues(60, validStep(props.minuteStep), disabledMinutes.value),
);
const minuteOptions = computed(() =>
  minuteValues.value.map((value) => ({
    value: String(value).padStart(2, '0'),
    disabled: disabledMinutes.value.includes(value),
  })),
);
const secondValues = computed(() =>
  optionValues(60, validStep(props.secondStep), disabledSeconds.value),
);
const secondOptions = computed(() =>
  secondValues.value.map((value) => ({
    value: String(value).padStart(2, '0'),
    disabled: disabledSeconds.value.includes(value),
  })),
);
const ampmOptions = computed(() => [
  { value: 'AM', text: props.locale.AM ?? '上午' },
  { value: 'PM', text: props.locale.PM ?? '下午' },
]);
const selectedHourIndex = computed(() =>
  hourValues.value.indexOf(
    props.use12Hours ? date.value.getHours() % 12 || 12 : date.value.getHours(),
  ),
);
const selectedMinuteIndex = computed(() => minuteValues.value.indexOf(date.value.getMinutes()));
const selectedSecondIndex = computed(() => secondValues.value.indexOf(date.value.getSeconds()));

function change(type: 'ampm' | 'hour' | 'minute' | 'second', value: string): void {
  const next = new Date(date.value);
  let isAM = props.isAM;
  if (type === 'hour') {
    const hour = Number(value);
    next.setHours(props.use12Hours ? (isAM ? hour % 12 : (hour % 12) + 12) : hour);
  } else if (type === 'minute') next.setMinutes(Number(value));
  else if (type === 'second') next.setSeconds(Number(value));
  else if (value === 'PM') {
    isAM = false;
    if (next.getHours() < 12) next.setHours(next.getHours() + 12);
  } else {
    isAM = true;
    if (next.getHours() >= 12) next.setHours(next.getHours() - 12);
  }
  emit('change', { isAM, timeStampValue: Number(next), value: '' }, props.index);
}
</script>

<template>
  <div class="semi-scrolllist">
    <div v-if="props.showHeader" class="semi-scrolllist-header">
      <div class="semi-scrolllist-header-title" x-semi-prop="panelHeader">
        <TimePickerNodeRenderer :content="props.panelHeader as never" />
      </div>
      <div class="semi-scrolllist-line" />
    </div>
    <div class="semi-scrolllist-body" x-semi-prop="children">
      <TimePickerColumn
        v-if="props.use12Hours"
        class-name="semi-timepicker-panel-list-ampm"
        :cycled="props.scrollItemProps?.cycled"
        :mode="props.scrollItemProps?.mode ?? 'wheel'"
        :motion="props.scrollItemProps?.motion"
        :options="ampmOptions"
        :selected-index="props.isAM ? 0 : 1"
        :style="props.scrollItemProps?.style"
        type="ampm"
        @select="change('ampm', $event)"
      />
      <TimePickerColumn
        v-if="showHour"
        class-name="semi-timepicker-panel-list-hour"
        :cycled="props.scrollItemProps?.cycled"
        :mode="props.scrollItemProps?.mode ?? 'wheel'"
        :motion="props.scrollItemProps?.motion"
        :options="hourOptions"
        :selected-index="selectedHourIndex"
        :style="props.scrollItemProps?.style"
        type="hour"
        :unit="props.locale.hour"
        @select="change('hour', $event)"
      />
      <TimePickerColumn
        v-if="showMinute"
        class-name="semi-timepicker-panel-list-minute"
        :cycled="props.scrollItemProps?.cycled"
        :mode="props.scrollItemProps?.mode ?? 'wheel'"
        :motion="props.scrollItemProps?.motion"
        :options="minuteOptions"
        :selected-index="selectedMinuteIndex"
        :style="props.scrollItemProps?.style"
        type="minute"
        :unit="props.locale.minute"
        @select="change('minute', $event)"
      />
      <TimePickerColumn
        v-if="showSecond"
        class-name="semi-timepicker-panel-list-second"
        :cycled="props.scrollItemProps?.cycled"
        :mode="props.scrollItemProps?.mode ?? 'wheel'"
        :motion="props.scrollItemProps?.motion"
        :options="secondOptions"
        :selected-index="selectedSecondIndex"
        :style="props.scrollItemProps?.style"
        type="second"
        :unit="props.locale.second"
        @select="change('second', $event)"
      />
    </div>
    <div v-if="props.showFooter" class="semi-scrolllist-footer" x-semi-prop="panelFooter">
      <TimePickerNodeRenderer :content="props.panelFooter as never" />
    </div>
  </div>
</template>
