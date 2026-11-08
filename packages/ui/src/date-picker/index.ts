import DatePickerBase from './DatePicker.vue';

/** 保留 DatePicker 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const DatePicker: typeof DatePickerBase = DatePickerBase;

export type {
  DatePickerBaseValue,
  DatePickerDayStatus,
  DatePickerDensity,
  DatePickerDisabledDateOptions,
  DatePickerDisabledTimeOptions,
  DatePickerEmits,
  DatePickerExposed,
  DatePickerInsetInputProps,
  DatePickerLocale,
  DatePickerPreset,
  DatePickerPresetPosition,
  DatePickerProps,
  DatePickerRangeType,
  DatePickerSlots,
  DatePickerTriggerSlotProps,
  DatePickerType,
  DatePickerValue,
} from './types';

export default DatePicker;
