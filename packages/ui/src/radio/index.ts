import type { DefineComponent } from 'vue';

import RadioBase from './Radio.vue';
import RadioGroupBase from './RadioGroup';
import type { RadioGroupProps, RadioProps } from './types';

export type RadioCompoundComponent = DefineComponent<RadioProps> & {
  Group: DefineComponent<RadioGroupProps>;
};

export const RadioGroup = RadioGroupBase as unknown as DefineComponent<RadioGroupProps>;
export const Radio = Object.assign(RadioBase, {
  Group: RadioGroup,
}) as unknown as RadioCompoundComponent;

export { RADIO_BUTTON_SIZES, RADIO_DIRECTIONS, RADIO_MODES, RADIO_TYPES } from './types';
export type {
  RadioButtonSize,
  RadioChangeEvent,
  RadioChangeTarget,
  RadioDirection,
  RadioDisplayMode,
  RadioEmits,
  RadioExposed,
  RadioGroupEmits,
  RadioGroupProps,
  RadioGroupSlots,
  RadioMode,
  RadioOption,
  RadioProps,
  RadioSlots,
  RadioType,
  RadioValue,
} from './types';

export default Radio;
