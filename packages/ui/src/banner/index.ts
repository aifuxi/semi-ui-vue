import type { DefineComponent } from 'vue';

import BannerComponent from './Banner.vue';
import type { BannerProps } from './types';

export const Banner = BannerComponent as unknown as DefineComponent<BannerProps>;

export { BANNER_TYPES } from './types';
export type { BannerEmits, BannerProps, BannerSlots, BannerType } from './types';

export default Banner;
