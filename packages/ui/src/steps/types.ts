import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

export type StepsType = 'fill' | 'basic' | 'nav';
export type StepsDirection = 'horizontal' | 'vertical';
export type StepsStatus = 'wait' | 'process' | 'finish' | 'error' | 'warning';
export type StepsSize = 'default' | 'small';

export interface StepsProps {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  className?: string;
  current?: number;
  direction?: StepsDirection;
  hasLine?: boolean;
  initial?: number;
  prefixCls?: string;
  size?: StepsSize;
  status?: StepsStatus;
  style?: CSSProperties;
  type?: StepsType;
}

export interface StepsEmits {
  change: [current: number];
}

export interface StepsSlots {
  default?: () => VNodeChild;
}

export interface StepProps {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  className?: string;
  description?: VNodeChild;
  icon?: VNodeChild;
  role?: HTMLAttributes['role'];
  status?: StepsStatus;
  style?: CSSProperties;
  title?: VNodeChild;
}

export interface StepEmits {
  click: [event: MouseEvent];
  keyDown: [event: KeyboardEvent];
}

export interface StepSlots {
  description?: () => VNodeChild;
  icon?: () => VNodeChild;
  title?: () => VNodeChild;
}

export interface InternalStepProps extends StepProps {
  active?: boolean;
  done?: boolean;
  index?: number;
  onStepChange?: () => void;
  size?: StepsSize | '';
  stepNumber?: string;
  total?: number;
}
