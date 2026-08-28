import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const BADGE_TYPES = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'success',
] as const;
export const BADGE_THEMES = ['solid', 'light', 'inverted'] as const;
export const BADGE_POSITIONS = ['leftTop', 'leftBottom', 'rightTop', 'rightBottom'] as const;

export type BadgeType = (typeof BADGE_TYPES)[number];
export type BadgeTheme = (typeof BADGE_THEMES)[number];
export type BadgePosition = (typeof BADGE_POSITIONS)[number];

export interface BadgeProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  count?: VNodeChild;
  countClassName?: HTMLAttributes['class'];
  countStyle?: StyleValue;
  dot?: boolean;
  overflowCount?: number;
  position?: BadgePosition;
  style?: StyleValue;
  theme?: BadgeTheme;
  type?: BadgeType;
}

export interface BadgeEmits {
  click: [event: MouseEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}

export interface BadgeSlots {
  default?: () => VNodeChild;
  count?: () => VNodeChild;
}
