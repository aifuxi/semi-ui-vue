import type { HTMLAttributes, StyleValue } from 'vue';

export const BUTTON_SIZES = ['default', 'small', 'large'] as const;
export const BUTTON_THEMES = ['solid', 'borderless', 'light', 'outline'] as const;
export const BUTTON_TYPES = ['primary', 'secondary', 'tertiary', 'warning', 'danger'] as const;
export const BUTTON_HTML_TYPES = ['button', 'reset', 'submit'] as const;
export const BUTTON_ICON_POSITIONS = ['left', 'right'] as const;

export type ButtonSize = (typeof BUTTON_SIZES)[number];
export type ButtonTheme = (typeof BUTTON_THEMES)[number];
export type ButtonType = (typeof BUTTON_TYPES)[number];
export type ButtonHtmlType = (typeof BUTTON_HTML_TYPES)[number];
export type ButtonIconPosition = (typeof BUTTON_ICON_POSITIONS)[number];
export type ButtonIconSize =
  'inherit' | 'extra-small' | 'small' | 'default' | 'large' | 'extra-large';
export type ButtonHorizontalPadding = 'left' | 'right';
export type ButtonNoHorizontalPadding =
  boolean | ButtonHorizontalPadding | readonly ButtonHorizontalPadding[];
export type ButtonIconFill = string | readonly string[];

export interface ButtonProps {
  block?: boolean;
  circle?: boolean;
  colorful?: boolean;
  contentClass?: HTMLAttributes['class'];
  disabled?: boolean;
  htmlType?: ButtonHtmlType;
  iconPosition?: ButtonIconPosition;
  iconSize?: ButtonIconSize;
  iconStyle?: StyleValue;
  loading?: boolean;
  noHorizontalPadding?: ButtonNoHorizontalPadding;
  prefixCls?: string;
  size?: ButtonSize;
  theme?: ButtonTheme;
  type?: ButtonType;
}

export interface ButtonSlots {
  default?: () => unknown;
  icon?: (props: {
    fill: ButtonIconFill | undefined;
    iconSize: ButtonIconSize | undefined;
    iconStyle: StyleValue | undefined;
  }) => unknown;
}

export interface ButtonEmits {
  click: [event: MouseEvent];
  mousedown: [event: MouseEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}

export interface ButtonGroupProps {
  colorful?: boolean;
  disabled?: boolean;
  prefixCls?: string;
  size?: ButtonSize;
  theme?: ButtonTheme;
  type?: ButtonType;
}

export interface SplitButtonGroupProps {
  prefixCls?: string;
}
