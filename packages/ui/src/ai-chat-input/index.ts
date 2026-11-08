import type { Component, DefineComponent } from 'vue';

import AIChatInputBase from './AIChatInput.vue';
import AIChatInputConfigureBase from './AIChatInputConfigure.vue';
import AIChatInputConfigureItemBase from './AIChatInputConfigureItem.vue';
import AIChatInputConfigureButtonBase from './AIChatInputConfigureButton.vue';
import AIChatInputConfigureMcpBase from './AIChatInputConfigureMcp.vue';
import AIChatInputConfigureRadioButtonBase from './AIChatInputConfigureRadioButton.vue';
import AIChatInputConfigureSelectBase from './AIChatInputConfigureSelect.vue';
import { getConfigureItem as getConfigureItemBase } from './get-configure-item';
import type { AIChatInputConfigureItemProps, AIChatInputGetConfigureItemOptions } from './types';

/** 保留 AIChatInputConfigureComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type AIChatInputConfigureComponent = typeof AIChatInputConfigureBase & {
  Item: AIChatInputConfigureItemComponent;
  Button: typeof AIChatInputConfigureButtonBase;
  Mcp: typeof AIChatInputConfigureMcpBase;
  RadioButton: typeof AIChatInputConfigureRadioButtonBase;
  Select: typeof AIChatInputConfigureSelectBase;
};

export type AIChatInputConfigureItemComponent = DefineComponent<
  Pick<AIChatInputConfigureItemProps, 'field' | 'initValue'> & {
    onChange?: (value: unknown) => void;
  }
> & {
  new (): {
    $slots: {
      default?: (props: { value: unknown; onChange: (value: unknown) => void }) => unknown;
    };
  };
};
export const AIChatInputConfigureItem =
  AIChatInputConfigureItemBase as unknown as AIChatInputConfigureItemComponent;

export type AIChatInputGetConfigureItemFactory = (
  component: Component,
  options?: AIChatInputGetConfigureItemOptions,
) => AIChatInputConfigureItemComponent;

export const getConfigureItem =
  getConfigureItemBase as unknown as AIChatInputGetConfigureItemFactory;

export const AIChatInputConfigure = Object.assign(AIChatInputConfigureBase, {
  Item: AIChatInputConfigureItemBase,
  Button: AIChatInputConfigureButtonBase,
  Mcp: AIChatInputConfigureMcpBase,
  RadioButton: AIChatInputConfigureRadioButtonBase,
  Select: AIChatInputConfigureSelectBase,
}) as unknown as AIChatInputConfigureComponent;

/** 保留 AIChatInputComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type AIChatInputComponent = typeof AIChatInputBase & {
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
  AIChatInputGetConfigureItemOptions,
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
