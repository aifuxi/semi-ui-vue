<script setup lang="ts">
import {
  getDatePickerYearAndMonth,
  getDatePickerYears,
  YearAndMonthFoundation,
  type MonthScrollItem,
  type YearAndMonthAdapter,
  type YearAndMonthFoundationProps,
  type YearAndMonthFoundationState,
  type YearAndMonthSelection,
  type YearScrollItem,
} from '@workspace/foundation-integration';
import { set, setMonth, setYear } from 'date-fns';
import {
  computed,
  defineComponent,
  h,
  markRaw,
  onBeforeUnmount,
  shallowReactive,
  watch,
} from 'vue';

import { ScrollItem, ScrollList } from '../scroll-list';
import type { DatePickerLocale, DatePickerProps } from './types';

const props = defineProps<{
  locale: DatePickerLocale;
  localeCode: string;
  pickerProps: DatePickerProps;
  value: Array<Date | null>;
}>();
const emit = defineEmits<{ select: [selection: YearAndMonthSelection] }>();

/** 年份默认范围和缺省左右值沿用只读基线的工具函数。 */
function initialSelection(): YearAndMonthSelection {
  const left = props.value[0];
  const right = props.pickerProps.type === 'monthRange' ? props.value[1] : undefined;
  const { year, month } = getDatePickerYearAndMonth(
    { left: left?.getFullYear() ?? 0, right: right?.getFullYear() ?? 0 },
    { left: left ? left.getMonth() + 1 : 0, right: right ? right.getMonth() + 1 : 0 },
  );
  return { currentYear: year, currentMonth: month };
}
const state = shallowReactive<YearAndMonthFoundationState>({
  ...initialSelection(),
  years: getDatePickerYears(props.pickerProps.startYear, props.pickerProps.endYear).map((year) => ({
    value: year,
    year,
  })),
  months: Array.from({ length: 12 }, (_, index) => ({ value: index + 1, month: index + 1 })),
});
const cache = new Map<string, unknown>();
const panels = computed<Array<'left' | 'right'>>(() =>
  props.pickerProps.type === 'month' ? ['left'] : ['left', 'right'],
);
/** 单列面板保持 ScrollList 为 flex 直属子节点，范围面板才需要并列容器。 */
const Body = defineComponent({
  inheritAttrs: false,
  setup(_props, { slots }) {
    return () =>
      panels.value.length === 1
        ? slots.default?.()
        : h('div', { class: 'semi-datepicker-yearmonth-body' }, slots.default?.());
  },
});
/** 由适配器提供当前 props；范围修正和不可选月份回退交给固定 Foundation。 */
function foundationProps(): YearAndMonthFoundationProps {
  return {
    ...props.pickerProps,
    type: props.pickerProps.type ?? 'month',
    disabledDate: (date) => Boolean(props.pickerProps.disabledDate?.(date)),
    locale: props.locale,
  };
}
/** 与 React 的 YearAndMonth onSelect 使用相同的完整年月对象。 */
function notify(year = state.currentYear, month = state.currentMonth): void {
  emit('select', { currentYear: year, currentMonth: month });
}
const adapter: YearAndMonthAdapter = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (next, callback) => {
    Object.assign(state, next);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  setCurrentYear: (year, callback) => {
    state.currentYear = year;
    callback?.();
  },
  setCurrentMonth: (month) => {
    state.currentMonth = month;
  },
  setCurrentYearAndMonth: (year, month) => {
    state.currentYear = year;
    state.currentMonth = month;
  },
  notifySelectYear: (year) => notify(year),
  notifySelectMonth: (month) => notify(state.currentYear, month),
  notifySelectYearAndMonth: notify,
  notifyBackToMain: () => undefined,
};
const foundation = markRaw(new YearAndMonthFoundation(adapter));
/** 右列禁用早于左端的年月；整年所有月份均禁用时禁止选择该年。 */
function years(panel: 'left' | 'right'): YearScrollItem[] {
  const currentDate = setMonth(new Date(), state.currentMonth[panel] - 1);
  return state.years.map((item) => ({
    ...item,
    disabled:
      (panel === 'right' && item.year < state.currentYear.left) ||
      state.months.every(({ month }) =>
        foundationProps().disabledDate(set(currentDate, { year: item.year, month: month - 1 })),
      ),
  }));
}
/** 选项文字及仅选中项追加单位，与 Semi 的 normal ScrollItem 一致。 */
function months(panel: 'left' | 'right'): MonthScrollItem[] {
  return state.months.map(({ month }) => ({
    month,
    value: props.locale.fullMonths[month] ?? String(month),
    disabled:
      (panel === 'right' &&
        state.currentYear.left === state.currentYear.right &&
        month < state.currentMonth.left) ||
      foundationProps().disabledDate(
        setMonth(setYear(new Date(), state.currentYear[panel]), month - 1),
      ),
  }));
}
/** 中文只为选中项添加“年/月”，其他语言保留 locale 原文。 */
function yearText(value: unknown): string {
  return `${String(value)}${props.localeCode === 'zh-CN' || props.localeCode === 'zh-TW' ? '年' : ''}`;
}
/** 中文月份单位在选中后追加，避免影响未选项宽度。 */
function monthText(value: unknown): string {
  return `${String(value)}${props.localeCode === 'zh-CN' || props.localeCode === 'zh-TW' ? '月' : ''}`;
}
watch(
  () => props.value,
  () => Object.assign(state, initialSelection()),
  { deep: true },
);
onBeforeUnmount(() => foundation.destroy());
</script>

<template>
  <Body>
    <ScrollList v-for="panel in panels" :key="panel">
      <ScrollItem
        mode="normal"
        type="year"
        :list="years(panel)"
        :selected-index="state.years.findIndex((item) => item.year === state.currentYear[panel])"
        :transform="yearText"
        v-bind="pickerProps.yearAndMonthOpts"
        @select="foundation.selectYear($event as unknown as YearScrollItem, panel)"
      />
      <ScrollItem
        mode="normal"
        type="month"
        cycled
        :list="months(panel)"
        :selected-index="state.currentMonth[panel] - 1"
        :transform="monthText"
        v-bind="pickerProps.yearAndMonthOpts"
        @select="foundation.selectMonth($event as unknown as MonthScrollItem, panel)"
      />
    </ScrollList>
  </Body>
</template>
