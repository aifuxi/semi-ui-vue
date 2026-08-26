import type { CSSProperties, VNodeChild } from 'vue';

export const FLOAT_BUTTON_SHAPES = ['square', 'round'] as const;
export const FLOAT_BUTTON_SIZES = ['small', 'default', 'large'] as const;
export const FLOAT_BUTTON_BADGE_TYPES = [
  'primary',
  'secondary',
  'tertiary',
  'danger',
  'warning',
  'success',
] as const;
export const FLOAT_BUTTON_BADGE_THEMES = ['solid', 'light', 'inverted'] as const;
export const FLOAT_BUTTON_BADGE_POSITIONS = [
  'leftTop',
  'leftBottom',
  'rightTop',
  'rightBottom',
] as const;

export type FloatButtonShape = (typeof FLOAT_BUTTON_SHAPES)[number];
export type FloatButtonSize = (typeof FLOAT_BUTTON_SIZES)[number];
export type FloatButtonBadgeType = (typeof FLOAT_BUTTON_BADGE_TYPES)[number];
export type FloatButtonBadgeTheme = (typeof FLOAT_BUTTON_BADGE_THEMES)[number];
export type FloatButtonBadgePosition = (typeof FLOAT_BUTTON_BADGE_POSITIONS)[number];

export interface FloatButtonBadgeProps {
  count?: VNodeChild;
  dot?: boolean;
  type?: FloatButtonBadgeType;
  theme?: FloatButtonBadgeTheme;
  position?: FloatButtonBadgePosition;
  overflowCount?: number;
  style?: CSSProperties;
  className?: string;
  countClassName?: string;
  countStyle?: CSSProperties;
  onClick?: (event: MouseEvent) => unknown;
  onMouseEnter?: (event: MouseEvent) => unknown;
  onMouseLeave?: (event: MouseEvent) => unknown;
}

export interface FloatButtonProps {
  shape?: FloatButtonShape;
  colorful?: boolean;
  icon?: VNodeChild;
  href?: string;
  target?: string;
  disabled?: boolean;
  size?: FloatButtonSize;
  badge?: FloatButtonBadgeProps;
}

export interface FloatButtonEmits {
  click: [event: MouseEvent];
}

export interface FloatButtonSlots {
  icon?: () => unknown;
}

export interface FloatButtonGroupItem extends FloatButtonProps {
  value?: string;
  content?: VNodeChild;
}

export interface FloatButtonGroupProps {
  disabled?: boolean;
  items: readonly FloatButtonGroupItem[];
}

export interface FloatButtonGroupEmits {
  click: [value: string, event: MouseEvent];
}

export interface FloatButtonGroupSlots {
  item?: (props: { item: FloatButtonGroupItem; index: number }) => unknown;
}
