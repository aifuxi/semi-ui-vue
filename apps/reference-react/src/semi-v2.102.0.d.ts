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

declare module 'virtual:semi-reference-styles.css';
