import Select from './Select.vue';
import SelectOption from './SelectOption.vue';
import SelectOptionGroup from './SelectOptionGroup.vue';

/** 保留 SelectCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type SelectCompoundComponent = typeof Select & {
  Option: typeof SelectOption;
  OptGroup: typeof SelectOptionGroup;
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
