import type { HTMLAttributes, VNodeChild } from 'vue';

import type { InputExposed, InputProps, InputSize, InputValue } from '../input';

export type InputNumberValue = InputValue;
export type InputNumberSize = InputSize;
export type InputNumberCurrencyDisplay = 'code' | 'symbol' | 'name';

export interface ScientificNotationConfig {
  threshold?: number;
}

export interface InputNumberProps extends Omit<
  InputProps,
  'className' | 'defaultValue' | 'modelValue' | 'suffix' | 'value'
> {
  autofocus?: boolean;
  className?: HTMLAttributes['class'];
  currency?: string | boolean;
  currencyDisplay?: InputNumberCurrencyDisplay;
  defaultCurrency?: string;
  defaultValue?: InputNumberValue;
  formatter?: (value: InputNumberValue) => string;
  hideButtons?: boolean;
  innerButtons?: boolean;
  keepFocus?: boolean;
  localeCode?: string;
  max?: number;
  maximumFractionDigits?: number;
  min?: number;
  minimumFractionDigits?: number;
  modelValue?: InputNumberValue | undefined;
  parser?: (value: string) => string | number;
  precision?: number;
  pressInterval?: number;
  pressTimeout?: number;
  scientificNotation?: boolean | ScientificNotationConfig;
  shiftStep?: number;
  showCurrencySymbol?: boolean;
  step?: number;
  suffix?: VNodeChild;
  value?: InputNumberValue | undefined;
}

export interface InputNumberEmits {
  blur: [event: FocusEvent];
  change: [value: InputNumberValue, event?: Event | null];
  downClick: [value: string, event: MouseEvent];
  focus: [event: FocusEvent];
  keydown: [event: KeyboardEvent];
  numberChange: [value: number, event?: Event | null];
  upClick: [value: string, event: MouseEvent];
  'update:modelValue': [value: InputNumberValue];
  'update:value': [value: InputNumberValue];
}

export interface InputNumberSlots {
  addonAfter?: () => VNodeChild;
  addonBefore?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  insetLabel?: () => VNodeChild;
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
}

export type InputNumberExposed = InputExposed;
