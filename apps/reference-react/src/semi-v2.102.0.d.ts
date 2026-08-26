declare module '@semi-v2.102.0/button' {
  import type { ButtonHTMLAttributes, ComponentType } from 'react';

  export type ButtonSize = 'default' | 'small' | 'large';
  export type ButtonTheme = 'solid' | 'borderless' | 'light' | 'outline';
  export type ButtonType = 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';

  export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
    block?: boolean;
    circle?: boolean;
    disabled?: boolean;
    htmlType?: 'button' | 'reset' | 'submit';
    loading?: boolean;
    size?: ButtonSize;
    theme?: ButtonTheme;
    type?: ButtonType;
  }

  const Button: ComponentType<ButtonProps>;
  export default Button;
}

declare module 'virtual:semi-reference-styles.css';
