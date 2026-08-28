import type { DefineComponent } from 'vue';

import CalendarComponent from './Calendar.vue';
import type { CalendarProps } from './types';

export const Calendar = CalendarComponent as unknown as DefineComponent<CalendarProps>;

export { CALENDAR_MODES } from './types';
export type {
  CalendarDateSlotProps,
  CalendarEmits,
  CalendarEvent,
  CalendarEventSlotProps,
  CalendarLocale,
  CalendarMode,
  CalendarProps,
  CalendarSlots,
  WeekStartsOn,
} from './types';

export default Calendar;
