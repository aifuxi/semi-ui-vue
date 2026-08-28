import type { DefineComponent } from 'vue';

import TimePickerBase from './TimePicker.vue';
import type { TimePickerProps } from './types';

export const TimePicker = TimePickerBase as unknown as DefineComponent<TimePickerProps>;

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
