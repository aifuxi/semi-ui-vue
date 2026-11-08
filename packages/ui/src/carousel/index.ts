import CarouselBase from './Carousel.vue';

/** 保留 Carousel 的原始组件类型，使事件、插槽与实例方法随公开导出同步。 */
export const Carousel: typeof CarouselBase = CarouselBase;

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
