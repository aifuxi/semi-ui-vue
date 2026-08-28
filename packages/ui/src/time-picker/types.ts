import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { InputSize, InputValidateStatus } from '../input';
import type { TooltipMargin, TooltipPosition } from '../tooltip';

export type TimePickerBaseValue = string | number | Date | undefined;
export type TimePickerValue = TimePickerBaseValue | TimePickerBaseValue[];
export type TimePickerType = 'time' | 'timeRange';
export type TimePickerPanelType = 'left' | 'right';
export type TimePickerChangeValue = Date | Date[] | undefined;
export type TimePickerFormattedValue = string | string[];

export interface TimePickerLocale {
  AM?: string;
  PM?: string;
  begin: string;
  end: string;
  hour: string;
  minute: string;
  placeholder: Record<TimePickerType, string>;
  second: string;
}

export interface TimePickerPanelConfig {
  panelFooter?: VNodeChild;
  panelHeader?: VNodeChild;
}

export interface TimePickerScrollItemProps {
  'aria-label'?: string;
  cycled?: boolean;
  mode?: 'normal' | 'wheel';
  motion?: boolean;
  style?: StyleValue;
}

export interface TimePickerDisabledOptions {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
}

export interface TimePickerProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  autoAdjustOverflow?: boolean;
  autoFocus?: boolean;
  borderless?: boolean;
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  clearText?: string;
  dateFnsLocale?: unknown;
  defaultOpen?: boolean;
  defaultValue?: TimePickerValue;
  disabled?: boolean;
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  disabledTime?: (value: Date[], panelType: TimePickerPanelType) => TimePickerDisabledOptions;
  dropdownMargin?: number | TooltipMargin;
  focusOnOpen?: boolean;
  format?: string;
  getPopupContainer?: () => HTMLElement;
  hideDisabledOptions?: boolean;
  hourStep?: number;
  id?: string;
  inputReadOnly?: boolean;
  inputStyle?: StyleValue;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  locale?: TimePickerLocale;
  localeCode?: string;
  minuteStep?: number;
  modelValue?: TimePickerValue;
  motion?: boolean;
  onChangeWithDateFirst?: boolean;
  open?: boolean;
  panelFooter?: VNodeChild | VNodeChild[];
  panelHeader?: VNodeChild | VNodeChild[];
  panels?: TimePickerPanelConfig[];
  placeholder?: string;
  popupClassName?: HTMLAttributes['class'];
  popupStyle?: StyleValue;
  position?: TooltipPosition;
  preventScroll?: boolean;
  rangeSeparator?: string;
  scrollItemProps?: TimePickerScrollItemProps;
  secondStep?: number;
  showClear?: boolean;
  size?: InputSize;
  stopPropagation?: boolean;
  style?: StyleValue;
  timeZone?: string | number;
  triggerRender?: (props: TimePickerTriggerSlotProps) => VNodeChild;
  type?: TimePickerType;
  use12Hours?: boolean;
  validateStatus?: InputValidateStatus;
  value?: TimePickerValue;
  zIndex?: number | string;
}

export interface TimePickerTriggerSlotProps {
  clear(): void;
  close(): void;
  inputValue: string;
  open: boolean;
  openPanel(): void;
  placeholder: string;
  value: Date[];
}

export interface TimePickerPanelSlotProps {
  index: number;
  panelType: TimePickerPanelType;
}

export interface TimePickerEmits {
  blur: [event: FocusEvent | MouseEvent];
  change: [
    value: TimePickerChangeValue | TimePickerFormattedValue,
    formatted: TimePickerFormattedValue | TimePickerChangeValue,
  ];
  focus: [event: FocusEvent];
  openChange: [open: boolean];
  'update:modelValue': [value: TimePickerChangeValue];
  'update:open': [open: boolean];
  'update:value': [value: TimePickerChangeValue];
}

export interface TimePickerSlots {
  clearIcon?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  panelFooter?: (props: TimePickerPanelSlotProps) => VNodeChild;
  panelHeader?: (props: TimePickerPanelSlotProps) => VNodeChild;
  trigger?: (props: TimePickerTriggerSlotProps) => VNodeChild;
}

export interface TimePickerExposed {
  blur(): void;
  close(): void;
  focus(): void;
  open(): void;
}

export interface TimePickerState {
  currentSelectPanel: string | number;
  inputValue: string;
  invalid: boolean;
  isAM: [boolean, boolean];
  open: boolean;
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  value: Date[];
}
