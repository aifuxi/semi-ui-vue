import type { DefineComponent } from 'vue';

import RatingBase from './Rating.vue';
import type { RatingProps } from './types';

export const Rating = RatingBase as unknown as DefineComponent<RatingProps>;

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
