import type { ComputedRef, InjectionKey } from 'vue';

import type { CheckboxChangeEvent, CheckboxValue } from './types';

export interface CheckboxGroupContext {
  value: ComputedRef<CheckboxValue[]>;
  disabled: ComputedRef<boolean>;
  name: ComputedRef<string>;
  isCardType: ComputedRef<boolean>;
  isPureCardType: ComputedRef<boolean>;
  onChange(event: CheckboxChangeEvent): void;
}

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('semi-checkbox-group');
