import {
  CalendarFoundation,
  type CalendarAdapter,
  type CalendarDateObject,
  type CalendarMonthData,
  type CalendarParsedEvents,
  type CalendarParsedEventsType,
  type FoundationCalendarEvent,
  type MonthlyCalendarEvents,
  type ParsedCalendarEvent,
} from '@workspace/foundation-integration';
import type { Locale as DateFnsLocale } from 'date-fns';
import { markRaw, onBeforeUnmount, onMounted, shallowReactive, type ComputedRef } from 'vue';

import type { ResolvedCalendarProps } from './types';

export interface CalendarFoundationState {
  itemLimit: number;
  monthlyData: CalendarMonthData;
  parsedEvents: CalendarParsedEvents | MonthlyCalendarEvents;
  rangeData: { month: string; week: CalendarDateObject[] };
  weeklyData: { month: string; week: CalendarDateObject[] };
}

interface UseCalendarFoundationResult {
  foundation: {
    checkWeekend(value: Date): boolean;
    formatCbValue(value: [Date] | [Date, number, number, number]): Date;
    getMonthlyData(value: Date, locale: DateFnsLocale): CalendarMonthData;
    getParseDailyEvents(
      events: FoundationCalendarEvent[],
      date: Date,
    ): {
      day: ParsedCalendarEvent[];
      allDay: ParsedCalendarEvent[];
    };
    getRangeData(value: Date, locale: DateFnsLocale): { month: string; week: CalendarDateObject[] };
    getWeeklyData(
      value: Date,
      locale: DateFnsLocale,
    ): { month: string; week: CalendarDateObject[] };
    parseRangeAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
    parseWeeklyAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
  };
  refreshDay(): void;
  refreshMonth(itemLimit: number): void;
  refreshRange(): void;
  refreshWeek(): void;
  state: ReturnType<typeof shallowReactive<CalendarFoundationState>>;
}

export function useCalendarFoundation(
  runtimeProps: ComputedRef<ResolvedCalendarProps & { events: FoundationCalendarEvent[] }>,
  dateFnsLocale: ComputedRef<DateFnsLocale>,
): UseCalendarFoundationResult {
  const state = shallowReactive<CalendarFoundationState>({
    itemLimit: 0,
    monthlyData: {},
    parsedEvents: { day: [], allDay: [] },
    rangeData: { month: '', week: [] },
    weeklyData: { month: '', week: [] },
  });
  const cache = new Map<unknown, unknown>();

  const adapter: CalendarAdapter<
    ResolvedCalendarProps & { events: FoundationCalendarEvent[] },
    CalendarFoundationState
  > = {
    getContext: () => undefined,
    getContexts: () => ({}),
    getProp: (key) => runtimeProps.value[key],
    getProps: () => runtimeProps.value,
    getState: (key) => state[key],
    getStates: () => state,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(key, value),
    stopPropagation: (event) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
    setParsedEvents: (events: CalendarParsedEventsType) => {
      state.parsedEvents = events;
    },
    cacheEventKeys: () => undefined,
    setRangeData: (data) => {
      state.rangeData = data;
    },
    getRangeData: () => state.rangeData,
    setWeeklyData: (data) => {
      state.weeklyData = data;
    },
    getWeeklyData: () => state.weeklyData,
    setMonthlyData: (data) => {
      state.monthlyData = data;
    },
    getMonthlyData: () => state.monthlyData,
    setItemLimit: (limit) => {
      state.itemLimit = limit;
    },
  };

  const foundation = markRaw(
    new CalendarFoundation<
      ResolvedCalendarProps & { events: FoundationCalendarEvent[] },
      CalendarFoundationState
    >(adapter),
  );

  function refreshDay(): void {
    state.parsedEvents = foundation.getParseDailyEvents(
      runtimeProps.value.events,
      runtimeProps.value.displayValue,
    );
  }

  function refreshWeek(): void {
    state.weeklyData = foundation.getWeeklyData(
      runtimeProps.value.displayValue,
      dateFnsLocale.value,
    );
    state.parsedEvents = foundation.getParsedWeeklyEvents(runtimeProps.value.events);
  }

  function refreshRange(): void {
    const start = runtimeProps.value.range[0] ?? runtimeProps.value.displayValue;
    state.rangeData = foundation.getRangeData(start, dateFnsLocale.value);
    state.parsedEvents = foundation.getParsedRangeEvents(runtimeProps.value.events);
  }

  function refreshMonth(itemLimit: number): void {
    state.itemLimit = itemLimit;
    state.monthlyData = foundation.getMonthlyData(
      runtimeProps.value.displayValue,
      dateFnsLocale.value,
    );
    state.parsedEvents = foundation.getParseMonthlyEvents(itemLimit);
  }

  onMounted(() => foundation.init());
  onBeforeUnmount(() => foundation.destroy());

  return {
    foundation,
    refreshDay,
    refreshMonth,
    refreshRange,
    refreshWeek,
    state,
  };
}
