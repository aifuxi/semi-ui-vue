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

declare module '@semi-v2.102.0/typography' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  interface CommonProps extends HTMLAttributes<HTMLElement> {
    component?: React.ElementType;
    copyable?: boolean | object;
    delete?: boolean;
    disabled?: boolean;
    ellipsis?:
      | boolean
      | {
          collapseText?: string;
          collapsible?: boolean;
          expandText?: string;
          expandable?: boolean;
          pos?: 'end' | 'middle';
          rows?: number;
          showTooltip?: boolean | object;
          suffix?: string;
        };
    link?: boolean | React.AnchorHTMLAttributes<HTMLAnchorElement>;
    mark?: boolean;
    size?: 'normal' | 'small' | 'inherit';
    strong?: boolean;
    style?: CSSProperties;
    type?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'tertiary' | 'quaternary';
    underline?: boolean;
  }
  interface TextProps extends CommonProps {
    code?: boolean;
  }
  interface TitleProps extends CommonProps {
    heading?: 1 | 2 | 3 | 4 | 5 | 6;
    weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'default' | number;
  }
  interface ParagraphProps extends CommonProps {
    spacing?: 'normal' | 'extended';
  }
  interface NumeralProps extends CommonProps {
    children?: ReactNode;
    precision?: number;
    rule?: 'text' | 'numbers' | 'bytes-decimal' | 'bytes-binary' | 'percentages' | 'exponential';
  }
  type TypographyComponent = ComponentType<CommonProps> & {
    Text: ComponentType<TextProps>;
    Title: ComponentType<TitleProps>;
    Paragraph: ComponentType<ParagraphProps>;
    Numeral: ComponentType<NumeralProps>;
  };
  const Typography: TypographyComponent;
  export default Typography;
}

declare module '@semi-v2.102.0/layout' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export type LayoutBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    children?: ReactNode;
    hasSider?: boolean;
    prefixCls?: string;
    style?: CSSProperties;
    tagName?: keyof HTMLElementTagNameMap;
  }
  export interface LayoutSiderProps extends LayoutProps {
    breakpoint?: LayoutBreakpoint[];
    onBreakpoint?: (screen: LayoutBreakpoint, match: boolean) => void;
  }
  type LayoutComponent = ComponentType<LayoutProps> & {
    Header: ComponentType<LayoutProps>;
    Footer: ComponentType<LayoutProps>;
    Content: ComponentType<LayoutProps>;
    Sider: ComponentType<LayoutSiderProps>;
  };
  const Layout: LayoutComponent;
  export default Layout;
}

declare module '@semi-v2.102.0/grid' {
  import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  export type GridGutter = number | Partial<Record<GridBreakpoint, number>>;
  export interface RowProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'top' | 'middle' | 'bottom';
    children?: ReactNode;
    gutter?: GridGutter | [GridGutter, GridGutter];
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    prefixCls?: string;
    style?: CSSProperties;
    type?: 'flex';
  }
  export interface ColSize {
    span?: number;
    order?: number;
    offset?: number;
    push?: number;
    pull?: number;
  }
  export interface ColProps extends HTMLAttributes<HTMLDivElement>, ColSize {
    children?: ReactNode;
    prefixCls?: string;
    style?: CSSProperties;
    xs?: number | ColSize;
    sm?: number | ColSize;
    md?: number | ColSize;
    lg?: number | ColSize;
    xl?: number | ColSize;
    xxl?: number | ColSize;
  }
  export const Row: React.ComponentType<RowProps>;
  export const Col: React.ComponentType<ColProps>;
}

declare module '@semi-v2.102.0/resizable' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export type ResizeDirection =
    'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';
  export interface ResizeSize {
    width?: string | number;
    height?: string | number;
  }
  export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    defaultSize?: ResizeSize;
    size?: ResizeSize;
    minWidth?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    maxHeight?: string | number;
    onChange?: (size: ResizeSize, event: Event, direction: ResizeDirection) => void;
    onResizeEnd?: (size: ResizeSize, event: Event, direction: ResizeDirection) => void;
  }
  export interface ResizeGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    direction?: 'horizontal' | 'vertical';
  }
  export interface ResizeItemProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    defaultSize?: string | number;
    min?: string;
    max?: string;
    onChange?: (size: ResizeSize, event: Event, direction: ResizeDirection) => void;
    onResizeEnd?: (size: ResizeSize, event: Event, direction: ResizeDirection) => void;
  }
  export interface ResizeHandlerProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    style?: CSSProperties;
  }
  export const Resizable: ComponentType<ResizableProps>;
  export const ResizeGroup: ComponentType<ResizeGroupProps>;
  export const ResizeItem: ComponentType<ResizeItemProps>;
  export const ResizeHandler: ComponentType<ResizeHandlerProps>;
}

declare module '@semi-v2.102.0/float-button' {
  import type { CSSProperties, ComponentType, MouseEvent, ReactNode } from 'react';

  export type FloatButtonShape = 'square' | 'round';
  export type FloatButtonSize = 'small' | 'default' | 'large';
  export interface FloatButtonBadgeProps {
    count?: ReactNode;
    dot?: boolean;
    type?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';
    theme?: 'solid' | 'light' | 'inverted';
    position?: 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
    overflowCount?: number;
    style?: CSSProperties;
    className?: string;
    countClassName?: string;
    countStyle?: CSSProperties;
  }
  export interface FloatButtonProps {
    shape?: FloatButtonShape;
    colorful?: boolean;
    style?: CSSProperties;
    className?: string;
    icon?: ReactNode;
    onClick?: (event: MouseEvent) => void;
    href?: string;
    target?: string;
    disabled?: boolean;
    size?: FloatButtonSize;
    badge?: FloatButtonBadgeProps;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const FloatButton: ComponentType<FloatButtonProps>;
  export default FloatButton;
}

declare module '@semi-v2.102.0/float-button-group' {
  import type { CSSProperties, ComponentType, MouseEvent, ReactNode } from 'react';
  import type { FloatButtonProps } from '@semi-v2.102.0/float-button';

  export interface FloatButtonGroupItem extends FloatButtonProps {
    value?: string;
    content?: string | ReactNode;
  }
  export interface FloatButtonGroupProps {
    disabled?: boolean;
    items: FloatButtonGroupItem[];
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    onClick?: (value: string, event: MouseEvent) => void;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const FloatButtonGroup: ComponentType<FloatButtonGroupProps>;
  export default FloatButtonGroup;
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
  export const IconBell: BuiltinIcon;
  export const IconCustomerSupport: BuiltinIcon;
  export const IconHelpCircle: BuiltinIcon;
  export const IconLikeHeart: BuiltinIcon;
  export const IconPlus: BuiltinIcon;
  export const IconSpin: BuiltinIcon;
}

declare module '@semi-v2.102.0/icons-lab' {
  import type { ComponentType } from 'react';
  import type { IconProps } from '@semi-v2.102.0/icon';
  export const IconAvatar: ComponentType<Omit<IconProps, 'fill' | 'svg' | 'type'>>;
}

declare module 'virtual:semi-reference-styles.css';
