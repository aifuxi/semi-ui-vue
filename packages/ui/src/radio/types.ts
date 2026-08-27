import type { CSSProperties, VNodeChild } from 'vue';

export const RADIO_DIRECTIONS = ['horizontal', 'vertical'] as const;
export const RADIO_MODES = ['', 'advanced'] as const;
export const RADIO_TYPES = ['default', 'button', 'card', 'pureCard'] as const;
export const RADIO_BUTTON_SIZES = ['small', 'middle', 'large'] as const;

export type RadioDirection = (typeof RADIO_DIRECTIONS)[number];
export type RadioMode = (typeof RADIO_MODES)[number];
export type RadioType = (typeof RADIO_TYPES)[number];
export type RadioButtonSize = (typeof RADIO_BUTTON_SIZES)[number];
export type RadioDisplayMode = '' | 'vertical';
export type RadioValue = string | number | boolean;

export interface RadioChangeTarget extends Record<string, unknown> {
  checked: boolean;
  value?: RadioValue;
}

export interface RadioChangeEvent {
  target: RadioChangeTarget;
  stopPropagation(): void;
  preventDefault(): void;
}

export interface RadioProps {
  addonClassName?: string;
  addonId?: string;
  addonStyle?: CSSProperties;
  ariaLabel?: string;
  autoFocus?: boolean;
  checked?: boolean | undefined;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  displayMode?: RadioDisplayMode;
  extra?: VNodeChild;
  extraId?: string;
  mode?: RadioMode;
  modelValue?: boolean | undefined;
  name?: string;
  prefixCls?: string;
  preventScroll?: boolean;
  style?: CSSProperties;
  type?: RadioType;
  value?: RadioValue;
}

export interface RadioEmits {
  change: [event: RadioChangeEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
  'update:checked': [checked: boolean];
  'update:modelValue': [checked: boolean];
}

export interface RadioSlots {
  default?: () => VNodeChild;
  extra?: () => VNodeChild;
}

export interface RadioExposed {
  readonly input: HTMLInputElement | null;
  focus(): void;
  blur(): void;
}

export interface RadioOption {
  label?: VNodeChild;
  value?: RadioValue;
  disabled?: boolean;
  extra?: VNodeChild;
  style?: CSSProperties;
  className?: string;
  addonId?: string;
  addonStyle?: CSSProperties;
  addonClassName?: string;
  extraId?: string;
}

export interface RadioGroupProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  buttonSize?: RadioButtonSize;
  className?: string;
  defaultValue?: RadioValue;
  direction?: RadioDirection;
  disabled?: boolean;
  id?: string;
  mode?: RadioMode;
  modelValue?: RadioValue | undefined;
  name?: string;
  options?: Array<string | RadioOption>;
  prefixCls?: string;
  style?: CSSProperties;
  type?: RadioType;
  value?: RadioValue | undefined;
}

export interface RadioGroupEmits {
  change: [event: RadioChangeEvent];
  'update:value': [value: RadioValue | undefined];
  'update:modelValue': [value: RadioValue | undefined];
}

export interface RadioGroupSlots {
  default?: () => VNodeChild;
}
