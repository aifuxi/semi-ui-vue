import type { ComputedRef, InjectionKey } from 'vue';

import type { RadioButtonSize, RadioChangeEvent, RadioMode, RadioValue } from './types';

export interface RadioGroupContext {
  value: ComputedRef<RadioValue | undefined>;
  disabled: ComputedRef<boolean>;
  mode: ComputedRef<RadioMode>;
  name: ComputedRef<string>;
  isButtonRadio: ComputedRef<boolean>;
  isCardRadio: ComputedRef<boolean>;
  isPureCardRadio: ComputedRef<boolean>;
  buttonSize: ComputedRef<RadioButtonSize>;
  prefixCls: ComputedRef<string | undefined>;
  onChange(event: RadioChangeEvent): void;
}

export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('semi-radio-group');
