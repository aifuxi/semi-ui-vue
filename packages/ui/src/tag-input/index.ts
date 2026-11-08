import TagInputBase from './TagInput.vue';

/** 保留 TagInput 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const TagInput: typeof TagInputBase = TagInputBase;

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
export { TAG_INPUT_SIZES, TAG_INPUT_VALIDATE_STATUSES } from './types';

export default TagInput;
