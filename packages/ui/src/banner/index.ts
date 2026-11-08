import BannerComponent from './Banner.vue';

/** 保留 Banner 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Banner: typeof BannerComponent = BannerComponent;

export { BANNER_TYPES } from './types';
export type { BannerEmits, BannerProps, BannerSlots, BannerType } from './types';

export default Banner;
