import type { ComponentOptionsMixin, DefineComponent } from 'vue';

import InputNumberBase from './InputNumber.vue';
import type { InputNumberEmits, InputNumberProps } from './types';

type InputNumberComponentEmits = {
  [EventName in keyof InputNumberEmits]: (...args: InputNumberEmits[EventName]) => void;
};
type EmptyComponentOptions = Record<never, never>;

export type InputNumberComponent = DefineComponent<
  InputNumberProps,
  EmptyComponentOptions,
  EmptyComponentOptions,
  EmptyComponentOptions,
  EmptyComponentOptions,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  InputNumberComponentEmits
>;

export const InputNumber = InputNumberBase as unknown as InputNumberComponent;

export type {
  InputNumberCurrencyDisplay,
  InputNumberEmits,
  InputNumberExposed,
  InputNumberProps,
  InputNumberSize,
  InputNumberSlots,
  InputNumberValue,
  ScientificNotationConfig,
} from './types';

export default InputNumber;
