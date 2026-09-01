import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export const VALIDATE_STATUSES = ['default', 'error', 'warning', 'success'] as const;

export type ValidateStatus = ArrayElement<typeof VALIDATE_STATUSES>;

export type Motion<Props extends Record<string, unknown> = Record<string, unknown>> =
  boolean | MotionObject | MotionFunction<Props>;

export type MotionFunction<Props> = (props: Props) => MotionObject;

export interface MotionObject {
  [key: string]: unknown;
  children?: VNodeChild | ((props: MotionChildrenProps) => VNodeChild);
  willEnter?: () => void;
  didEnter?: () => void;
  willLeave?: () => void;
  didLeave?: () => void;
  onStart?: () => void;
  onRest?: () => void;
  state?: string;
}

export interface MotionChildrenProps {
  animateCls?: string;
  animateStyle?: {
    animationTimingFunction?: string;
    animationName?: string;
    animationDuration?: number | string;
    animationDelay?: number | string;
    animationIterationCount?: number | string;
    animationDirection?: 'alternate' | 'normal';
    animationFillMode?: string;
  };
  animateEvents?: {
    onAnimationIteration?: (event: AnimationEvent) => void;
    onAnimationStart?: (event: AnimationEvent) => void;
    onAnimationEnd?: (event: AnimationEvent) => void;
  };
}

export interface BaseProps {
  class?: HTMLAttributes['class'];
  style?: StyleValue;
}
