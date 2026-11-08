import RatingBase from './Rating.vue';

/** 保留 Rating 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Rating: typeof RatingBase = RatingBase;

export { RATING_SIZES } from './types';
export type {
  RatingEmits,
  RatingExposed,
  RatingPresetSize,
  RatingProps,
  RatingSize,
  RatingSlots,
} from './types';

export default Rating;
