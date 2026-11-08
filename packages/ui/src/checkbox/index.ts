import CheckboxBase from './Checkbox.vue';
import CheckboxGroupBase from './CheckboxGroup';

/** 保留 CheckboxCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type CheckboxCompoundComponent = typeof CheckboxBase & {
  Group: typeof CheckboxGroupBase;
};

/** 保留 CheckboxGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const CheckboxGroup: typeof CheckboxGroupBase = CheckboxGroupBase;
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
