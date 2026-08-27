import type { CSSProperties, VNodeChild } from 'vue';

export const CHECKBOX_DIRECTIONS = ['horizontal', 'vertical'] as const;
export const CHECKBOX_TYPES = ['default', 'card', 'pureCard'] as const;

export type CheckboxDirection = (typeof CHECKBOX_DIRECTIONS)[number];
export type CheckboxType = (typeof CHECKBOX_TYPES)[number];
export type CheckboxValue = unknown;

export interface CheckboxChangeTarget extends Record<string, unknown> {
  checked: boolean;
  value?: CheckboxValue;
}

export interface CheckboxChangeEvent {
  target: CheckboxChangeTarget;
  stopPropagation(): void;
  preventDefault(): void;
  nativeEvent: {
    stopImmediatePropagation(): void;
  };
}

export interface CheckboxProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  addonId?: string;
  autoFocus?: boolean;
  checked?: boolean | undefined;
  modelValue?: boolean | undefined;
  defaultChecked?: boolean;
  disabled?: boolean;
  extra?: VNodeChild;
  extraId?: string;
  id?: string;
  indeterminate?: boolean;
  prefixCls?: string;
  preventScroll?: boolean;
  role?: string;
  tabIndex?: number;
  type?: CheckboxType;
  value?: CheckboxValue;
  className?: string;
}

export interface CheckboxEmits {
  change: [event: CheckboxChangeEvent];
  'update:checked': [checked: boolean];
  'update:modelValue': [checked: boolean];
}

export interface CheckboxSlots {
  default?: () => VNodeChild;
  extra?: () => VNodeChild;
}

export interface CheckboxExposed {
  readonly input: HTMLInputElement | null;
  focus(): void;
  blur(): void;
}

export interface CheckboxOption {
  label?: VNodeChild;
  value: CheckboxValue;
  disabled?: boolean;
  extra?: VNodeChild;
  className?: string;
  style?: CSSProperties;
  onChange?: (event: CheckboxChangeEvent) => void;
}

export interface CheckboxGroupProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  defaultValue?: CheckboxValue[];
  direction?: CheckboxDirection;
  disabled?: boolean;
  id?: string;
  modelValue?: CheckboxValue[] | undefined;
  name?: string;
  options?: Array<string | CheckboxOption>;
  prefixCls?: string;
  type?: CheckboxType;
  value?: CheckboxValue[] | undefined;
}

export interface CheckboxGroupEmits {
  change: [value: CheckboxValue[]];
  'update:value': [value: CheckboxValue[]];
  'update:modelValue': [value: CheckboxValue[]];
}

export interface CheckboxGroupSlots {
  default?: () => VNodeChild;
}
