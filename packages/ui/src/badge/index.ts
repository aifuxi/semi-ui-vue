import type { DefineComponent } from 'vue';

import BadgeComponent from './Badge.vue';
import type { BadgeProps } from './types';

export const Badge = BadgeComponent as unknown as DefineComponent<BadgeProps>;

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
