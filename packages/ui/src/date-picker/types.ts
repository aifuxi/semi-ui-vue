import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { InputSize, InputValidateStatus } from '../input';
import type { PopoverMargin, PopoverPosition } from '../popover';
import type { TimePickerProps } from '../time-picker';

export type DatePickerBaseValue = string | number | Date;
export type DatePickerValue = DatePickerBaseValue | DatePickerBaseValue[];
export type DatePickerType =
  'date' | 'dateRange' | 'dateTime' | 'dateTimeRange' | 'month' | 'monthRange' | 'year';
export type DatePickerDensity = 'default' | 'compact';
export type DatePickerPresetPosition = 'left' | 'right' | 'top' | 'bottom';
export type DatePickerRangeType = 'rangeStart' | 'rangeEnd' | false;

export interface DatePickerDayStatus {
  isToday?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedStart?: boolean;
  isSelectedEnd?: boolean;
  isInRange?: boolean;
  isHover?: boolean;
  isOffsetRangeStart?: boolean;
  isOffsetRangeEnd?: boolean;
  isHoverInOffsetRange?: boolean;
}

export interface DatePickerDisabledDateOptions {
  rangeStart?: string;
  rangeEnd?: string;
  rangeInputFocus?: DatePickerRangeType;
}

export interface DatePickerDisabledTimeOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (hour: number) => number[];
  disabledSeconds?: (hour: number, minute: number) => number[];
}

export interface DatePickerPreset {
  start?: DatePickerBaseValue | (() => DatePickerBaseValue);
  end?: DatePickerBaseValue | (() => DatePickerBaseValue);
  text?: string;
}

export interface DatePickerInsetInputProps {
  placeholder?: {
    dateStart?: string;
    dateEnd?: string;
    timeStart?: string;
    timeEnd?: string;
  };
}

export interface DatePickerLocale {
  placeholder: Partial<Record<DatePickerType, string | string[]>>;
  presets: string;
  footer: { confirm: string; cancel: string };
  selectDate: string;
  selectTime: string;
  year: string;
  month: string;
  day: string;
  monthText: string;
  months: Record<number, string>;
  fullMonths: Record<number, string>;
  weeks: Record<string, string>;
  localeFormatToken: { FORMAT_SWITCH_DATE: string };
}

export interface DatePickerTriggerSlotProps {
  value: Date[];
  inputValue: string;
  placeholder: string | string[];
  autoFocus: boolean;
  size: InputSize;
  disabled: boolean;
  inputReadOnly: boolean;
  componentProps: DatePickerProps;
  open: boolean;
  openPanel(): void;
  close(): void;
  clear(event?: Event): void;
}

export interface DatePickerProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  autoAdjustOverflow?: boolean;
  autoFocus?: boolean;
  autoSwitchDate?: boolean;
  borderless?: boolean;
  bottomSlot?: VNodeChild;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  dateFnsLocale?: unknown;
  defaultOpen?: boolean;
  defaultPickerValue?: DatePickerValue;
  defaultValue?: DatePickerValue;
  density?: DatePickerDensity;
  disabled?: boolean;
  disabledDate?: (date?: Date, options?: DatePickerDisabledDateOptions) => boolean;
  disabledTime?: (
    date?: Date | Date[],
    panelType?: 'left' | 'right',
  ) => DatePickerDisabledTimeOptions;
  disabledTimePicker?: boolean;
  dropdownClassName?: HTMLAttributes['class'];
  dropdownMargin?: PopoverMargin;
  dropdownStyle?: StyleValue;
  endDateOffset?: (selectedDate?: Date) => Date;
  endYear?: number;
  format?: string;
  getPopupContainer?: () => HTMLElement;
  hideDisabledOptions?: boolean;
  id?: string;
  insetInput?: boolean | DatePickerInsetInputProps;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  inputReadOnly?: boolean;
  inputStyle?: StyleValue;
  leftSlot?: VNodeChild;
  locale?: DatePickerLocale;
  localeCode?: string;
  max?: number;
  modelValue?: DatePickerValue;
  motion?: boolean;
  multiple?: boolean;
  needConfirm?: boolean;
  onChangeWithDateFirst?: boolean;
  open?: boolean;
  placeholder?: string | string[];
  position?: PopoverPosition;
  prefix?: VNodeChild;
  presetPosition?: DatePickerPresetPosition;
  presets?: Array<DatePickerPreset | (() => DatePickerPreset)>;
  preventScroll?: boolean;
  rangeSeparator?: string;
  rangeSeparatorNode?: VNodeChild;
  renderDate?: (dayNumber?: number, fullDate?: string) => VNodeChild;
  renderFullDate?: (
    dayNumber?: number,
    fullDate?: string,
    status?: DatePickerDayStatus,
  ) => VNodeChild;
  rightSlot?: VNodeChild;
  showClear?: boolean;
  size?: InputSize;
  spacing?: number;
  startDateOffset?: (selectedDate?: Date) => Date;
  startYear?: number;
  stopPropagation?: boolean | string;
  style?: StyleValue;
  syncSwitchMonth?: boolean;
  timePickerOpts?: TimePickerProps;
  timeZone?: string | number;
  topSlot?: VNodeChild;
  triggerRender?: (props: DatePickerTriggerSlotProps) => VNodeChild;
  type?: DatePickerType;
  validateStatus?: InputValidateStatus;
  value?: DatePickerValue;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  yearAndMonthOpts?: Record<string, unknown>;
  zIndex?: number;
}

export interface DatePickerEmits {
  blur: [event?: unknown];
  cancel: [date: Date | Date[] | undefined, dateString: string | string[] | undefined];
  change: [
    first: Date | Date[] | string | string[] | undefined,
    second: Date | Date[] | string | string[] | undefined,
  ];
  clear: [event?: unknown];
  clickOutside: [event: MouseEvent];
  confirm: [date: Date | Date[] | undefined, dateString: string | string[] | undefined];
  focus: [event: unknown, rangeType?: DatePickerRangeType];
  maxSelect: [value?: Date[]];
  openChange: [open: boolean];
  panelChange: [date: Date | Date[], dateString: string | string[]];
  presetClick: [item: DatePickerPreset, event: MouseEvent];
  'update:modelValue': [value: Date | Date[] | undefined];
  'update:open': [open: boolean];
  'update:value': [value: Date | Date[] | undefined];
}

export interface DatePickerSlots {
  bottom?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  date?: (props: { dayNumber: number; fullDate: string }) => VNodeChild;
  fullDate?: (props: {
    dayNumber: number;
    fullDate: string;
    status: DatePickerDayStatus;
  }) => VNodeChild;
  insetLabel?: () => VNodeChild;
  left?: () => VNodeChild;
  prefix?: () => VNodeChild;
  rangeSeparator?: () => VNodeChild;
  right?: () => VNodeChild;
  top?: () => VNodeChild;
  trigger?: (props: DatePickerTriggerSlotProps) => VNodeChild;
}

export interface DatePickerExposed {
  readonly input: HTMLInputElement | null;
  blur(): void;
  close(): void;
  focus(focusType?: 'rangeStart' | 'rangeEnd'): void;
  open(): void;
}

export interface DatePickerRuntimeState {
  panelShow: boolean;
  inputValue: string | null;
  value: Date[];
  cachedSelectedValue: Array<Date | null>;
  rangeInputFocus: DatePickerRangeType | undefined;
  autofocus: boolean;
  triggerDisabled: boolean | undefined;
}
