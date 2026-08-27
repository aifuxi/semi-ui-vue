import type { HTMLAttributes, StyleValue } from 'vue';

import type { InputSize } from '../input';

export type PinCodeFormat = 'number' | 'mixed' | RegExp | ((character: string) => boolean);

export interface PinCodeProps {
  autoFocus?: boolean;
  className?: HTMLAttributes['class'];
  count?: number;
  defaultValue?: string;
  disabled?: boolean;
  format?: PinCodeFormat;
  modelValue?: string | undefined;
  size?: InputSize;
  style?: StyleValue;
  value?: string | undefined;
}

export interface PinCodeEmits {
  change: [value: string];
  complete: [value: string];
  'update:modelValue': [value: string];
  'update:value': [value: string];
}

export interface PinCodeExposed {
  blur(index: number): void;
  focus(index: number): void;
}
