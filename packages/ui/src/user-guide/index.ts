import type { DefineComponent } from 'vue';

import UserGuideComponent from './UserGuide.vue';
import type { UserGuideProps } from './types';

export const UserGuide = UserGuideComponent as unknown as DefineComponent<UserGuideProps>;

export { USER_GUIDE_MODES, USER_GUIDE_THEMES } from './types';
export type {
  UserGuideButtonProps,
  UserGuideEmits,
  UserGuideLocale,
  UserGuideMode,
  UserGuideProps,
  UserGuideSlotProps,
  UserGuideSlots,
  UserGuideStepItem,
  UserGuideTarget,
  UserGuideTheme,
} from './types';

export default UserGuide;
