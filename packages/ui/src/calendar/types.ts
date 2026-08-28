import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const CALENDAR_MODES = ['day', 'week', 'month', 'range'] as const;
export type CalendarMode = (typeof CALENDAR_MODES)[number];
export type WeekStartsOn = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarEvent extends Record<string, unknown> {
  key: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  content?: VNodeChild;
}

export interface CalendarLocale {
  allDay: string;
  AM: string;
  PM: string;
  datestring: string;
  remaining: string;
  close: string;
}

export interface CalendarProps {
  className?: HTMLAttributes['class'];
  displayValue?: Date;
  events?: CalendarEvent[];
  header?: VNodeChild;
  height?: number | string;
  markWeekend?: boolean;
  minEventHeight?: number;
  mode?: CalendarMode;
  range?: Date[];
  scrollTop?: number;
  showCurrTime?: boolean;
  style?: StyleValue;
  weekStartsOn?: WeekStartsOn;
  width?: number | string;
}

export interface CalendarEmits {
  click: [event: MouseEvent, date: Date];
  close: [event: MouseEvent];
  moreClick: [event: MouseEvent, date: Date, remaining: number];
}

export interface CalendarDateSlotProps {
  date: Date;
  dateString: string;
}

export interface CalendarEventSlotProps {
  event: CalendarEvent;
}

export interface CalendarSlots {
  allDayEvents?: (props: { events: CalendarEvent[] }) => VNodeChild;
  dateDisplay?: (props: { date: Date }) => VNodeChild;
  dateGrid?: (props: CalendarDateSlotProps) => VNodeChild;
  event?: (props: CalendarEventSlotProps) => VNodeChild;
  header?: () => VNodeChild;
  timeDisplay?: (props: { time: number }) => VNodeChild;
}

export interface ResolvedCalendarProps extends Required<
  Pick<
    CalendarProps,
    | 'displayValue'
    | 'events'
    | 'height'
    | 'markWeekend'
    | 'minEventHeight'
    | 'mode'
    | 'range'
    | 'scrollTop'
    | 'showCurrTime'
    | 'weekStartsOn'
  >
> {
  className?: HTMLAttributes['class'] | undefined;
  header?: VNodeChild | undefined;
  style?: StyleValue | undefined;
  width?: number | string | undefined;
}
