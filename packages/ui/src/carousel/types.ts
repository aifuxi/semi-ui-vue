import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const CAROUSEL_ANIMATIONS = ['slide', 'fade'] as const;
export const CAROUSEL_ARROW_TYPES = ['always', 'hover'] as const;
export const CAROUSEL_INDICATOR_POSITIONS = ['left', 'center', 'right'] as const;
export const CAROUSEL_INDICATOR_SIZES = ['small', 'medium'] as const;
export const CAROUSEL_INDICATOR_TYPES = ['columnar', 'line', 'dot'] as const;
export const CAROUSEL_SLIDE_DIRECTIONS = ['left', 'right'] as const;
export const CAROUSEL_THEMES = ['dark', 'primary', 'light'] as const;
export const CAROUSEL_TRIGGERS = ['click', 'hover'] as const;

export type CarouselAnimation = (typeof CAROUSEL_ANIMATIONS)[number];
export type CarouselArrowType = (typeof CAROUSEL_ARROW_TYPES)[number];
export type CarouselIndicatorPosition = (typeof CAROUSEL_INDICATOR_POSITIONS)[number];
export type CarouselIndicatorSize = (typeof CAROUSEL_INDICATOR_SIZES)[number];
export type CarouselIndicatorType = (typeof CAROUSEL_INDICATOR_TYPES)[number];
export type CarouselSlideDirection = (typeof CAROUSEL_SLIDE_DIRECTIONS)[number];
export type CarouselTheme = (typeof CAROUSEL_THEMES)[number];
export type CarouselTrigger = (typeof CAROUSEL_TRIGGERS)[number];

export interface CarouselAutoPlayOptions {
  hoverToPause?: boolean;
  interval?: number;
}

export interface CarouselArrowButton {
  children?: VNodeChild;
  props?: HTMLAttributes & Record<string, unknown>;
}

export interface CarouselArrowProps {
  leftArrow?: CarouselArrowButton;
  rightArrow?: CarouselArrowButton;
}

export interface CarouselProps {
  activeIndex?: number | undefined;
  animation?: CarouselAnimation;
  arrowProps?: CarouselArrowProps | undefined;
  autoPlay?: boolean | CarouselAutoPlayOptions;
  arrowType?: CarouselArrowType;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  defaultActiveIndex?: number;
  indicatorPosition?: CarouselIndicatorPosition;
  indicatorSize?: CarouselIndicatorSize;
  indicatorType?: CarouselIndicatorType;
  showArrow?: boolean;
  showIndicator?: boolean;
  slideDirection?: CarouselSlideDirection;
  speed?: number;
  style?: StyleValue;
  theme?: CarouselTheme;
  trigger?: CarouselTrigger;
}

export interface CarouselEmits {
  change: [activeIndex: number, preIndex: number];
}

export interface CarouselSlots {
  default?: () => VNodeChild;
  leftArrow?: () => VNodeChild;
  rightArrow?: () => VNodeChild;
}

export interface CarouselMethods {
  goTo(targetIndex: number): void;
  next(): void;
  play(): void;
  prev(): void;
  stop(): void;
}

export interface CarouselState {
  activeIndex: number;
  isInit: boolean;
  isReverse: boolean;
  preIndex: number;
}
