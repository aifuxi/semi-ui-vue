import type { CSSProperties, VNodeChild } from 'vue';

export type BackTopTarget = Window | HTMLElement;

export interface BackTopProps {
  className?: string;
  duration?: number;
  style?: CSSProperties;
  target?: () => BackTopTarget | null | undefined;
  visibilityHeight?: number;
}

export interface BackTopEmits {
  click: [event: MouseEvent];
}

export interface BackTopSlots {
  default?: () => VNodeChild;
}
