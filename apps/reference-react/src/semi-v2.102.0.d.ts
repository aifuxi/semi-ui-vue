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

declare module '@semi-v2.102.0/input' {
  import type { ComponentType, CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

  export interface InputProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'prefix' | 'size'
  > {
    addonAfter?: ReactNode;
    addonBefore?: ReactNode;
    borderless?: boolean;
    clearIcon?: ReactNode;
    defaultValue?: string | number;
    hideSuffix?: boolean;
    inputStyle?: CSSProperties;
    insetLabel?: ReactNode;
    mode?: 'password';
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: (event: React.MouseEvent<HTMLDivElement>) => void;
    prefix?: ReactNode;
    readonly?: boolean;
    showClear?: boolean;
    size?: 'small' | 'default' | 'large';
    suffix?: ReactNode;
    validateStatus?: 'default' | 'warning' | 'error' | 'success';
    value?: string | number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const Input: ComponentType<InputProps>;
  export default Input;
}

declare module '@semi-v2.102.0/input-number' {
  import type { ComponentType, CSSProperties, InputHTMLAttributes, ReactNode } from 'react';

  export interface InputNumberProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'defaultValue' | 'onChange' | 'prefix' | 'size' | 'step' | 'value'
  > {
    className?: string;
    currency?: boolean | string;
    defaultValue?: number | string;
    disabled?: boolean;
    formatter?: (value: number | string) => string;
    hideButtons?: boolean;
    innerButtons?: boolean;
    localeCode?: string;
    max?: number;
    min?: number;
    onChange?: (value: number | string) => void;
    precision?: number;
    scientificNotation?: boolean | { threshold?: number };
    size?: 'small' | 'default' | 'large';
    step?: number;
    style?: CSSProperties;
    suffix?: ReactNode;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const InputNumber: ComponentType<InputNumberProps>;
  export default InputNumber;
}

declare module '@semi-v2.102.0/pin-code' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface PinCodeProps {
    autoFocus?: boolean;
    className?: string;
    count?: number;
    defaultValue?: string;
    disabled?: boolean;
    format?: 'number' | 'mixed' | RegExp | ((character: string) => boolean);
    onChange?: (value: string) => void;
    onComplete?: (value: string) => void;
    size?: 'small' | 'default' | 'large';
    style?: CSSProperties;
    value?: string;
  }
  const PinCode: ComponentType<PinCodeProps>;
  export default PinCode;
}

declare module '@semi-v2.102.0/radio' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export type RadioValue = string | number | boolean;
  export interface RadioChangeEvent {
    target: { checked: boolean; value?: RadioValue | undefined };
  }
  export interface RadioProps extends Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'> {
    addonClassName?: string;
    addonId?: string;
    addonStyle?: CSSProperties;
    autoFocus?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    displayMode?: '' | 'vertical';
    extra?: ReactNode;
    extraId?: string;
    mode?: '' | 'advanced';
    name?: string;
    onChange?: (event: RadioChangeEvent) => void;
    preventScroll?: boolean;
    type?: 'default' | 'button' | 'card' | 'pureCard';
    value?: RadioValue;
  }
  export interface RadioOption {
    label?: ReactNode;
    value?: RadioValue;
    disabled?: boolean;
    extra?: ReactNode;
    style?: CSSProperties;
    className?: string;
  }
  export interface RadioGroupProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange'
  > {
    buttonSize?: 'small' | 'middle' | 'large';
    defaultValue?: RadioValue;
    direction?: 'horizontal' | 'vertical';
    disabled?: boolean;
    mode?: '' | 'advanced';
    name?: string;
    onChange?: (event: RadioChangeEvent) => void;
    options?: Array<string | RadioOption>;
    type?: 'default' | 'button' | 'card' | 'pureCard';
    value?: RadioValue;
  }
  const Radio: ComponentType<RadioProps> & { Group: ComponentType<RadioGroupProps> };
  export default Radio;
}

declare module '@semi-v2.102.0/input-group' {
  import type { ComponentType, CSSProperties, FocusEvent, ReactNode } from 'react';

  export interface InputGroupProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    label?: {
      name?: string;
      required?: boolean;
      text?: ReactNode;
    };
    labelPosition?: 'top' | 'left';
    onBlur?: (event: FocusEvent<HTMLSpanElement>) => void;
    onFocus?: (event: FocusEvent<HTMLSpanElement>) => void;
    size?: 'small' | 'default' | 'large';
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const InputGroup: ComponentType<InputGroupProps>;
  export default InputGroup;
}

declare module '@semi-v2.102.0/textarea' {
  import type { ComponentType, CSSProperties, TextareaHTMLAttributes } from 'react';

  export interface TextAreaProps extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'onChange' | 'onResize'
  > {
    autosize?: boolean | { minRows?: number; maxRows?: number };
    borderless?: boolean;
    maxCount?: number;
    onChange?: (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onClear?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onResize?: (data: { height: number; width?: number }) => void;
    readonly?: boolean;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical' | 'block' | 'inline';
    showClear?: boolean;
    showCounter?: boolean;
    showLineNumber?: boolean;
    textareaStyle?: CSSProperties;
    validateStatus?: 'default' | 'warning' | 'error' | 'success';
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const TextArea: ComponentType<TextAreaProps>;
  export default TextArea;
}

declare module '@semi-v2.102.0/checkbox' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export type CheckboxType = 'default' | 'card' | 'pureCard';
  export interface CheckboxEvent {
    target: { checked: boolean; value?: unknown };
  }
  export interface CheckboxProps {
    'aria-label'?: string;
    checked?: boolean;
    children?: ReactNode;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    extra?: ReactNode;
    indeterminate?: boolean;
    onChange?: (event: CheckboxEvent) => void;
    style?: CSSProperties;
    type?: CheckboxType;
    value?: unknown;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  export interface CheckboxGroupProps {
    'aria-label'?: string;
    children?: ReactNode;
    defaultValue?: unknown[];
    direction?: 'horizontal' | 'vertical';
    disabled?: boolean;
    onChange?: (value: unknown[]) => void;
    options?: Array<
      | string
      | {
          className?: string;
          disabled?: boolean;
          extra?: ReactNode;
          label?: ReactNode;
          style?: CSSProperties;
          value: unknown;
        }
    >;
    type?: CheckboxType;
    value?: unknown[];
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  type CheckboxComponent = ComponentType<CheckboxProps> & {
    Group: ComponentType<CheckboxGroupProps>;
  };
  const Checkbox: CheckboxComponent;
  export default Checkbox;
}

declare module '@semi-v2.102.0/config-provider' {
  import type { ComponentType, ReactNode } from 'react';

  export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  export type BreakpointScreens = Record<Breakpoint, boolean>;
  export type ResponsiveMap = Record<Breakpoint, string>;
  export interface ConfigContextValue {
    direction?: 'ltr' | 'rtl';
    timeZone?: string | number;
    locale?: { code?: string; [key: string]: unknown };
    responsiveObserve?: boolean;
    responsiveMap?: ResponsiveMap;
    screens?: BreakpointScreens;
    onBreakpoint(callback: (screens: BreakpointScreens) => void): () => void;
    onBreakpoint(
      breakpoints: Breakpoint[],
      callback: (screen: Breakpoint, match: boolean) => void,
    ): () => void;
  }
  export interface ConfigProviderProps extends Partial<ConfigContextValue> {
    children?: ReactNode;
  }
  type ConfigProviderComponent = ComponentType<ConfigProviderProps> & {
    defaultResponsiveMap: ResponsiveMap;
  };
  const ConfigProvider: ConfigProviderComponent;
  export const ConfigConsumer: ComponentType<{
    children: (context: ConfigContextValue) => ReactNode;
  }>;
  export default ConfigProvider;
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

declare module '@semi-v2.102.0/switch' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export type SwitchSize = 'large' | 'default' | 'small';
  export interface SwitchProps {
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
    'aria-invalid'?: boolean;
    'aria-labelledby'?: string;
    checked?: boolean;
    checkedText?: ReactNode;
    className?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    id?: string;
    loading?: boolean;
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
    size?: SwitchSize;
    style?: CSSProperties;
    uncheckedText?: ReactNode;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Switch: ComponentType<SwitchProps>;
  export default Switch;
}

declare module '@semi-v2.102.0/tooltip' {
  import type { ComponentType, CSSProperties, ReactElement, ReactNode } from 'react';

  export type TooltipPosition =
    | 'top'
    | 'topLeft'
    | 'topRight'
    | 'left'
    | 'leftTop'
    | 'leftBottom'
    | 'right'
    | 'rightTop'
    | 'rightBottom'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTopOver'
    | 'rightTopOver'
    | 'leftBottomOver'
    | 'rightBottomOver';
  export type TooltipTrigger = 'hover' | 'focus' | 'click' | 'custom' | 'contextMenu';
  export interface TooltipProps {
    children?: ReactElement | ReactNode;
    className?: string;
    clickToHide?: boolean;
    closeOnEsc?: boolean;
    content?: ReactNode | ((props: { initialFocusRef: unknown }) => ReactNode);
    getPopupContainer?: () => HTMLElement;
    motion?: boolean;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    onVisibleChange?: (visible: boolean) => void;
    position?: TooltipPosition;
    role?: string;
    showArrow?: boolean | ReactNode;
    style?: CSSProperties;
    trigger?: TooltipTrigger;
    visible?: boolean;
    wrapperClassName?: string;
    wrapperId?: string;
  }
  const Tooltip: ComponentType<TooltipProps>;
  export default Tooltip;
}

declare module '@semi-v2.102.0/auto-complete' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface AutoCompleteItem {
    value?: string | number;
    label?: ReactNode;
    disabled?: boolean;
    [key: string]: unknown;
  }
  export interface AutoCompleteProps {
    data?: Array<string | number | AutoCompleteItem>;
    defaultActiveFirstOption?: boolean;
    defaultOpen?: boolean;
    defaultValue?: string | number;
    disabled?: boolean;
    dropdownClassName?: string;
    getPopupContainer?: () => HTMLElement;
    motion?: boolean;
    onChange?: (value: string | number) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    prefix?: ReactNode;
    renderItem?: (item: string | number | AutoCompleteItem) => ReactNode;
    renderSelectedItem?: (item: AutoCompleteItem) => string;
    showClear?: boolean;
    size?: 'small' | 'default' | 'large';
    style?: CSSProperties;
    validateStatus?: 'default' | 'warning' | 'error';
    value?: string | number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const AutoComplete: ComponentType<AutoCompleteProps>;
  export default AutoComplete;
}

declare module '@semi-v2.102.0/select' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface OptionProps {
    value?: string | number;
    label?: ReactNode;
    disabled?: boolean;
    showTick?: boolean;
    children?: ReactNode;
  }
  export interface OptionGroupProps {
    label?: ReactNode;
    children?: ReactNode;
  }
  export interface SelectProps {
    children?: ReactNode;
    defaultValue?: string | number | Array<string | number>;
    value?: string | number | Array<string | number>;
    multiple?: boolean;
    maxTagCount?: number;
    filter?: boolean;
    defaultOpen?: boolean;
    disabled?: boolean;
    placeholder?: ReactNode;
    showClear?: boolean;
    motion?: boolean;
    style?: CSSProperties;
    getPopupContainer?: () => HTMLElement;
    onChange?: (value: string | number | Array<string | number> | undefined) => void;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  type SelectComponent = ComponentType<SelectProps> & {
    Option: ComponentType<OptionProps>;
    OptGroup: ComponentType<OptionGroupProps>;
  };
  const Select: SelectComponent;
  export default Select;
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
  export const IconSearch: BuiltinIcon;
  export const IconSpin: BuiltinIcon;
}

declare module '@semi-v2.102.0/icons-lab' {
  import type { ComponentType } from 'react';
  import type { IconProps } from '@semi-v2.102.0/icon';
  export const IconAvatar: ComponentType<Omit<IconProps, 'fill' | 'svg' | 'type'>>;
}

declare module 'virtual:semi-reference-styles.css';
