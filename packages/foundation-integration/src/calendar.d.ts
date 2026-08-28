import type { Locale } from 'date-fns';

export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface FoundationCalendarEvent extends Record<string, unknown> {
  key: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  children?: unknown;
}

export interface CalendarDateObject {
  ind: number;
  date: Date;
  dayString: string;
  weekday: string;
  isToday: boolean;
  isWeekend: boolean;
  isSameMonth: boolean;
  month: string;
}

export interface ParsedCalendarEvent extends FoundationCalendarEvent {
  date?: Date;
  startPos?: number;
  endPos?: number;
  left?: number | string;
  leftPos?: number;
  width?: number;
  topInd?: number;
}

export interface CalendarParsedEvents {
  day: Map<string, ParsedCalendarEvent[]> | ParsedCalendarEvent[];
  allDay: Map<string, ParsedCalendarEvent[]> | ParsedCalendarEvent[];
}

export interface MonthlyCalendarEvents {
  [week: number]: {
    day: ParsedCalendarEvent[][];
    display: ParsedCalendarEvent[];
  };
}

export type CalendarParsedEventsType = CalendarParsedEvents | MonthlyCalendarEvents;
export type CalendarMonthData = Record<number, CalendarDateObject[]>;

export interface CalendarAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: keyof Props): unknown;
  getProps(): Props;
  getState(key: keyof State): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
  updateCurrPos?(position: number): void;
  updateShowCurrTime?(): void;
  updateScrollHeight?(height: number): void;
  setParsedEvents?(events: CalendarParsedEventsType): void;
  cacheEventKeys?(keys: string[]): void;
  setRangeData?(data: { month: string; week: CalendarDateObject[] }): void;
  getRangeData?(): { month: string; week: CalendarDateObject[] };
  setWeeklyData?(data: { month: string; week: CalendarDateObject[] }): void;
  getWeeklyData?(): { month: string; week: CalendarDateObject[] };
  setMonthlyData?(data: CalendarMonthData): void;
  getMonthlyData?(): CalendarMonthData;
  setItemLimit?(limit: number): void;
}

export class CalendarFoundation<Props, State> {
  constructor(adapter: CalendarAdapter<Props, State>);
  init(): void;
  destroy(): void;
  formatCbValue(value: [Date] | [Date, number, number, number]): Date;
  getParseDailyEvents(
    events: FoundationCalendarEvent[],
    date: Date,
  ): {
    day: ParsedCalendarEvent[];
    allDay: ParsedCalendarEvent[];
  };
  getParsedWeeklyEvents(events: FoundationCalendarEvent[]): CalendarParsedEvents;
  getParsedRangeEvents(events: FoundationCalendarEvent[]): CalendarParsedEvents;
  getParseMonthlyEvents(limit: number): MonthlyCalendarEvents;
  getWeeklyData(value: Date, locale: Locale): { month: string; week: CalendarDateObject[] };
  getRangeData(value: Date, locale: Locale): { month: string; week: CalendarDateObject[] };
  getMonthlyData(value: Date, locale: Locale): CalendarMonthData;
  parseWeeklyAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
  parseRangeAllDayEvents(events: Map<string, ParsedCalendarEvent[]>): ParsedCalendarEvent[];
  checkWeekend(value: Date): boolean;
}

export function calcRowHeight(events: ParsedCalendarEvent[]): number;
export function checkWeekend(value: Date): boolean;
export function getCurrDate(): Date;
export function getPos(value: Date | number): number;
export function round(value: number): number;
export function calcWeekData(
  value: Date,
  monthStart: Date | null,
  mode: string,
  locale: Locale,
  weekStartsOn: WeekStartsOn,
): CalendarDateObject[];
export function calcRangeData(
  value: Date,
  start: Date,
  rangeLength: number,
  mode: string,
  locale: Locale,
  weekStartsOn: WeekStartsOn,
): CalendarDateObject[];
