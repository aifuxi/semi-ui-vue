import CalendarComponent from './Calendar.vue';

/** 保留 Calendar 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Calendar: typeof CalendarComponent = CalendarComponent;

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
