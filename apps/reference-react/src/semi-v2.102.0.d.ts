declare module '@semi-v2.102.0/button' {
  import type { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react';

  export type ButtonSize = 'default' | 'small' | 'large';
  export type ButtonTheme = 'solid' | 'borderless' | 'light' | 'outline';
  export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';

  export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    block?: boolean;
    circle?: boolean;
    colorful?: boolean;
    disabled?: boolean;
    htmlType?: 'button' | 'reset' | 'submit';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    noHorizontalPadding?: boolean | 'left' | 'right' | ('left' | 'right')[];
    size?: ButtonSize;
    theme?: ButtonTheme;
    type?: ButtonType;
  }

  const Button: ComponentType<ButtonProps>;
  export default Button;
}

declare module '@semi-v2.102.0/button-group' {
  import type { ComponentType, HTMLAttributes } from 'react';
  import type { ButtonSize, ButtonTheme, ButtonType } from '@semi-v2.102.0/button';

  export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    colorful?: boolean;
    disabled?: boolean;
    size?: ButtonSize;
    theme?: ButtonTheme;
    type?: ButtonType;
  }

  const ButtonGroup: ComponentType<ButtonGroupProps>;
  export default ButtonGroup;
}

declare module '@semi-v2.102.0/split-button-group' {
  import type { ComponentType, HTMLAttributes } from 'react';

  const SplitButtonGroup: ComponentType<HTMLAttributes<HTMLDivElement>>;
  export default SplitButtonGroup;
}

declare module '@semi-v2.102.0/divider' {
  import type { ComponentType, HTMLAttributes } from 'react';

  export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'left' | 'right' | 'center';
    dashed?: boolean;
    layout?: 'horizontal' | 'vertical';
    margin?: number | string;
  }

  const Divider: ComponentType<DividerProps>;
  export default Divider;
}

declare module '@semi-v2.102.0/space' {
  import type { CSSProperties, ReactNode } from 'react';

  export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline';
  export type SpaceSpacing = 'loose' | 'medium' | 'tight' | number;
  export interface SpaceProps {
    align?: SpaceAlign;
    children?: ReactNode;
    className?: string;
    spacing?: SpaceSpacing | SpaceSpacing[];
    style?: CSSProperties;
    vertical?: boolean;
    wrap?: boolean;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Space: React.ComponentType<SpaceProps>;
  export default Space;
}

declare module '@semi-v2.102.0/icon' {
  import type { ComponentType, HTMLAttributes, ReactNode } from 'react';

  export type IconSize = 'inherit' | 'extra-small' | 'small' | 'default' | 'large' | 'extra-large';
  export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
    fill?: string | string[];
    prefixCls?: string;
    rotate?: number;
    size?: IconSize;
    spin?: boolean;
    svg?: ReactNode;
    type?: string;
  }
  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module '@semi-v2.102.0/icons' {
  import type { ComponentType } from 'react';
  import type { IconProps } from '@semi-v2.102.0/icon';
  type BuiltinIcon = ComponentType<Omit<IconProps, 'svg' | 'type'>>;
  export const IconAIFilledLevel2: BuiltinIcon;
  export const IconAIWandLevel3: BuiltinIcon;
  export const IconEmoji: BuiltinIcon;
  export const IconHome: BuiltinIcon;
  export const IconLikeHeart: BuiltinIcon;
  export const IconSpin: BuiltinIcon;
}

declare module '@semi-v2.102.0/icons-lab' {
  import type { ComponentType } from 'react';
  import type { IconProps } from '@semi-v2.102.0/icon';
  export const IconAvatar: ComponentType<Omit<IconProps, 'fill' | 'svg' | 'type'>>;
}

declare module 'virtual:semi-reference-styles.css';
