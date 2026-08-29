import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const SPIN_SIZES = ['small', 'middle', 'large'] as const;

export type SpinSize = (typeof SPIN_SIZES)[number];

export interface SpinProps {
  childStyle?: StyleValue;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  delay?: number;
  indicator?: VNodeChild;
  size?: SpinSize;
  spinning?: boolean;
  style?: StyleValue;
  tip?: VNodeChild;
  wrapperClassName?: string;
}

export interface SpinSlots {
  default?: () => VNodeChild;
  indicator?: () => VNodeChild;
  tip?: () => VNodeChild;
}
