import type { DefineComponent } from 'vue';

import TagInputBase from './TagInput.vue';
import type { TagInputProps } from './types';

export const TagInput = TagInputBase as unknown as DefineComponent<TagInputProps>;

export type {
  TagInputEmits,
  TagInputExposed,
  TagInputProps,
  TagInputRestPopoverProps,
  TagInputSeparator,
  TagInputSize,
  TagInputSlots,
  TagInputState,
  TagInputTooltipOptions,
  TagInputValidateStatus,
} from './types';

export default TagInput;
