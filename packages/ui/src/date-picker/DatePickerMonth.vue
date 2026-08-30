<script setup lang="ts">
import {
  getDatePickerDayOfWeek,
  getDatePickerMonthTable,
  type DatePickerMonthDay,
} from '@workspace/foundation-integration';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { computed, type VNodeChild } from 'vue';

import DatePickerNodeRenderer from './DatePickerNodeRenderer';
import type { DatePickerDayStatus, DatePickerLocale, DatePickerRangeType } from './types';

const props = defineProps<{
  disabledDate: (date: Date, options?: Record<string, unknown>) => boolean;
  hoverDate: Date | undefined;
  isRange: boolean;
  locale: DatePickerLocale;
  month: Date;
  multiple: boolean;
  rangeFocus: DatePickerRangeType | undefined;
  rangeValue: Array<Date | null>;
  renderDate: ((dayNumber?: number, fullDate?: string) => VNodeChild) | undefined;
  renderFullDate:
    | ((dayNumber?: number, fullDate?: string, status?: DatePickerDayStatus) => VNodeChild)
    | undefined;
  selected: Date[];
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}>();

const emit = defineEmits<{
  dayClick: [date: Date];
  dayHover: [date?: Date];
}>();

const table = computed(() => getDatePickerMonthTable(props.month, props.weekStartsOn));
const weekKeys = computed(() => getDatePickerDayOfWeek({ weekStartsOn: props.weekStartsOn }));
const weekdays = computed(() => weekKeys.value.map((key) => props.locale.weeks[key] ?? key));
const weeksHeight = computed(() => `${table.value.weeks.length * 36}px`);
const today = format(new Date(), 'yyyy-MM-dd');

function parseDay(day: DatePickerMonthDay): Date | undefined {
  return day.fullDate ? parseISO(day.fullDate) : undefined;
}

function sameDay(first: Date | null | undefined, second: Date): boolean {
  return Boolean(first && format(first, 'yyyy-MM-dd') === format(second, 'yyyy-MM-dd'));
}

function status(day: DatePickerMonthDay): DatePickerDayStatus {
  const date = parseDay(day);
  if (!date) return {};
  const [rangeStart, rangeEnd] = props.rangeValue;
  const selected = props.selected.some((item) => sameDay(item, date));
  const disabled = props.disabledDate(date, {
    rangeStart: rangeStart ? format(rangeStart, 'yyyy-MM-dd') : '',
    rangeEnd: rangeEnd ? format(rangeEnd, 'yyyy-MM-dd') : '',
    rangeInputFocus: props.rangeFocus,
  });
  const inRange = Boolean(
    rangeStart && rangeEnd && isAfter(date, rangeStart) && isBefore(date, rangeEnd),
  );
  const hoverInRange = Boolean(
    rangeStart &&
    !rangeEnd &&
    props.hoverDate &&
    ((isAfter(date, rangeStart) && isBefore(date, props.hoverDate)) ||
      (isBefore(date, rangeStart) && isAfter(date, props.hoverDate))),
  );
  return {
    isToday: day.fullDate === today,
    isSelected: selected || sameDay(rangeStart, date) || sameDay(rangeEnd, date),
    isDisabled: disabled,
    isSelectedStart: props.isRange && sameDay(rangeStart, date),
    isSelectedEnd: props.isRange && sameDay(rangeEnd, date),
    isInRange: inRange,
    isHover: hoverInRange,
  };
}

function dayClasses(day: DatePickerMonthDay): Array<string | undefined> {
  const value = status(day);
  return [
    'semi-datepicker-day',
    value.isToday ? 'semi-datepicker-day-today' : undefined,
    value.isInRange ? 'semi-datepicker-day-inrange' : undefined,
    value.isHover ? 'semi-datepicker-day-inhover' : undefined,
    value.isSelected ? 'semi-datepicker-day-selected' : undefined,
    value.isSelectedStart ? 'semi-datepicker-day-selected-start' : undefined,
    value.isSelectedEnd ? 'semi-datepicker-day-selected-end' : undefined,
    value.isDisabled ? 'semi-datepicker-day-disabled' : undefined,
  ];
}

function clickDay(day: DatePickerMonthDay): void {
  const date = parseDay(day);
  if (!date || status(day).isDisabled) return;
  emit('dayClick', date);
}
</script>

<template>
  <div role="grid" :aria-multiselectable="props.multiple" class="semi-datepicker-month">
    <div role="row" class="semi-datepicker-weekday">
      <div
        v-for="(weekday, index) in weekdays"
        :key="`${weekday}-${index}`"
        role="columnheader"
        class="semi-datepicker-weekday-item"
      >
        {{ weekday }}
      </div>
    </div>
    <div class="semi-datepicker-weeks" :style="{ height: weeksHeight }">
      <div
        v-for="(week, weekIndex) in table.weeks"
        :key="weekIndex"
        role="row"
        class="semi-datepicker-week"
      >
        <div
          v-for="(day, dayIndex) in week"
          :key="`${day.fullDate}-${dayIndex}`"
          role="gridcell"
          :tabindex="day.fullDate && !status(day).isDisabled ? 0 : -1"
          :aria-disabled="day.fullDate ? status(day).isDisabled : undefined"
          :aria-selected="day.fullDate ? status(day).isSelected : undefined"
          :aria-label="day.fullDate || undefined"
          :title="day.fullDate || undefined"
          :class="props.renderFullDate && day.fullDate ? 'semi-datepicker-day' : dayClasses(day)"
          @click="clickDay(day)"
          @mouseenter="day.fullDate && emit('dayHover', parseDay(day))"
          @mouseleave="day.fullDate && emit('dayHover', undefined)"
        >
          <DatePickerNodeRenderer
            v-if="props.renderFullDate && day.fullDate"
            :content="props.renderFullDate(Number(day.dayNumber), day.fullDate, status(day))"
          />
          <div v-else-if="day.fullDate" class="semi-datepicker-day-main">
            <DatePickerNodeRenderer
              v-if="props.renderDate"
              :content="props.renderDate(Number(day.dayNumber), day.fullDate)"
            />
            <span v-else>{{ day.dayNumber }}</span>
          </div>
          <span v-else />
        </div>
      </div>
    </div>
  </div>
</template>
