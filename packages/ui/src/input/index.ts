import InputBase from './Input.vue';
import InputGroupBase from './InputGroup';
import TextAreaBase from './TextArea.vue';

/** 保留 InputCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type InputCompoundComponent = typeof InputBase & {
  Group: typeof InputGroupBase;
  TextArea: typeof TextAreaBase;
};

/** 保留 InputGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const InputGroup: typeof InputGroupBase = InputGroupBase;
/** 保留 TextArea 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TextArea: typeof TextAreaBase = TextAreaBase;
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
