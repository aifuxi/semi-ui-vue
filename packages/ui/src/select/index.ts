import type { DefineComponent } from 'vue';

import Select from './Select.vue';
import SelectOption from './SelectOption.vue';
import SelectOptionGroup from './SelectOptionGroup.vue';
import type { SelectOptionGroupProps, SelectOptionProps, SelectProps } from './types';

export type SelectCompoundComponent = DefineComponent<SelectProps> & {
  Option: DefineComponent<SelectOptionProps>;
  OptGroup: DefineComponent<SelectOptionGroupProps>;
};

const SelectWithChildren = Object.assign(Select, {
  Option: SelectOption,
  OptGroup: SelectOptionGroup,
}) as unknown as SelectCompoundComponent;

export { SelectWithChildren as Select, SelectOption, SelectOptionGroup };
export type {
  SelectEmits,
  SelectExposed,
  SelectInputProps,
  SelectModelValue,
  SelectOptionGroupProps,
  SelectOptionProps,
  SelectOptionRenderProps,
  SelectPrimitive,
  SelectProps,
  SelectSearchPosition,
  SelectSize,
  SelectSlots,
  SelectTriggerSlotProps,
  SelectValidateStatus,
  SelectValue,
  SelectVirtualizeProps,
} from './types';

export default SelectWithChildren;
