import TimePickerBase from './TimePicker.vue';

/** 保留 TimePicker 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TimePicker: typeof TimePickerBase = TimePickerBase;

export type {
  TimePickerBaseValue,
  TimePickerChangeValue,
  TimePickerDisabledOptions,
  TimePickerEmits,
  TimePickerExposed,
  TimePickerFormattedValue,
  TimePickerLocale,
  TimePickerPanelConfig,
  TimePickerPanelSlotProps,
  TimePickerPanelType,
  TimePickerProps,
  TimePickerScrollItemProps,
  TimePickerSlots,
  TimePickerState,
  TimePickerTriggerSlotProps,
  TimePickerType,
  TimePickerValue,
} from './types';

export default TimePicker;
