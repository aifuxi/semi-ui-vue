import BadgeComponent from './Badge.vue';

/** 保留 Badge 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Badge: typeof BadgeComponent = BadgeComponent;

export { BADGE_POSITIONS, BADGE_THEMES, BADGE_TYPES } from './types';
export type {
  BadgeEmits,
  BadgePosition,
  BadgeProps,
  BadgeSlots,
  BadgeTheme,
  BadgeType,
} from './types';

export default Badge;
