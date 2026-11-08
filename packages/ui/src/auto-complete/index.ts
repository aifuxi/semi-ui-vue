import AutoComplete from './AutoComplete.vue';
import AutoCompleteOption from './AutoCompleteOption.vue';

/** 保留 AutoCompleteCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type AutoCompleteCompoundComponent = typeof AutoComplete & {
  Option: typeof AutoCompleteOption;
};

const AutoCompleteWithOption = Object.assign(AutoComplete, {
  Option: AutoCompleteOption,
}) as unknown as AutoCompleteCompoundComponent;

export { AutoCompleteWithOption as AutoComplete, AutoCompleteOption };
export type {
  AutoCompleteDataItem,
  AutoCompleteEmits,
  AutoCompleteExposed,
  AutoCompleteItem,
  AutoCompleteModelValue,
  AutoCompleteOptionProps,
  AutoCompleteOptionRuntime,
  AutoCompleteOptionSlotProps,
  AutoCompletePrimitive,
  AutoCompleteProps,
  AutoCompleteSize,
  AutoCompleteSlots,
  AutoCompleteTriggerSlotProps,
  AutoCompleteValidateStatus,
} from './types';
export default AutoCompleteWithOption;
