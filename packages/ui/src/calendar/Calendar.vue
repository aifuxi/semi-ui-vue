<script setup lang="ts">
import type {
  FoundationCalendarEvent,
  ParsedCalendarEvent,
} from '@workspace/foundation-integration';
import { enUS, zhCN } from 'date-fns/locale';
import {
  computed,
  inject,
  provide,
  shallowRef,
  useAttrs,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue, type SemiLocale } from '../config-provider';
import CalendarDay from './CalendarDay.vue';
import CalendarMonth from './CalendarMonth.vue';
import CalendarWeek from './CalendarWeek.vue';
import { calendarContextKey, type CalendarRuntime } from './calendar-context';
import type {
  CalendarEmits,
  CalendarEvent,
  CalendarLocale,
  CalendarProps,
  CalendarSlots,
  ResolvedCalendarProps,
} from './types';
import { useCalendarFoundation } from './use-calendar-foundation';

const DEFAULT_ZH_CN_CALENDAR_LOCALE: Readonly<CalendarLocale> = Object.freeze({
  allDay: '全天',
  AM: '上午${time}时',
  PM: '下午${time}时',
  datestring: '日',
  remaining: '还有${remained}项',
  close: '关闭事件列表',
});
const DEFAULT_EN_US_CALENDAR_LOCALE: Readonly<CalendarLocale> = Object.freeze({
  allDay: 'All Day',
  AM: '${time} AM',
  PM: '${time} PM',
  datestring: '',
  remaining: '${remained} more',
  close: 'Close event list',
});

defineOptions({ name: 'Calendar', inheritAttrs: false });
const props = withDefaults(defineProps<CalendarProps>(), {
  events: () => [],
  height: 600,
  markWeekend: false,
  minEventHeight: Number.MIN_SAFE_INTEGER,
  mode: 'week',
  range: () => [],
  scrollTop: 400,
  showCurrTime: true,
  weekStartsOn: 0,
});
const emit = defineEmits<CalendarEmits>();
defineSlots<CalendarSlots>();
const attrs = useAttrs();
const slots = useSlots() as Readonly<CalendarSlots>;
const initialDate = shallowRef(props.displayValue ?? new Date());
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);
const localeCode = computed(() => config.value.locale.code ?? 'zh-CN');
const locale = computed<CalendarLocale>(() => {
  const fallback =
    localeCode.value === 'en-US' ? DEFAULT_EN_US_CALENDAR_LOCALE : DEFAULT_ZH_CN_CALENDAR_LOCALE;
  const configured = config.value.locale.Calendar as Partial<CalendarLocale> | undefined;
  return { ...fallback, ...configured };
});
const dateFnsLocale = computed(() => {
  const configured = (config.value.locale as SemiLocale & { dateFnsLocale?: unknown })
    .dateFnsLocale;
  return (configured as typeof zhCN | undefined) ?? (localeCode.value === 'en-US' ? enUS : zhCN);
});
const resolvedProps = computed<ResolvedCalendarProps>(() => ({
  className: props.className,
  displayValue: props.displayValue ?? initialDate.value,
  events: props.events,
  header: props.header,
  height: props.height,
  markWeekend: props.markWeekend,
  minEventHeight: props.minEventHeight,
  mode: props.mode,
  range: props.range,
  scrollTop: props.scrollTop,
  showCurrTime: props.showCurrTime,
  style: props.style,
  weekStartsOn: props.weekStartsOn,
  width: props.width,
}));
const foundationProps = computed<ResolvedCalendarProps & { events: FoundationCalendarEvent[] }>(
  () => ({
    ...resolvedProps.value,
    events: resolvedProps.value.events.map((event) => ({ ...event, children: event })),
  }),
);
const { foundation, refreshDay, refreshMonth, refreshRange, refreshWeek, state } =
  useCalendarFoundation(foundationProps, dateFnsLocale);

function sourceEvent(event: ParsedCalendarEvent | CalendarEvent): CalendarEvent {
  const children = event.children;
  return children && typeof children === 'object' && 'key' in children
    ? (children as CalendarEvent)
    : (event as CalendarEvent);
}

function eventContent(event: ParsedCalendarEvent | CalendarEvent): VNodeChild {
  const source = sourceEvent(event);
  return slots.event?.({ event: source }) ?? source.content;
}

const runtime: CalendarRuntime = {
  click: (event, date) => emit('click', event, date),
  close: (event) => emit('close', event),
  dateFnsLocale,
  direction: computed(() => config.value.direction),
  eventContent,
  foundation,
  formatClickValue: (value) => foundation.formatCbValue([...value] as typeof value),
  getPopupContainer: computed(() => config.value.getPopupContainer),
  locale,
  moreClick: (event, date, remaining) => emit('moreClick', event, date, remaining),
  props: resolvedProps,
  refreshMonth,
  refreshRange,
  refreshWeek,
  slots,
  state,
};
provide(calendarContextKey, runtime);

watch(
  () => [
    props.mode,
    props.displayValue?.getTime(),
    props.range.map((date) => date.getTime()).join(','),
    props.weekStartsOn,
    dateFnsLocale.value,
    props.events,
  ],
  () => {
    if (props.mode === 'day') refreshDay();
    else if (props.mode === 'month') refreshMonth(state.itemLimit);
    else if (props.mode === 'range') refreshRange();
    else refreshWeek();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <CalendarDay v-if="resolvedProps.mode === 'day'" v-bind="attrs" />
  <CalendarMonth v-else-if="resolvedProps.mode === 'month'" v-bind="attrs" />
  <CalendarWeek v-else-if="resolvedProps.mode === 'range'" v-bind="attrs" range-mode />
  <CalendarWeek v-else v-bind="attrs" />
</template>
