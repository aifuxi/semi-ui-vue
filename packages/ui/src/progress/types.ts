import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const PROGRESS_DIRECTIONS = ['horizontal', 'vertical'] as const;
export const PROGRESS_SIZES = ['default', 'small', 'large'] as const;
export const PROGRESS_STROKE_LINECAPS = ['round', 'square'] as const;
export const PROGRESS_TYPES = ['line', 'circle'] as const;

export type ProgressDirection = (typeof PROGRESS_DIRECTIONS)[number];
export type ProgressSize = (typeof PROGRESS_SIZES)[number];
export type ProgressStrokeLinecap = (typeof PROGRESS_STROKE_LINECAPS)[number];
export type ProgressType = (typeof PROGRESS_TYPES)[number];

export interface ProgressStrokePoint {
  percent: number;
  color: string;
}

export interface ProgressMotionObject {
  [key: string]: unknown;
}

export type ProgressMotion =
  boolean | ProgressMotionObject | ((props: Record<string, unknown>) => ProgressMotionObject);

export interface ProgressProps {
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaValuetext?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  direction?: ProgressDirection;
  format?: (percent: number) => VNodeChild;
  id?: string;
  motion?: ProgressMotion;
  orbitStroke?: string;
  percent?: number;
  showInfo?: boolean;
  size?: ProgressSize;
  stroke?: string | ProgressStrokePoint[];
  strokeGradient?: boolean;
  strokeLinecap?: ProgressStrokeLinecap;
  strokeWidth?: number;
  style?: StyleValue;
  type?: ProgressType;
  width?: number;
}

export interface ProgressSlots {
  format?: (props: { percent: number }) => VNodeChild;
}
