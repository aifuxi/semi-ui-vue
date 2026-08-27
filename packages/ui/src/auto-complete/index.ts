import type { DefineComponent } from 'vue';

import AutoComplete from './AutoComplete.vue';
import AutoCompleteOption from './AutoCompleteOption.vue';
import type { AutoCompleteOptionProps, AutoCompleteProps } from './types';

export type AutoCompleteCompoundComponent = DefineComponent<AutoCompleteProps> & {
  Option: DefineComponent<AutoCompleteOptionProps>;
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
