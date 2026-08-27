import type { VNodeChild } from 'vue';

export const SWITCH_SIZES = ['large', 'default', 'small'] as const;

export type SwitchSize = (typeof SWITCH_SIZES)[number];

export interface SwitchProps {
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling' | undefined;
  ariaLabelledby?: string;
  checked?: boolean | undefined;
  modelValue?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  disabled?: boolean;
  loading?: boolean;
  size?: SwitchSize;
  checkedText?: VNodeChild;
  uncheckedText?: VNodeChild;
  id?: string;
}

export interface SwitchEmits {
  change: [checked: boolean, event: Event];
  'update:checked': [checked: boolean];
  'update:modelValue': [checked: boolean];
}

export interface SwitchSlots {
  checkedText?: () => VNodeChild;
  uncheckedText?: () => VNodeChild;
}
