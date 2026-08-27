import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export type SliderValue = number | number[];

export interface SliderHandleDot {
  color?: string;
  size?: string;
}

export type SliderMarks = Record<number, string>;

export interface SliderProps {
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaValueText?: string;
  className?: HTMLAttributes['class'];
  defaultValue?: SliderValue;
  disabled?: boolean;
  getAriaValueText?: (value: number, index?: number) => string;
  handleDot?: SliderHandleDot | [SliderHandleDot?, SliderHandleDot?];
  included?: boolean;
  marks?: SliderMarks;
  max?: number;
  min?: number;
  modelValue?: SliderValue | undefined;
  railStyle?: StyleValue;
  range?: boolean;
  showArrow?: boolean;
  showBoundary?: boolean;
  showMarkLabel?: boolean;
  step?: number;
  style?: StyleValue;
  tipFormatter?: ((value: string | number | boolean | null) => VNodeChild) | null;
  tooltipOnMark?: boolean;
  tooltipVisible?: boolean | undefined;
  value?: SliderValue | undefined;
  vertical?: boolean;
  verticalReverse?: boolean;
}

export interface SliderEmits {
  afterChange: [value: SliderValue];
  change: [value: SliderValue];
  mouseUp: [event: MouseEvent];
  'update:modelValue': [value: SliderValue];
  'update:value': [value: SliderValue];
}

export interface SliderState {
  currentValue: SliderValue;
  min: number;
  max: number;
  focusPos: 'min' | 'max' | '';
  onChange: ((value: SliderValue) => void) | undefined;
  disabled: boolean;
  chooseMovePos: 'min' | 'max' | '';
  isDrag: boolean;
  clickValue: 0;
  showBoundary: boolean;
  isInRenderTree: boolean;
  firstDotFocusVisible: boolean;
  secondDotFocusVisible: boolean;
}
