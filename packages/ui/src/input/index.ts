import type { DefineComponent } from 'vue';

import InputBase from './Input.vue';
import InputGroupBase from './InputGroup';
import TextAreaBase from './TextArea.vue';
import type { InputGroupProps, InputProps, TextAreaProps } from './types';

export type InputCompoundComponent = DefineComponent<InputProps> & {
  Group: DefineComponent<InputGroupProps>;
  TextArea: DefineComponent<TextAreaProps>;
};

export const InputGroup = InputGroupBase as unknown as DefineComponent<InputGroupProps>;
export const TextArea = TextAreaBase as unknown as DefineComponent<TextAreaProps>;
export const Input = Object.assign(InputBase, {
  Group: InputGroup,
  TextArea,
}) as unknown as InputCompoundComponent;

export type {
  AutosizeRows,
  InputEmits,
  InputExposed,
  InputGroupEmits,
  InputGroupLabelProps,
  InputGroupProps,
  InputGroupSlots,
  InputMode,
  InputProps,
  InputSize,
  InputSlots,
  InputValidateStatus,
  InputValue,
  TextAreaEmits,
  TextAreaExposed,
  TextAreaProps,
  TextAreaResize,
  TextAreaResizeData,
} from './types';

export default Input;
