import UserGuideComponent from './UserGuide.vue';

/** 保留 UserGuide 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const UserGuide: typeof UserGuideComponent = UserGuideComponent;

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
