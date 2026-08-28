import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export interface CollapsibleProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  collapseHeight?: number;
  collapseHeightAdaptive?: boolean;
  duration?: number;
  fade?: boolean;
  id?: string;
  isOpen?: boolean;
  keepDOM?: boolean;
  lazyRender?: boolean;
  motion?: boolean;
  reCalcKey?: number | string;
  style?: StyleValue;
}

export interface CollapsibleEmits {
  motionEnd: [];
}

export interface CollapsibleSlots {
  default?: () => VNodeChild;
}

export interface CollapsibleState {
  domHeight: number;
  domInRenderTree: boolean;
  isTransitioning: boolean;
  visible: boolean;
}
