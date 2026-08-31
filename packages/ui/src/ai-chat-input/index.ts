import type { DefineComponent } from 'vue';

import AIChatInputBase from './AIChatInput.vue';
import AIChatInputConfigureBase from './AIChatInputConfigure.vue';
import AIChatInputConfigureButtonBase from './AIChatInputConfigureButton.vue';
import AIChatInputConfigureMcpBase from './AIChatInputConfigureMcp.vue';
import AIChatInputConfigureRadioButtonBase from './AIChatInputConfigureRadioButton.vue';
import AIChatInputConfigureSelectBase from './AIChatInputConfigureSelect.vue';
import type { AIChatInputConfigureProps, AIChatInputExposed, AIChatInputProps } from './types';

export type AIChatInputConfigureComponent = DefineComponent<AIChatInputConfigureProps> & {
  Button: typeof AIChatInputConfigureButtonBase;
  Mcp: typeof AIChatInputConfigureMcpBase;
  RadioButton: typeof AIChatInputConfigureRadioButtonBase;
  Select: typeof AIChatInputConfigureSelectBase;
};

export const AIChatInputConfigure = Object.assign(AIChatInputConfigureBase, {
  Button: AIChatInputConfigureButtonBase,
  Mcp: AIChatInputConfigureMcpBase,
  RadioButton: AIChatInputConfigureRadioButtonBase,
  Select: AIChatInputConfigureSelectBase,
}) as unknown as AIChatInputConfigureComponent;

export type AIChatInputComponent = DefineComponent<AIChatInputProps, AIChatInputExposed> & {
  Configure: AIChatInputConfigureComponent;
  getCustomSlotAttribute(): Record<string, unknown>;
};

export const AIChatInput = Object.assign(AIChatInputBase, {
  Configure: AIChatInputConfigure,
  getCustomSlotAttribute: () => ({
    default: true,
    parseHTML: () => true,
    renderHTML: (attrs: { isCustomSlot?: boolean }) => ({
      'data-custom-slot': attrs.isCustomSlot ? true : undefined,
    }),
  }),
}) as unknown as AIChatInputComponent;

export {
  InputSlot,
  SelectSlot,
  SemiAIChatInputStatus,
  SkillSlot,
  aiChatInputExtensions,
} from './extensions';
export type {
  AIChatInputConfigureEmits,
  AIChatInputConfigureExposed,
  AIChatInputConfigureItemProps,
  AIChatInputConfigureProps,
  AIChatInputContent,
  AIChatInputEmits,
  AIChatInputExposed,
  AIChatInputLocale,
  AIChatInputProps,
  AIChatInputSetup,
  AIChatInputSlots,
  ActionAreaProps,
  Attachment,
  BaseSkill,
  LeftMenuChangeProps,
  MessageContent,
  PlaceholderProps,
  Reference,
  RenderSkillItemProps,
  RenderSuggestionItemProps,
  RenderTopSlotProps,
  RenderUploadButtonProps,
  RichTextJSON,
  Skill,
  Suggestion,
} from './types';

export default AIChatInput;
