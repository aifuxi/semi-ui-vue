import type { DefineComponent } from 'vue';

import CarouselBase from './Carousel.vue';
import type { CarouselProps } from './types';

export const Carousel = CarouselBase as unknown as DefineComponent<CarouselProps>;

export {
  CAROUSEL_ANIMATIONS,
  CAROUSEL_ARROW_TYPES,
  CAROUSEL_INDICATOR_POSITIONS,
  CAROUSEL_INDICATOR_SIZES,
  CAROUSEL_INDICATOR_TYPES,
  CAROUSEL_SLIDE_DIRECTIONS,
  CAROUSEL_THEMES,
  CAROUSEL_TRIGGERS,
} from './types';
export type {
  CarouselAnimation,
  CarouselArrowButton,
  CarouselArrowProps,
  CarouselArrowType,
  CarouselAutoPlayOptions,
  CarouselEmits,
  CarouselIndicatorPosition,
  CarouselIndicatorSize,
  CarouselIndicatorType,
  CarouselMethods,
  CarouselProps,
  CarouselSlideDirection,
  CarouselSlots,
  CarouselState,
  CarouselTheme,
  CarouselTrigger,
} from './types';

export default Carousel;
