import AvatarBase from './Avatar.vue';
import AvatarGroupBase from './AvatarGroup';

/** 保留 AvatarCompoundComponent 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export type AvatarCompoundComponent = typeof AvatarBase & {
  Group: typeof AvatarGroupBase;
};

/** 保留 AvatarGroup 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const AvatarGroup: typeof AvatarGroupBase = AvatarGroupBase;
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
