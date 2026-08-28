import type { DefineComponent } from 'vue';

import AvatarBase from './Avatar.vue';
import AvatarGroupBase from './AvatarGroup';
import type { AvatarGroupProps, AvatarProps } from './types';

export type AvatarCompoundComponent = DefineComponent<AvatarProps> & {
  Group: DefineComponent<AvatarGroupProps>;
};

export const AvatarGroup = AvatarGroupBase as unknown as DefineComponent<AvatarGroupProps>;
export const Avatar = Object.assign(AvatarBase, {
  Group: AvatarGroup,
}) as unknown as AvatarCompoundComponent;

export { AVATAR_COLORS, AVATAR_SHAPES, AVATAR_SIZES } from './types';
export type {
  AvatarBorder,
  AvatarBottomSlot,
  AvatarColor,
  AvatarEmits,
  AvatarGroupOverlapFrom,
  AvatarGroupProps,
  AvatarGroupSlots,
  AvatarPresetSize,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarSlots,
  AvatarState,
  AvatarTopSlot,
} from './types';

export default Avatar;
