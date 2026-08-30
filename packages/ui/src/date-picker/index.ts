import type { DefineComponent } from 'vue';

import DatePickerBase from './DatePicker.vue';
import type { DatePickerExposed, DatePickerProps } from './types';

export const DatePicker = DatePickerBase as unknown as DefineComponent<DatePickerProps> &
  DatePickerExposed;

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
