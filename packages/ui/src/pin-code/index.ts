import type { ComponentOptionsMixin, DefineComponent } from 'vue';

import PinCodeBase from './PinCode.vue';
import type { PinCodeEmits, PinCodeProps } from './types';

type PinCodeComponentEmits = {
  [EventName in keyof PinCodeEmits]: (...args: PinCodeEmits[EventName]) => void;
};
type EmptyComponentOptions = Record<never, never>;

export type PinCodeComponent = DefineComponent<
  PinCodeProps,
  EmptyComponentOptions,
  EmptyComponentOptions,
  EmptyComponentOptions,
  EmptyComponentOptions,
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  PinCodeComponentEmits
>;

export const PinCode = PinCodeBase as unknown as PinCodeComponent;

export type { PinCodeEmits, PinCodeExposed, PinCodeFormat, PinCodeProps } from './types';

export default PinCode;
