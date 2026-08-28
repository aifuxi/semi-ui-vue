import type { Locale as DateFnsLocale } from 'date-fns';
import {
  inject,
  type ComputedRef,
  type InjectionKey,
  type ShallowReactive,
  type VNodeChild,
} from 'vue';
import type {
  CalendarDateObject,
  CalendarMonthData,
  CalendarParsedEvents,
  FoundationCalendarEvent,
  MonthlyCalendarEvents,
  ParsedCalendarEvent,
} from '@workspace/foundation-integration';

import type { CalendarEvent, CalendarLocale, CalendarSlots, ResolvedCalendarProps } from './types';

export interface CalendarRuntimeState {
  itemLimit: number;
  monthlyData: CalendarMonthData;
  parsedEvents: CalendarParsedEvents | MonthlyCalendarEvents;
  rangeData: { month: string; week: CalendarDateObject[] };
  weeklyData: { month: string; week: CalendarDateObject[] };
}

export interface CalendarFoundationRuntime {
  checkWeekend(value: Date): boolean;
  formatCbValue(value: [Date] | [Date, number, number, number]): Date;
  getParseDailyEvents(
    events: FoundationCalendarEvent[],
    date: Date,
  ): { day: ParsedCalendarEvent[]; allDay: ParsedCalendarEvent[] };
  parseRangeAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
  parseWeeklyAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
}

export interface CalendarRuntime {
  click(event: MouseEvent, date: Date): void;
  close(event: MouseEvent): void;
  dateFnsLocale: ComputedRef<DateFnsLocale>;
  direction: ComputedRef<'ltr' | 'rtl'>;
  eventContent(event: ParsedCalendarEvent | CalendarEvent): VNodeChild;
  foundation: CalendarFoundationRuntime;
  formatClickValue(value: [Date] | [Date, number, number, number]): Date;
  getPopupContainer: ComputedRef<(() => HTMLElement) | undefined>;
  locale: ComputedRef<CalendarLocale>;
  moreClick(event: MouseEvent, date: Date, remaining: number): void;
  props: ComputedRef<ResolvedCalendarProps>;
  refreshMonth(itemLimit: number): void;
  refreshRange(): void;
  refreshWeek(): void;
  slots: Readonly<CalendarSlots>;
  state: ShallowReactive<CalendarRuntimeState>;
}

export const calendarContextKey: InjectionKey<CalendarRuntime> = Symbol('semi-calendar-context');

export function useCalendarRuntime(): CalendarRuntime {
  const runtime = inject(calendarContextKey);
  if (!runtime) throw new Error('please make sure Calendar internal components inside Calendar');
  return runtime;
}
