import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const BANNER_TYPES = ['info', 'success', 'danger', 'warning'] as const;

export type BannerType = (typeof BANNER_TYPES)[number];

export interface BannerProps {
  bordered?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  closeIcon?: VNodeChild;
  description?: VNodeChild;
  fullMode?: boolean;
  icon?: VNodeChild;
  style?: StyleValue;
  title?: VNodeChild;
  type?: BannerType;
}

export interface BannerEmits {
  close: [event: MouseEvent];
}

export interface BannerSlots {
  closeIcon?: () => VNodeChild;
  default?: () => VNodeChild;
  description?: () => VNodeChild;
  icon?: () => VNodeChild;
  title?: () => VNodeChild;
}
