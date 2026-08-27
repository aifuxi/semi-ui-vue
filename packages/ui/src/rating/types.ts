import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const RATING_SIZES = ['small', 'default'] as const;
export type RatingPresetSize = (typeof RATING_SIZES)[number];
export type RatingSize = RatingPresetSize | number;

export interface RatingProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean;
  allowClear?: boolean;
  allowHalf?: boolean;
  autoFocus?: boolean;
  character?: VNodeChild;
  className?: HTMLAttributes['class'];
  count?: number;
  defaultValue?: number;
  disabled?: boolean;
  id?: string;
  modelValue?: number | undefined;
  prefixCls?: string;
  preventScroll?: boolean;
  size?: RatingSize;
  style?: StyleValue;
  tabIndex?: number;
  tooltips?: string[];
  value?: number | undefined;
}

export interface RatingEmits {
  blur: [event: FocusEvent];
  change: [value: number];
  click: [event: MouseEvent | KeyboardEvent, index: number];
  focus: [event: FocusEvent];
  hoverChange: [value: number | undefined];
  keyDown: [event: KeyboardEvent];
  'update:modelValue': [value: number];
  'update:value': [value: number];
}

export interface RatingSlots {
  character?: () => VNodeChild;
}

export interface RatingExposed {
  focus(): void;
  blur(): void;
}

export interface RatingState {
  value: number;
  hoverValue: number | undefined;
  focused: boolean;
  clearedValue: number | null;
  emptyStarFocusVisible: boolean;
}

export interface RatingItemState {
  firstStarFocus: boolean;
  secondStarFocus: boolean;
}
