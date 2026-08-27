import type { DefineComponent } from 'vue';

import CheckboxBase from './Checkbox.vue';
import CheckboxGroupBase from './CheckboxGroup';
import type { CheckboxGroupProps, CheckboxProps } from './types';

export type CheckboxCompoundComponent = DefineComponent<CheckboxProps> & {
  Group: DefineComponent<CheckboxGroupProps>;
};

export const CheckboxGroup = CheckboxGroupBase as unknown as DefineComponent<CheckboxGroupProps>;
export const Checkbox = Object.assign(CheckboxBase, {
  Group: CheckboxGroup,
}) as unknown as CheckboxCompoundComponent;

export { CHECKBOX_DIRECTIONS, CHECKBOX_TYPES } from './types';
export type {
  CheckboxChangeEvent,
  CheckboxChangeTarget,
  CheckboxDirection,
  CheckboxEmits,
  CheckboxExposed,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxGroupSlots,
  CheckboxOption,
  CheckboxProps,
  CheckboxSlots,
  CheckboxType,
  CheckboxValue,
} from './types';

export default Checkbox;
