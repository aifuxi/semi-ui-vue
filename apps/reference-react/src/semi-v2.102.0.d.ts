declare module '@semi-v2.102.0/locale-provider' {
  import type { ComponentType, ReactNode } from 'react';

  export interface ReferenceLocale {
    code?: string;
    currency?: string;
    dateFnsLocale?: { code?: string };
    [componentName: string]: unknown;
  }

  const LocaleProvider: ComponentType<{ children?: ReactNode; locale?: ReferenceLocale }>;
  export default LocaleProvider;
}

declare module '@semi-v2.102.0/locale-consumer' {
  import type { ReactElement, ReactNode } from 'react';

  const LocaleConsumer: <ComponentLocale>(props: {
    children?: (
      localeData: ComponentLocale,
      localeCode: string,
      dateFnsLocale: { code?: string },
      currency: string,
    ) => ReactNode;
    componentName: string;
  }) => ReactElement | null;
  export default LocaleConsumer;
}

declare module '@semi-v2.102.0/locale-en-gb' {
  import type { ReferenceLocale } from '@semi-v2.102.0/locale-provider';
  const locale: ReferenceLocale;
  export default locale;
}

declare module '@semi-v2.102.0/locale-ja-jp' {
  import type { ReferenceLocale } from '@semi-v2.102.0/locale-provider';
  const locale: ReferenceLocale;
  export default locale;
}

declare module '@semi-v2.102.0/anchor' {
  import type { ComponentType, CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

  export interface AnchorLinkProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    href?: string;
    style?: CSSProperties;
    title?: ReactNode;
  }

  export interface AnchorProps {
    'aria-label'?: string;
    autoCollapse?: boolean;
    children?: ReactNode;
    className?: string;
    defaultAnchor?: string;
    getContainer?: () => HTMLElement | Window;
    maxHeight?: string | number;
    maxWidth?: string | number;
    offsetTop?: number;
    onChange?: (currentLink: string, previousLink: string) => void;
    onClick?: (
      event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
      currentLink: string,
    ) => void;
    position?: string;
    railTheme?: 'primary' | 'tertiary' | 'muted';
    scrollMotion?: boolean;
    showTooltip?: boolean | Record<string, unknown>;
    size?: 'small' | 'default';
    style?: CSSProperties;
    targetOffset?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Anchor: ComponentType<AnchorProps> & { Link: ComponentType<AnchorLinkProps> };
  export default Anchor;
}

declare module '@semi-v2.102.0/overflow-list' {
  import type { CSSProperties, ReactElement, ReactNode } from 'react';

  export interface OverflowItem {
    key?: string | number;
    [key: string]: unknown;
  }

  interface OverflowListCommonProps<Item extends OverflowItem = OverflowItem> {
    className?: string;
    collapseFrom?: 'start' | 'end';
    items?: Item[];
    minVisibleItems?: number;
    onIntersect?: (entries: Record<string, IntersectionObserverEntry>) => void;
    onOverflow?: (items: Item[]) => void;
    onVisibleStateChange?: (state: Map<string, boolean>) => void;
    style?: CSSProperties;
    threshold?: number;
    visibleItemRenderer?: (item: Item, index: number) => ReactElement;
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
  }

  export interface OverflowListCollapseProps<
    Item extends OverflowItem = OverflowItem,
  > extends OverflowListCommonProps<Item> {
    overflowRenderer?: (items: Item[]) => ReactNode;
    renderMode?: 'collapse';
  }

  export interface OverflowListScrollProps<
    Item extends OverflowItem = OverflowItem,
  > extends OverflowListCommonProps<Item> {
    overflowRenderer?: (items: [Item[], Item[]]) => ReactNode;
    renderMode: 'scroll';
  }

  export type OverflowListProps<Item extends OverflowItem = OverflowItem> =
    OverflowListCollapseProps<Item> | OverflowListScrollProps<Item>;

  const OverflowList: <Item extends OverflowItem>(
    props: OverflowListProps<Item>,
  ) => ReactElement | null;
  export default OverflowList;
}

declare module '@semi-v2.102.0/popover' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface PopoverProps {
    arrowStyle?: CSSProperties & { borderOpacity?: string | number };
    children?: ReactNode;
    className?: string;
    content?: ReactNode;
    getPopupContainer?: () => HTMLElement;
    motion?: boolean;
    position?: string;
    showArrow?: boolean;
    style?: CSSProperties;
    trigger?: 'hover' | 'focus' | 'click' | 'custom' | 'contextMenu';
    visible?: boolean;
  }

  const Popover: ComponentType<PopoverProps>;
  export default Popover;
}

declare module '@semi-v2.102.0/scroll-list' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface ScrollItemData {
    disabled?: boolean;
    text?: string;
    transform?: (value: unknown, text: string) => ReactNode;
    value: unknown;
    [key: string]: unknown;
  }

  export interface ScrollItemSelectData extends ScrollItemData {
    index: number;
    type?: number | string;
  }

  export interface ScrollItemProps {
    'aria-label'?: string;
    cycled?: boolean;
    list?: ScrollItemData[];
    mode?: 'normal' | 'wheel';
    motion?: boolean | Record<string, unknown> | ((props: Record<string, unknown>) => object);
    onSelect?: (data: ScrollItemSelectData) => void;
    selectedIndex?: number;
    style?: CSSProperties;
    transform?: (value: unknown, text: string) => ReactNode;
    type?: number | string;
  }

  export interface ScrollListProps {
    bodyHeight?: number | string;
    children?: ReactNode;
    className?: string;
    footer?: ReactNode;
    header?: ReactNode;
    style?: CSSProperties;
  }

  const ScrollList: ComponentType<ScrollListProps>;
  export default ScrollList;
}

declare module '@semi-v2.102.0/scroll-item' {
  import type { ComponentType } from 'react';
  import type { ScrollItemProps } from '@semi-v2.102.0/scroll-list';

  const ScrollItem: ComponentType<ScrollItemProps>;
  export default ScrollItem;
}

declare module '@semi-v2.102.0/side-sheet' {
  import type { ComponentType, CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

  export interface SideSheetProps {
    'aria-label'?: string;
    afterVisibleChange?: (visible: boolean) => void;
    bodyStyle?: CSSProperties;
    children?: ReactNode;
    className?: string;
    closable?: boolean;
    closeIcon?: ReactNode;
    closeOnEsc?: boolean;
    disableScroll?: boolean;
    footer?: ReactNode;
    getPopupContainer?: () => HTMLElement;
    headerStyle?: CSSProperties;
    height?: number | string;
    keepDOM?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    maskStyle?: CSSProperties;
    motion?: boolean;
    onCancel?: (event: MouseEvent | KeyboardEvent) => void;
    placement?: 'top' | 'right' | 'bottom' | 'left';
    size?: 'small' | 'medium' | 'large';
    style?: CSSProperties;
    title?: ReactNode;
    visible?: boolean;
    width?: number | string;
    zIndex?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const SideSheet: ComponentType<SideSheetProps>;
  export default SideSheet;
}

declare module '@semi-v2.102.0/progress' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface ProgressProps {
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-valuetext'?: string;
    className?: string;
    direction?: 'horizontal' | 'vertical';
    format?: (percent: number) => ReactNode;
    id?: string;
    motion?: boolean | object | ((props: Record<string, unknown>) => object);
    orbitStroke?: string;
    percent?: number;
    showInfo?: boolean;
    size?: 'default' | 'small' | 'large';
    stroke?: string | Array<{ percent: number; color: string }>;
    strokeGradient?: boolean;
    strokeLinecap?: 'round' | 'square';
    strokeWidth?: number;
    style?: CSSProperties;
    type?: 'line' | 'circle';
    width?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Progress: ComponentType<ProgressProps>;
  export default Progress;
}

declare module '@semi-v2.102.0/skeleton' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface SkeletonProps {
    active?: boolean;
    children?: ReactNode;
    className?: string;
    loading?: boolean;
    placeholder?: ReactNode;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface SkeletonItemProps {
    className?: string;
    prefixCls?: string;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface SkeletonAvatarProps extends SkeletonItemProps {
    shape?: 'circle' | 'square';
    size?:
      | 'extra-extra-small'
      | 'extra-small'
      | 'small'
      | 'default'
      | 'medium'
      | 'large'
      | 'extra-large';
  }

  export interface SkeletonParagraphProps extends SkeletonItemProps {
    rows?: number;
  }

  type SkeletonComponent = ComponentType<SkeletonProps> & {
    Avatar: ComponentType<SkeletonAvatarProps>;
    Button: ComponentType<SkeletonItemProps>;
    Image: ComponentType<SkeletonItemProps>;
    Paragraph: ComponentType<SkeletonParagraphProps>;
    Title: ComponentType<SkeletonItemProps>;
  };

  const Skeleton: SkeletonComponent;
  export default Skeleton;
}

declare module '@semi-v2.102.0/spin' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export type SpinSize = 'small' | 'middle' | 'large';

  export interface SpinProps {
    childStyle?: CSSProperties;
    children?: ReactNode;
    className?: string;
    delay?: number;
    indicator?: ReactNode;
    size?: SpinSize;
    spinning?: boolean;
    style?: CSSProperties;
    tip?: ReactNode;
    wrapperClassName?: string;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Spin: ComponentType<SpinProps>;
  export default Spin;
}

declare module '@semi-v2.102.0/transfer' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface TransferDataItem {
    key: string | number;
    label?: ReactNode;
    value?: string | number;
    disabled?: boolean;
  }
  export interface TransferProps {
    className?: string;
    style?: CSSProperties;
    disabled?: boolean;
    dataSource?: TransferDataItem[];
    filter?: boolean | ((input: string, item: TransferDataItem) => boolean);
    defaultValue?: Array<string | number>;
    value?: Array<string | number>;
    onChange?: (values: Array<string | number>, items: TransferDataItem[]) => void;
  }
  const Transfer: ComponentType<TransferProps>;
  export default Transfer;
}

declare module '@semi-v2.102.0/upload' {
  import type { ComponentType, HTMLAttributes, ReactNode } from 'react';
  interface FileItem {
    uid: string;
    name: string;
    size: string;
    status: string;
    preview?: boolean;
    url?: string;
  }
  interface UploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    action: string;
    children?: ReactNode;
    defaultFileList?: FileItem[];
    listType?: 'list' | 'picture' | 'none';
    prompt?: ReactNode;
    showPicInfo?: boolean;
  }
  const Upload: ComponentType<UploadProps>;
  export default Upload;
}

declare module '@semi-v2.102.0/toast' {
  import type React from 'react';

  export interface ToastOptions {
    className?: string;
    content?: React.ReactNode;
    direction?: 'ltr' | 'rtl';
    duration?: number;
    id?: string | number;
    motion?: boolean;
    onClose?: () => void;
    showClose?: boolean;
    stack?: boolean;
    textMaxWidth?: string | number;
    theme?: 'normal' | 'light';
  }

  export interface ToastStatic {
    close(id: string | number): string;
    config(options: Record<string, unknown>): void;
    destroyAll(): void;
    error(options: ToastOptions | string): string;
    getWrapperId(): string | null;
    info(options: ToastOptions | string): string;
    success(options: ToastOptions | string): string;
    warning(options: ToastOptions | string): string;
  }

  const Toast: ToastStatic;
  export default Toast;
}

declare module '@semi-v2.102.0/back-top' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export interface BackTopProps {
    children?: ReactNode;
    className?: string;
    duration?: number;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    style?: CSSProperties;
    target?: () => Window | HTMLElement | null;
    visibilityHeight?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const BackTop: ComponentType<BackTopProps>;
  export default BackTop;
}

declare module '@semi-v2.102.0/avatar' {
  import type {
    ComponentType,
    CSSProperties,
    ImgHTMLAttributes,
    MouseEvent,
    ReactNode,
  } from 'react';

  export interface AvatarProps {
    alt?: string;
    border?: boolean | { color?: string; motion?: boolean };
    bottomSlot?: {
      shape?: 'circle' | 'square';
      text?: ReactNode;
      bgColor?: string;
      textColor?: string;
      className?: string;
      style?: CSSProperties;
    };
    children?: ReactNode;
    className?: string;
    color?: string;
    contentMotion?: boolean;
    gap?: number;
    hoverMask?: ReactNode;
    imgAttr?: ImgHTMLAttributes<HTMLImageElement>;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    shape?: 'circle' | 'square';
    size?: string;
    src?: string;
    srcSet?: string;
    style?: CSSProperties;
    topSlot?: {
      text?: ReactNode;
      gradientStart?: string;
      gradientEnd?: string;
      textColor?: string;
      className?: string;
      style?: CSSProperties;
    };
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Avatar: ComponentType<AvatarProps>;
  export default Avatar;
}

declare module '@semi-v2.102.0/avatar-group' {
  import type { ComponentType, ReactNode } from 'react';

  export interface AvatarGroupProps {
    children?: ReactNode;
    maxCount?: number;
    overlapFrom?: 'start' | 'end';
    shape?: 'circle' | 'square';
    size?: string;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const AvatarGroup: ComponentType<AvatarGroupProps>;
  export default AvatarGroup;
}

declare module '@semi-v2.102.0/badge' {
  import type { ComponentType, CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';

  export type BadgeType = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'warning' | 'success';
  export type BadgeTheme = 'solid' | 'light' | 'inverted';
  export type BadgePosition = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

  export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
    children?: ReactNode;
    count?: ReactNode;
    countClassName?: string;
    countStyle?: CSSProperties;
    dot?: boolean;
    overflowCount?: number;
    position?: BadgePosition;
    style?: CSSProperties;
    theme?: BadgeTheme;
    type?: BadgeType;
    onClick?: (event: MouseEvent<HTMLSpanElement>) => unknown;
    onMouseEnter?: (event: MouseEvent<HTMLSpanElement>) => unknown;
    onMouseLeave?: (event: MouseEvent<HTMLSpanElement>) => unknown;
  }

  const Badge: ComponentType<BadgeProps>;
  export default Badge;
}

declare module '@semi-v2.102.0/banner' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export type BannerType = 'info' | 'success' | 'danger' | 'warning';

  export interface BannerProps {
    bordered?: boolean;
    children?: ReactNode;
    className?: string;
    closeIcon?: ReactNode;
    description?: ReactNode;
    fullMode?: boolean;
    icon?: ReactNode;
    onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
    style?: CSSProperties;
    title?: ReactNode;
    type?: BannerType;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Banner: ComponentType<BannerProps>;
  export default Banner;
}

declare module '@semi-v2.102.0/feedback' {
  import type { ComponentType, MouseEvent, ReactNode } from 'react';

  export type FeedbackMode = 'modal' | 'popup';
  export type FeedbackType = 'text' | 'emoji' | 'radio' | 'checkbox' | 'custom';
  export type FeedbackValue = string | unknown[] | { emoji?: string; text?: string };

  export interface FeedbackProps {
    children?: ReactNode;
    getPopupContainer?: () => HTMLElement;
    mode?: FeedbackMode;
    motion?: boolean;
    onCancel?: (event: MouseEvent) => void | Promise<unknown>;
    onOk?: (event: MouseEvent) => void | Promise<unknown>;
    onValueChange?: (value: FeedbackValue) => void;
    radioGroupProps?: {
      options?: Array<{ label: ReactNode; value: string | number }>;
    };
    title?: ReactNode;
    type?: FeedbackType;
    visible?: boolean;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Feedback: ComponentType<FeedbackProps>;
  export default Feedback;
}

declare module '@semi-v2.102.0/notification' {
  import type { CSSProperties, ReactNode } from 'react';

  export type NotificationId = string;
  export type NotificationPosition =
    'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
  export type NotificationType = 'warning' | 'success' | 'info' | 'error' | 'default';

  export interface NotificationOptions {
    className?: string;
    content?: ReactNode;
    direction?: 'ltr' | 'rtl';
    duration?: number;
    getPopupContainer?: () => HTMLElement;
    icon?: ReactNode;
    id?: NotificationId;
    onClick?: (event: unknown) => void;
    onClose?: () => void;
    onCloseClick?: (id: NotificationId) => void;
    position?: NotificationPosition;
    showClose?: boolean;
    style?: CSSProperties;
    theme?: 'normal' | 'light';
    title?: ReactNode;
    type?: NotificationType;
    zIndex?: number;
  }

  export interface NotificationMethods {
    close: (id: NotificationId) => NotificationId;
    error: (options: NotificationOptions) => NotificationId;
    info: (options: NotificationOptions) => NotificationId;
    open: (options: NotificationOptions) => NotificationId;
    success: (options: NotificationOptions) => NotificationId;
    warning: (options: NotificationOptions) => NotificationId;
  }

  export interface NotificationStatic extends NotificationMethods {
    config: (options: Record<string, unknown>) => void;
    destroyAll: () => void;
    useNotification: () => readonly [NotificationMethods, ReactNode];
  }

  const Notification: NotificationStatic;
  export default Notification;
}

declare module '@semi-v2.102.0/breadcrumb' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export interface RouteProps {
    href?: string;
    icon?: ReactNode;
    name?: ReactNode;
    path?: string;
    [key: string]: unknown;
  }

  export type BreadcrumbItemInfo = RouteProps;

  export interface BreadcrumbItemProps {
    active?: boolean;
    children?: ReactNode;
    className?: string;
    href?: string | null;
    icon?: ReactNode;
    noLink?: boolean;
    onClick?: (item: BreadcrumbItemInfo, event: MouseEvent<HTMLElement>) => void;
    route?: RouteProps;
    separator?: ReactNode;
    shouldRenderSeparator?: boolean;
    style?: CSSProperties;
  }

  export interface BreadcrumbProps {
    'aria-label'?: string;
    activeIndex?: number;
    autoCollapse?: boolean;
    children?: ReactNode;
    className?: string;
    compact?: boolean;
    maxItemCount?: number;
    moreType?: 'default' | 'popover';
    onClick?: (item: BreadcrumbItemInfo, event: MouseEvent<HTMLElement>) => void;
    renderItem?: (route: RouteProps) => ReactNode;
    renderMore?: (items: ReactNode[]) => ReactNode;
    routes?: Array<RouteProps | string>;
    separator?: ReactNode;
    showTooltip?: boolean | Record<string, unknown>;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Breadcrumb: ComponentType<BreadcrumbProps> & {
    Item: ComponentType<BreadcrumbItemProps>;
  };
  export default Breadcrumb;
}

declare module '@semi-v2.102.0/pagination' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface PaginationProps {
    children?: ReactNode;
    className?: string;
    currentPage?: number;
    defaultCurrentPage?: number;
    disabled?: boolean;
    hideOnSinglePage?: boolean;
    hoverShowPageSelect?: boolean;
    nextText?: ReactNode;
    onChange?: (currentPage: number, pageSize: number) => void;
    onPageChange?: (currentPage: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSize?: number;
    pageSizeOpts?: number[];
    popoverPosition?: string;
    popoverZIndex?: number;
    preventPageChangeOnPageSizeChange?: boolean;
    prevText?: ReactNode;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
    showTotal?: boolean;
    size?: 'small' | 'default';
    style?: CSSProperties;
    total?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Pagination: ComponentType<PaginationProps>;
  export default Pagination;
}

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

declare module '@semi-v2.102.0/icon-button' {
  import type { ComponentType } from 'react';
  import type { ButtonProps } from '@semi-v2.102.0/button';

  export type HorizontalPaddingType = 'left' | 'right';
  export type IconButtonProps = ButtonProps;

  const IconButton: ComponentType<IconButtonProps>;
  export default IconButton;
}

declare module '@semi-v2.102.0/code-highlight' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface CodeHighlightProps {
    className?: string;
    code: string;
    defaultTheme?: boolean;
    language: string;
    lineNumber?: boolean;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const CodeHighlight: ComponentType<CodeHighlightProps>;
  export default CodeHighlight;
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

declare module '@semi-v2.102.0/rating' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface RatingProps {
    'aria-label'?: string;
    allowClear?: boolean;
    allowHalf?: boolean;
    autoFocus?: boolean;
    character?: ReactNode;
    className?: string;
    count?: number;
    defaultValue?: number;
    disabled?: boolean;
    onChange?: (value: number) => void;
    onHoverChange?: (value: number | undefined) => void;
    preventScroll?: boolean;
    size?: 'small' | 'default' | number;
    style?: CSSProperties;
    tooltips?: string[];
    value?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const Rating: ComponentType<RatingProps>;
  export default Rating;
}

declare module '@semi-v2.102.0/slider' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export type SliderValue = number | number[];
  export interface SliderProps {
    'aria-label'?: string;
    className?: string;
    defaultValue?: SliderValue;
    disabled?: boolean;
    handleDot?: { color?: string; size?: string } | Array<{ color?: string; size?: string }>;
    included?: boolean;
    marks?: Record<number, string>;
    max?: number;
    min?: number;
    onAfterChange?: (value: SliderValue) => void;
    onChange?: (value: SliderValue) => void;
    range?: boolean;
    showBoundary?: boolean;
    step?: number;
    style?: CSSProperties;
    tipFormatter?: ((value: string | number | boolean | null) => ReactNode) | null;
    tooltipVisible?: boolean;
    value?: SliderValue;
    vertical?: boolean;
    verticalReverse?: boolean;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const Slider: ComponentType<SliderProps>;
  export default Slider;
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
    getPopupContainer?: () => HTMLElement;
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

declare module '@semi-v2.102.0/tag-input' {
  import type { ComponentType, CSSProperties, FocusEvent, KeyboardEvent, ReactNode } from 'react';

  export interface TagInputProps {
    'aria-label'?: string;
    addOnBlur?: boolean;
    allowDuplicates?: boolean;
    autoFocus?: boolean;
    className?: string;
    clearIcon?: ReactNode;
    defaultValue?: string[];
    disabled?: boolean;
    draggable?: boolean;
    expandRestTagsOnClick?: boolean;
    inputValue?: string;
    insetLabel?: ReactNode;
    insetLabelId?: string;
    max?: number;
    maxLength?: number;
    maxTagCount?: number;
    onAdd?: (value: string[]) => void;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string[]) => void;
    onExceed?: (value: string[]) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onInputChange?: (value: string, event: Event) => void;
    onInputExceed?: (value: string) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onRemove?: (value: string, index: number) => void;
    placeholder?: string;
    prefix?: ReactNode;
    separator?: string | string[] | null;
    showClear?: boolean;
    showContentTooltip?: boolean | Record<string, unknown>;
    showRestTagsPopover?: boolean;
    size?: 'small' | 'default' | 'large';
    style?: CSSProperties;
    suffix?: ReactNode;
    validateStatus?: 'default' | 'warning' | 'error';
    value?: string[];
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const TagInput: ComponentType<TagInputProps>;
  export default TagInput;
}

declare module '@semi-v2.102.0/time-picker' {
  import type { ComponentType, CSSProperties, FocusEvent, MouseEvent } from 'react';

  export type TimePickerBaseValue = string | number | Date | undefined;
  export interface TimePickerProps {
    className?: string;
    defaultOpen?: boolean;
    defaultValue?: TimePickerBaseValue | TimePickerBaseValue[];
    disabled?: boolean;
    format?: string;
    minuteStep?: number;
    motion?: boolean;
    onBlur?: (event: FocusEvent<HTMLInputElement> | MouseEvent) => void;
    onChange?: (date: Date | Date[] | undefined, value: string | string[]) => void;
    onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    placeholder?: string;
    scrollItemProps?: { cycled?: boolean; mode?: 'normal' | 'wheel'; motion?: boolean };
    showClear?: boolean;
    size?: 'small' | 'default' | 'large';
    style?: CSSProperties;
    type?: 'time' | 'timeRange';
    use12Hours?: boolean;
    validateStatus?: 'default' | 'warning' | 'error';
    value?: TimePickerBaseValue | TimePickerBaseValue[];
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const TimePicker: ComponentType<TimePickerProps>;
  export default TimePicker;
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
  export const IconChevronRight: BuiltinIcon;
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

declare module '@semi-v2.102.0/steps' {
  import type { ComponentType, CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';

  export type StepsType = 'fill' | 'basic' | 'nav';
  export type StepsDirection = 'horizontal' | 'vertical';
  export type StepsStatus = 'wait' | 'process' | 'finish' | 'error' | 'warning';
  export type StepsSize = 'default' | 'small';

  export interface StepProps {
    'aria-label'?: string;
    className?: string;
    description?: ReactNode;
    icon?: ReactNode;
    onClick?: (event: MouseEvent<HTMLDivElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
    role?: string;
    status?: StepsStatus;
    style?: CSSProperties;
    title?: ReactNode;
  }

  export interface StepsProps {
    'aria-label'?: string;
    children?: ReactNode;
    className?: string;
    current?: number;
    direction?: StepsDirection;
    hasLine?: boolean;
    initial?: number;
    onChange?: (current: number) => void;
    prefixCls?: string;
    size?: StepsSize;
    status?: StepsStatus;
    style?: CSSProperties;
    type?: StepsType;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  type StepsComponent = ComponentType<StepsProps> & { Step: ComponentType<StepProps> };
  const Steps: StepsComponent;
  export default Steps;
}

declare module '@semi-v2.102.0/tabs' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export type TabType = 'line' | 'card' | 'button' | 'slash';
  export type TabSize = 'small' | 'medium' | 'large';
  export type TabPosition = 'top' | 'left';

  export interface PlainTab {
    disabled?: boolean;
    icon?: ReactNode;
    itemKey: string;
    tab?: ReactNode;
    closable?: boolean;
  }

  export interface TabPaneProps extends PlainTab {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    tabIndex?: number;
  }

  export interface TabsProps {
    activeKey?: string;
    children?: ReactNode;
    className?: string;
    collapsible?: boolean | 'auto';
    contentStyle?: CSSProperties;
    defaultActiveKey?: string;
    keepDOM?: boolean;
    lazyRender?: boolean;
    more?: number | { count: number; render?: () => ReactNode };
    onChange?: (activeKey: string) => void;
    onTabClick?: (activeKey: string, event: MouseEvent<Element>) => void;
    onTabClose?: (tabKey: string) => void;
    showRestInDropdown?: boolean;
    size?: TabSize;
    style?: CSSProperties;
    tabBarClassName?: string;
    tabBarExtraContent?: ReactNode;
    tabBarStyle?: CSSProperties;
    tabList?: PlainTab[];
    tabPaneMotion?: boolean;
    tabPosition?: TabPosition;
    type?: TabType;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface TabItemProps extends PlainTab {
    selected?: boolean;
    size?: TabSize;
    tabPosition?: TabPosition;
    type?: TabType;
  }

  type TabsComponent = ComponentType<TabsProps> & {
    TabPane: ComponentType<TabPaneProps>;
    TabItem: ComponentType<TabItemProps>;
  };
  const Tabs: TabsComponent;
  export const TabPane: ComponentType<TabPaneProps>;
  export default Tabs;
}

declare module '@semi-v2.102.0/tree' {
  import type { ComponentType, ReactNode } from 'react';

  export interface TreeNodeData {
    key: string;
    value?: string | number;
    label?: ReactNode;
    disabled?: boolean;
    isLeaf?: boolean;
    children?: TreeNodeData[];
  }

  export interface TreeProps {
    children?: ReactNode;
    className?: string;
    defaultExpandAll?: boolean;
    defaultExpandedKeys?: string[];
    defaultValue?: unknown;
    directory?: boolean;
    filterTreeNode?: boolean;
    multiple?: boolean;
    onChange?: (value?: unknown) => void;
    showLine?: boolean;
    treeData?: TreeNodeData[];
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Tree: ComponentType<TreeProps>;
  export default Tree;
}

declare module 'virtual:semi-reference-styles.css';

declare module '@semi-v2.102.0/carousel' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export interface ArrowButton {
    children?: ReactNode;
    props?: HTMLAttributes<HTMLDivElement>;
  }
  export interface CarouselProps {
    'aria-label'?: string;
    activeIndex?: number;
    animation?: 'slide' | 'fade';
    arrowProps?: { leftArrow?: ArrowButton; rightArrow?: ArrowButton };
    autoPlay?: boolean | { interval?: number; hoverToPause?: boolean };
    arrowType?: 'always' | 'hover';
    children?: ReactNode;
    className?: string;
    defaultActiveIndex?: number;
    indicatorPosition?: 'left' | 'center' | 'right';
    indicatorSize?: 'small' | 'medium';
    indicatorType?: 'columnar' | 'line' | 'dot';
    onChange?: (activeIndex: number, preIndex: number) => void;
    showArrow?: boolean;
    showIndicator?: boolean;
    slideDirection?: 'left' | 'right';
    speed?: number;
    style?: CSSProperties;
    theme?: 'dark' | 'primary' | 'light';
    trigger?: 'click' | 'hover';
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const Carousel: ComponentType<CarouselProps>;
  export default Carousel;
}

declare module '@semi-v2.102.0/collapsible' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface CollapsibleProps {
    children?: ReactNode;
    className?: string;
    collapseHeight?: number;
    collapseHeightAdaptive?: boolean;
    duration?: number;
    fade?: boolean;
    id?: string;
    isOpen?: boolean;
    keepDOM?: boolean;
    lazyRender?: boolean;
    motion?: boolean;
    onMotionEnd?: () => void;
    reCalcKey?: number | string;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Collapsible: ComponentType<CollapsibleProps>;
  export default Collapsible;
}

declare module '@semi-v2.102.0/collapse' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export type CollapseActiveKey = string | string[];

  export interface CollapsePanelProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    extra?: ReactNode;
    header?: ReactNode;
    itemKey: string;
    onMotionEnd?: () => void;
    reCalcKey?: number | string;
    showArrow?: boolean;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface CollapseProps {
    activeKey?: CollapseActiveKey;
    accordion?: boolean;
    children?: ReactNode;
    className?: string;
    clickHeaderToExpand?: boolean;
    collapseIcon?: ReactNode;
    defaultActiveKey?: CollapseActiveKey;
    expandIcon?: ReactNode;
    expandIconPosition?: 'left' | 'right';
    keepDOM?: boolean;
    lazyRender?: boolean;
    motion?: boolean;
    onChange?: (activeKey: CollapseActiveKey, event: MouseEvent) => void;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Collapse: ComponentType<CollapseProps> & {
    Panel: ComponentType<CollapsePanelProps>;
  };
  export default Collapse;
}

declare module '@semi-v2.102.0/descriptions' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface DescriptionsDataItem {
    key?: ReactNode;
    value?: ReactNode | (() => ReactNode);
    hidden?: boolean;
    span?: number;
    keyStyle?: CSSProperties;
  }

  export interface DescriptionsItemProps {
    children?: ReactNode | (() => ReactNode);
    className?: string;
    hidden?: boolean;
    itemKey?: ReactNode;
    keyStyle?: CSSProperties;
    span?: number;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface DescriptionsProps {
    align?: 'center' | 'justify' | 'left' | 'plain';
    children?: ReactNode;
    className?: string;
    column?: number;
    data?: DescriptionsDataItem[];
    layout?: 'horizontal' | 'vertical';
    row?: boolean;
    size?: 'small' | 'medium' | 'large';
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Descriptions: ComponentType<DescriptionsProps> & {
    Item: ComponentType<DescriptionsItemProps>;
  };
  export default Descriptions;
}

declare module '@semi-v2.102.0/dropdown' {
  import type { ComponentType, CSSProperties, MouseEventHandler, ReactNode } from 'react';

  export interface DropdownItemProps {
    active?: boolean;
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLLIElement>;
    style?: CSSProperties;
    type?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
  }

  export interface DropdownProps {
    children?: ReactNode;
    className?: string;
    contentClassName?: string;
    getPopupContainer?: () => HTMLElement;
    motion?: boolean;
    position?: string;
    render?: ReactNode;
    showTick?: boolean;
    trigger?: 'hover' | 'focus' | 'click' | 'custom' | 'contextMenu';
    visible?: boolean;
  }

  const Dropdown: ComponentType<DropdownProps> & {
    Divider: ComponentType<{ className?: string; style?: CSSProperties }>;
    Item: ComponentType<DropdownItemProps>;
    Menu: ComponentType<{ children?: ReactNode; className?: string; style?: CSSProperties }>;
    Title: ComponentType<{ children?: ReactNode; className?: string; style?: CSSProperties }>;
  };
  export default Dropdown;
}
declare module '@semi-v2.102.0/empty' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface EmptySvgNode {
    id?: string;
    viewBox?: string;
    url?: string;
  }

  export interface EmptyProps {
    children?: ReactNode;
    className?: string;
    darkModeImage?: ReactNode | EmptySvgNode;
    description?: ReactNode;
    image?: ReactNode | EmptySvgNode;
    imageStyle?: CSSProperties;
    layout?: 'vertical' | 'horizontal';
    style?: CSSProperties;
    title?: ReactNode;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Empty: ComponentType<EmptyProps>;
  export default Empty;
}

declare module '@semi-v2.102.0/highlight' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface HighlightSearchWord {
    text: string;
    className?: string;
    style?: CSSProperties;
  }

  export interface HighlightProps {
    autoEscape?: boolean;
    caseSensitive?: boolean;
    component?: string;
    highlightClassName?: string;
    highlightStyle?: CSSProperties;
    searchWords?: Array<string | HighlightSearchWord | undefined>;
    sourceString?: string;
  }

  const Highlight: ComponentType<HighlightProps>;
  export default Highlight;
}

declare module '@semi-v2.102.0/image' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface ImagePreviewOptions {
    previewTitle?: ReactNode;
    src?: string;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
  }

  export interface ImageProps {
    alt?: string;
    className?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    fallback?: ReactNode;
    height?: string | number;
    preview?: boolean | ImagePreviewOptions;
    src?: string;
    style?: CSSProperties;
    width?: string | number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface PreviewProps {
    children?: ReactNode;
    className?: string;
    currentIndex?: number;
    defaultCurrentIndex?: number;
    defaultVisible?: boolean;
    lazyLoad?: boolean;
    src?: string | string[];
    visible?: boolean;
  }

  const Image: ComponentType<ImageProps>;
  export const Preview: ComponentType<PreviewProps>;
  export default Image;
}

declare module '@semi-v2.102.0/illustrations' {
  import type { ComponentType, SVGProps } from 'react';

  type IllustrationComponent = ComponentType<SVGProps<SVGSVGElement>>;

  export const IllustrationConstruction: IllustrationComponent;
  export const IllustrationConstructionDark: IllustrationComponent;
  export const IllustrationFailure: IllustrationComponent;
  export const IllustrationFailureDark: IllustrationComponent;
  export const IllustrationIdle: IllustrationComponent;
  export const IllustrationIdleDark: IllustrationComponent;
  export const IllustrationNoAccess: IllustrationComponent;
  export const IllustrationNoAccessDark: IllustrationComponent;
  export const IllustrationNoContent: IllustrationComponent;
  export const IllustrationNoContentDark: IllustrationComponent;
  export const IllustrationNoResult: IllustrationComponent;
  export const IllustrationNoResultDark: IllustrationComponent;
  export const IllustrationNotFound: IllustrationComponent;
  export const IllustrationNotFoundDark: IllustrationComponent;
  export const IllustrationSuccess: IllustrationComponent;
  export const IllustrationSuccessDark: IllustrationComponent;
}

declare module '@semi-v2.102.0/calendar' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export type CalendarMode = 'day' | 'week' | 'month' | 'range';
  export interface EventObject {
    key: string;
    allDay?: boolean;
    start?: Date;
    end?: Date;
    children?: ReactNode;
  }
  export interface CalendarProps {
    className?: string;
    displayValue?: Date;
    events?: EventObject[];
    header?: ReactNode;
    height?: number | string;
    markWeekend?: boolean;
    minEventHeight?: number;
    mode?: CalendarMode;
    onClick?: (event: MouseEvent, date: Date) => void;
    onClose?: (event: MouseEvent | null) => void;
    onMoreClick?: (event: MouseEvent, date: Date, remaining: number) => void;
    range?: Date[];
    scrollTop?: number;
    showCurrTime?: boolean;
    style?: CSSProperties;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    width?: number | string;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const Calendar: ComponentType<CalendarProps>;
  export default Calendar;
}

declare module '@semi-v2.102.0/card' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface CardMetaProps {
    avatar?: ReactNode;
    className?: string;
    description?: ReactNode;
    style?: CSSProperties;
    title?: ReactNode;
  }

  export interface CardProps {
    'aria-label'?: string;
    actions?: ReactNode[];
    bodyStyle?: CSSProperties;
    bordered?: boolean;
    children?: ReactNode;
    className?: string;
    cover?: ReactNode;
    footer?: ReactNode;
    footerLine?: boolean;
    footerStyle?: CSSProperties;
    header?: ReactNode;
    headerExtraContent?: ReactNode;
    headerLine?: boolean;
    headerStyle?: CSSProperties;
    loading?: boolean;
    shadows?: 'hover' | 'always';
    style?: CSSProperties;
    title?: ReactNode;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Card: ComponentType<CardProps> & { Meta: ComponentType<CardMetaProps> };
  export default Card;
}

declare module '@semi-v2.102.0/card-group' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface CardGroupProps {
    children?: ReactNode;
    className?: string;
    spacing?: number | number[];
    style?: CSSProperties;
    type?: 'grid';
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const CardGroup: ComponentType<CardGroupProps>;
  export default CardGroup;
}
declare module '@semi-v2.102.0/cropper' {
  import type { ComponentType, CSSProperties, ImgHTMLAttributes, RefAttributes } from 'react';

  export interface CropperMethods {
    getCropperCanvas(): HTMLCanvasElement;
  }

  export interface CropperProps extends RefAttributes<CropperMethods> {
    aspectRatio?: number;
    className?: string;
    cropperBoxClassName?: string;
    cropperBoxCls?: string;
    cropperBoxStyle?: CSSProperties;
    defaultAspectRatio?: number;
    fill?: string;
    imgProps?: ImgHTMLAttributes<HTMLImageElement>;
    maxZoom?: number;
    minZoom?: number;
    onZoomChange?: (zoom: number) => void;
    preview?: () => HTMLElement;
    rotate?: number;
    shape?: 'rect' | 'round' | 'roundRect';
    showResizeBox?: boolean;
    src?: string;
    style?: CSSProperties;
    zoom?: number;
    zoomStep?: number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Cropper: ComponentType<CropperProps>;
  export default Cropper;
}

declare module '@semi-v2.102.0/list' {
  import type {
    ComponentType,
    CSSProperties,
    MouseEventHandler,
    ReactElement,
    ReactNode,
  } from 'react';

  export interface ListGrid {
    align?: 'top' | 'middle' | 'bottom';
    gutter?: number;
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
    span?: number;
    xs?: number | { span?: number };
    sm?: number | { span?: number };
    md?: number | { span?: number };
    lg?: number | { span?: number };
    xl?: number | { span?: number };
    xxl?: number | { span?: number };
  }

  export interface ListItemProps {
    align?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    children?: ReactNode;
    className?: string;
    extra?: ReactNode;
    header?: ReactNode;
    main?: ReactNode;
    onClick?: MouseEventHandler<HTMLLIElement>;
    onMouseEnter?: MouseEventHandler<HTMLLIElement>;
    onMouseLeave?: MouseEventHandler<HTMLLIElement>;
    onRightClick?: MouseEventHandler<HTMLLIElement>;
    style?: CSSProperties;
  }

  export interface ListProps<T = unknown> {
    bordered?: boolean;
    children?: ReactNode;
    className?: string;
    dataSource?: T[];
    emptyContent?: ReactNode;
    footer?: ReactNode;
    grid?: ListGrid;
    header?: ReactNode;
    layout?: 'vertical' | 'horizontal';
    loading?: boolean;
    loadMore?: ReactNode;
    onClick?: MouseEventHandler<HTMLLIElement>;
    onRightClick?: MouseEventHandler<HTMLLIElement>;
    renderItem?: (item: T, index: number) => ReactNode;
    size?: 'small' | 'default' | 'large';
    split?: boolean;
    style?: CSSProperties;
  }

  interface ListComponent {
    <T>(props: ListProps<T>): ReactElement | null;
    Item: ComponentType<ListItemProps>;
  }

  const List: ListComponent;
  export default List;
}

declare module '@semi-v2.102.0/modal' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export interface ModalProps {
    cancelText?: string;
    centered?: boolean;
    children?: ReactNode;
    className?: string;
    closable?: boolean;
    closeOnEsc?: boolean;
    direction?: 'ltr' | 'rtl';
    footer?: ReactNode;
    fullScreen?: boolean;
    hasCancel?: boolean;
    keepDOM?: boolean;
    mask?: boolean;
    maskClosable?: boolean;
    motion?: boolean;
    okText?: string;
    onCancel?: (event: MouseEvent) => void | Promise<unknown>;
    onOk?: (event: MouseEvent) => void | Promise<unknown>;
    size?: 'small' | 'medium' | 'large' | 'full-width';
    style?: CSSProperties;
    title?: ReactNode;
    visible?: boolean;
    width?: string | number;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  const Modal: ComponentType<ModalProps>;
  export default Modal;
}

declare module '@semi-v2.102.0/table' {
  import type { ComponentType, ReactNode } from 'react';

  export interface TableColumnProps<RecordType = Record<string, unknown>> {
    dataIndex?: string;
    key?: string | number;
    render?: (value: unknown, record: RecordType, index: number) => ReactNode;
    title?: ReactNode;
    width?: string | number;
  }

  export interface TableProps<RecordType = Record<string, unknown>> {
    bordered?: boolean;
    columns?: TableColumnProps<RecordType>[];
    dataSource?: RecordType[];
    direction?: 'ltr' | 'rtl';
    pagination?: boolean | Record<string, unknown>;
    rowSelection?: { selectedRowKeys?: (string | number)[]; width?: string | number };
    scroll?: { x?: string | number; y?: string | number };
    size?: 'small' | 'default' | 'middle';
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  type TableComponent = ComponentType<TableProps> & {
    Column: ComponentType<TableColumnProps>;
  };

  const Table: TableComponent;
  export default Table;
}

declare module '@semi-v2.102.0/tag' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';
  export interface TagProps {
    children?: ReactNode;
    className?: string;
    closable?: boolean;
    color?:
      | 'grey'
      | 'red'
      | 'pink'
      | 'purple'
      | 'violet'
      | 'indigo'
      | 'blue'
      | 'light-blue'
      | 'cyan'
      | 'teal'
      | 'green'
      | 'light-green'
      | 'lime'
      | 'yellow'
      | 'amber'
      | 'orange'
      | 'white';
    shape?: 'square' | 'circle';
    size?: 'default' | 'small' | 'large';
    style?: CSSProperties;
    tagKey?: string | number;
    type?: 'light' | 'solid' | 'ghost';
    visible?: boolean;
    onClose?: (content: ReactNode, event: MouseEvent<HTMLElement>, tagKey: string | number) => void;
  }
  const Tag: ComponentType<TagProps>;
  export default Tag;
}

declare module '@semi-v2.102.0/timeline' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export interface TimelineItemProps {
    children?: ReactNode;
    className?: string;
    color?: string;
    dot?: ReactNode;
    extra?: ReactNode;
    position?: 'left' | 'right';
    style?: CSSProperties;
    time?: ReactNode;
    type?: 'default' | 'ongoing' | 'success' | 'warning' | 'error';
    onClick?: (event: MouseEvent<HTMLLIElement>) => void;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  export interface TimelineData extends TimelineItemProps {
    content: ReactNode;
  }

  export interface TimelineProps {
    'aria-label'?: string;
    children?: ReactNode;
    className?: string;
    dataSource?: TimelineData[];
    mode?: 'left' | 'right' | 'center' | 'alternate';
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }

  type TimelineComponent = ComponentType<TimelineProps> & {
    Item: ComponentType<TimelineItemProps>;
  };

  const Timeline: TimelineComponent;
  export default Timeline;
}

declare module '@semi-v2.102.0/tag-group' {
  import type { ComponentType } from 'react';
  import type { TagProps } from '@semi-v2.102.0/tag';
  interface TagGroupProps {
    maxTagCount?: number;
    restCount?: number;
    showPopover?: boolean;
    tagList: TagProps[];
  }
  const TagGroup: ComponentType<TagGroupProps>;
  export default TagGroup;
}

declare module '@semi-v2.102.0/split-tag-group' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';
  interface SplitTagGroupProps {
    'aria-label'?: string;
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
  const SplitTagGroup: ComponentType<SplitTagGroupProps>;
  export default SplitTagGroup;
}

declare module '@semi-v2.102.0/popconfirm' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  interface PopconfirmProps {
    cancelText?: string;
    cancelType?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
    children?: ReactNode;
    className?: string;
    content?: ReactNode;
    getPopupContainer?: () => HTMLElement;
    motion?: boolean;
    okText?: string;
    okType?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
    position?:
      | 'top'
      | 'topLeft'
      | 'topRight'
      | 'bottom'
      | 'bottomLeft'
      | 'bottomRight'
      | 'left'
      | 'leftTop'
      | 'leftBottom'
      | 'right'
      | 'rightTop'
      | 'rightBottom';
    showArrow?: boolean;
    showCloseIcon?: boolean;
    style?: CSSProperties;
    title?: ReactNode;
    trigger?: 'hover' | 'focus' | 'click' | 'custom';
    visible?: boolean;
    onCancel?: (event: MouseEvent) => void | Promise<unknown>;
    onConfirm?: (event: MouseEvent) => void | Promise<unknown>;
    onVisibleChange?: (visible: boolean) => void;
  }

  const Popconfirm: ComponentType<PopconfirmProps>;
  export default Popconfirm;
}
declare module '@semi-v2.102.0/tree-select' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface TreeSelectNodeData {
    children?: TreeSelectNodeData[];
    disabled?: boolean;
    key?: string;
    label?: ReactNode;
    value?: string | number;
  }

  export interface TreeSelectProps {
    [key: `data-${string}`]: string | number | boolean | undefined;
    defaultExpandAll?: boolean;
    defaultOpen?: boolean;
    defaultValue?: string | number | object | Array<string | number | object>;
    filterTreeNode?:
      boolean | ((input: string, label: string, node?: TreeSelectNodeData) => boolean);
    motion?: boolean;
    motionExpand?: boolean;
    placeholder?: string;
    showClear?: boolean;
    style?: CSSProperties;
    treeData?: TreeSelectNodeData[];
  }

  const TreeSelect: ComponentType<TreeSelectProps>;
  export default TreeSelect;
}

declare module '@semi-v2.102.0/color-picker' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface ColorValue {
    hsva: { h: number; s: number; v: number; a: number };
    rgba: { r: number; g: number; b: number; a: number };
    hex: string;
  }

  export interface ColorPickerProps {
    alpha?: boolean;
    bottomSlot?: ReactNode;
    className?: string;
    defaultFormat?: 'hex' | 'rgba' | 'hsva';
    defaultValue?: ColorValue;
    eyeDropper?: boolean;
    height?: number;
    onChange?: (value: ColorValue) => void;
    popoverProps?: Record<string, unknown>;
    style?: CSSProperties;
    topSlot?: ReactNode;
    usePopover?: boolean;
    value?: ColorValue;
    width?: number;
    children?: ReactNode;
  }

  const ColorPicker: ComponentType<ColorPickerProps> & {
    colorStringToValue(raw: string): ColorValue;
  };
  export default ColorPicker;
}

declare module '@semi-v2.102.0/date-picker' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface DatePickerProps {
    className?: string;
    defaultPickerValue?: Date | Date[];
    defaultValue?: Date | Date[];
    dropdownClassName?: string;
    dropdownStyle?: CSSProperties;
    motion?: boolean;
    onChange?: (date: Date | Date[] | undefined, dateString: string | string[] | undefined) => void;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    position?: 'bottomLeft' | 'bottomRight';
    prefix?: ReactNode;
    style?: CSSProperties;
    type?: 'date' | 'dateRange' | 'dateTime' | 'dateTimeRange' | 'month' | 'monthRange' | 'year';
  }

  const DatePicker: ComponentType<DatePickerProps>;
  export default DatePicker;
}

declare module '@semi-v2.102.0/form' {
  import type { ComponentType, ReactNode } from 'react';

  interface RuleItem {
    message?: string;
    required?: boolean;
  }

  interface FormFieldProps {
    [key: `data-${string}`]: string | number | boolean | undefined;
    field: string;
    helpText?: ReactNode;
    initValue?: unknown;
    label?: ReactNode;
    placeholder?: string;
    rules?: RuleItem[];
  }

  interface FormProps {
    children?: ReactNode;
    className?: string;
  }

  export const Form: ComponentType<FormProps> & {
    Input: ComponentType<FormFieldProps>;
  };
}

declare module '@semi-v2.102.0/cascader' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface CascaderData {
    children?: CascaderData[];
    disabled?: boolean;
    isLeaf?: boolean;
    label?: ReactNode;
    value?: string | number;
  }

  export interface CascaderProps {
    [key: `aria-${string}`]: string | number | boolean | undefined;
    [key: `data-${string}`]: string | number | boolean | undefined;
    defaultOpen?: boolean;
    defaultValue?: string | number | Array<string | number> | Array<Array<string | number>>;
    filterTreeNode?:
      boolean | ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean);
    motion?: boolean;
    placeholder?: string;
    showClear?: boolean;
    style?: CSSProperties;
    treeData?: CascaderData[];
  }

  const Cascader: ComponentType<CascaderProps>;
  export default Cascader;
}

declare module '@semi-v2.102.0/navigation' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  interface NavigationItem {
    disabled?: boolean;
    itemKey: string | number;
    items?: NavigationItem[];
    text?: ReactNode;
  }

  interface NavigationProps {
    [key: `data-${string}`]: string | number | boolean | undefined;
    bodyStyle?: CSSProperties;
    defaultOpenKeys?: Array<string | number>;
    defaultSelectedKeys?: Array<string | number>;
    footer?: { collapseButton?: boolean };
    header?: { text?: ReactNode };
    items?: NavigationItem[];
  }

  const Navigation: ComponentType<NavigationProps>;
  export default Navigation;
}

declare module '@semi-v2.102.0/drag-move' {
  import type { ComponentType, ReactElement } from 'react';

  export interface DragMoveProps {
    allowInputDrag?: boolean;
    allowMove?: (event: MouseEvent | TouchEvent, element: HTMLElement) => boolean;
    children: ReactElement;
    constrainer?: 'parent' | (() => HTMLElement | null);
    customMove?: (element: HTMLElement, top: number, left: number) => void;
    handler?: () => HTMLElement | null;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
    onTouchCancel?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onTouchMove?: (event: TouchEvent) => void;
    onTouchStart?: (event: TouchEvent) => void;
    positionStrategy?: 'absolute' | 'relative';
  }

  const DragMove: ComponentType<DragMoveProps>;
  export default DragMove;
}

declare module '@semi-v2.102.0/hot-keys' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface HotKeysProps {
    [key: `data-${string}`]: string | number | boolean | undefined;
    className?: string;
    content?: string[];
    getListenerTarget?: () => HTMLElement;
    hotKeys?: string[];
    mergeMetaCtrl?: boolean;
    onClick?: () => void;
    onHotKey?: (event: KeyboardEvent) => void;
    preventDefault?: boolean;
    render?: (() => ReactNode) | ReactNode;
    style?: CSSProperties;
  }

  interface HotKeysKeyConstants extends Readonly<Record<string, string>> {
    Alt: string;
    ArrowDown: string;
    Control: string;
    Enter: string;
    K: string;
    Meta: string;
    R: string;
    Shift: string;
  }

  const HotKeys: ComponentType<HotKeysProps> & { Keys: HotKeysKeyConstants };
  export default HotKeys;
}

declare module '@semi-v2.102.0/lottie' {
  import type { AnimationItem, LottiePlayer } from 'lottie-web';
  import type { ComponentType, CSSProperties } from 'react';

  export type LottieAnimationItem = AnimationItem;

  export interface LottieProps {
    [key: `data-${string}`]: string | number | boolean | undefined;
    className?: string;
    getAnimationInstance?: (animation: AnimationItem | null) => void;
    getLottie?: (lottie: LottiePlayer) => void;
    height?: string;
    params: Record<string, unknown> & { container?: Element };
    style?: CSSProperties;
    width?: string;
  }

  const Lottie: ComponentType<LottieProps> & { getLottie: () => LottiePlayer };
  export default Lottie;
}

declare module '@semi-v2.102.0/audio-player' {
  import type { ComponentType, HTMLAttributes } from 'react';

  export interface AudioInfo {
    title?: string;
    cover?: string;
    src: string;
  }

  export interface AudioPlayerProps extends HTMLAttributes<HTMLDivElement> {
    audioUrl: string | AudioInfo | Array<string | AudioInfo>;
    autoPlay?: boolean;
    showToolbar?: boolean;
    skipDuration?: number;
    theme?: 'dark' | 'light';
  }

  const AudioPlayer: ComponentType<AudioPlayerProps>;
  export default AudioPlayer;
}

declare module '@semi-v2.102.0/video-player' {
  import type { ComponentType, CSSProperties, HTMLAttributes } from 'react';

  export interface VideoPlayerMarker {
    start: number;
    title: string;
  }

  export interface VideoPlayerProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onPlay' | 'onPause'
  > {
    autoPlay?: boolean;
    captionsSrc?: string;
    clickToPlay?: boolean;
    controlsList?: string[];
    crossOrigin?: '' | 'anonymous' | 'use-credentials';
    defaultPlaybackRate?: number;
    defaultQuality?: string;
    defaultRoute?: string;
    height?: number | string;
    loop?: boolean;
    markers?: VideoPlayerMarker[];
    muted?: boolean;
    onPause?: () => void;
    onPlay?: () => void;
    onQualityChange?: (quality: string) => void;
    onRateChange?: (rate: number) => void;
    onRouteChange?: (route: string) => void;
    onVolumeChange?: (volume: number) => void;
    playbackRateList?: Array<{ label: string; value: number }>;
    poster?: string;
    qualityList?: Array<{ label: string; value: string }>;
    routeList?: Array<{ label: string; value: string }>;
    seekTime?: number;
    src?: string;
    style?: CSSProperties;
    theme?: 'dark' | 'light';
    volume?: number;
    width?: number | string;
  }

  const VideoPlayer: ComponentType<VideoPlayerProps>;
  export default VideoPlayer;
}

declare module '@semi-v2.102.0/json-viewer' {
  import type { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react';

  export interface JsonViewerSearchControls {
    showSearchBar: boolean;
    onToggleSearchBar(): void;
    onSearch(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean): void;
    onPrevSearch(): void;
    onNextSearch(): void;
    onReplace(text: string): void;
    onReplaceAll(text: string): void;
  }

  export interface JsonViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    className?: string;
    height?: number | string;
    limitSearchButtonBounds?: boolean;
    onChange?: (value: string) => void;
    options?: Record<string, unknown>;
    renderSearchButton?: (button: ReactNode, controls: JsonViewerSearchControls) => ReactNode;
    showSearch?: boolean;
    style?: CSSProperties;
    value?: string;
    width?: number | string;
  }

  const JsonViewer: ComponentType<JsonViewerProps>;
  export default JsonViewer;
}

declare module '@semi-v2.102.0/ai-chat-input' {
  import type { ComponentType, ReactNode } from 'react';

  export interface AIChatInputReference {
    id: string;
    type: string;
    [key: string]: unknown;
  }

  export interface AIChatInputProps {
    defaultContent?: string | Record<string, unknown>;
    placeholder?: string;
    references?: AIChatInputReference[];
    skills?: Array<{ value?: string; label?: string; hasTemplate?: boolean }>;
    skillHotKey?: string;
    suggestions?: Array<string | string[] | { content: string }>;
    uploadProps?: Record<string, unknown>;
    children?: ReactNode;
  }

  const AIChatInput: ComponentType<AIChatInputProps>;
  export default AIChatInput;
}

declare module '@semi-v2.102.0/chat' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface ChatMessage {
    id?: string | number;
    role?: string;
    content?: string;
    status?: 'loading' | 'incomplete' | 'complete' | 'error';
  }
  export interface ChatProps {
    align?: 'leftRight' | 'leftAlign';
    mode?: 'bubble' | 'noBubble' | 'userBubble';
    chats?: ChatMessage[];
    hints?: string[];
    roleConfig?: Record<string, { name?: string; avatar?: ReactNode; color?: string }>;
    chatBoxRenderConfig?: Record<string, unknown>;
    renderHintBox?: (props: {
      content: string;
      index: number;
      onHintClick: () => void;
    }) => ReactNode;
    enableUpload?: boolean;
    showClearContext?: boolean;
    style?: CSSProperties;
    onChatsChange?: (chats: ChatMessage[]) => void;
    onMessageSend?: (content: string, attachment: unknown[]) => void;
  }
  const Chat: ComponentType<ChatProps>;
  export default Chat;
}

declare module '@semi-v2.102.0/sidebar' {
  import type { ComponentType, CSSProperties, MouseEvent, ReactNode } from 'react';

  export interface SidebarOption {
    icon: ReactNode;
    key: string;
    name: ReactNode;
  }

  export interface SidebarCodeItemProps {
    content?: string;
    isJson?: boolean;
    key?: string;
    language?: string;
    name?: string;
  }

  export interface SidebarCodeContentProps {
    activeKey?: string | string[];
    className?: string;
    codes?: SidebarCodeItemProps[];
    onChange?: (activeKey: string | string[]) => void;
    onExpand?: (event: MouseEvent, code: SidebarCodeItemProps, mode: string) => void;
    style?: CSSProperties;
  }

  export interface SidebarProps {
    activeKey?: string;
    className?: string;
    fileEditable?: boolean;
    mode?: string;
    motion?: boolean;
    onActiveOptionChange?: (event: MouseEvent, activeKey: string) => void;
    options?: SidebarOption[];
    renderMainContent?: (activeKey: string) => ReactNode;
    resizable?: boolean;
    showClose?: boolean;
    style?: CSSProperties;
    title?: ReactNode;
    visible?: boolean;
  }

  const Sidebar: ComponentType<SidebarProps> & {
    CodeContent: ComponentType<SidebarCodeContentProps>;
  };
  export default Sidebar;
}

declare module '@semi-v2.102.0/markdown-render' {
  import type { ComponentType, CSSProperties } from 'react';

  export interface MarkdownRenderProps {
    className?: string;
    components?: Record<string, ComponentType<Record<string, unknown>>>;
    format?: 'md' | 'mdx';
    raw: string;
    rehypePlugins?: unknown[];
    remarkGfm?: boolean;
    remarkPlugins?: unknown[];
    style?: CSSProperties;
    [key: `data-${string}`]: unknown;
  }

  const MarkdownRender: ComponentType<MarkdownRenderProps> & {
    defaultComponents: Record<string, ComponentType<Record<string, unknown>>>;
  };
  export default MarkdownRender;
}

declare module '@semi-v2.102.0/ai-chat-dialogue' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface Message {
    id: string;
    role: string;
    content?: string | unknown[];
    status?: string;
    [key: string]: unknown;
  }
  export interface AIChatDialogueProps {
    chats?: Message[];
    hints?: string[];
    style?: CSSProperties;
    roleConfig: Record<string, { name?: string; avatar?: ReactNode; color?: string }>;
    dialogueRenderConfig?: {
      renderDialogueContent?: (properties: {
        message?: Message;
        className?: string;
        defaultContent?: ReactNode;
      }) => ReactNode;
    };
    onChatsChange?: (chats: Message[]) => void;
  }
  const AIChatDialogue: ComponentType<AIChatDialogueProps>;
  export default AIChatDialogue;
}

declare module '@semi-v2.102.0/user-guide' {
  import type { ComponentType, CSSProperties, ReactNode } from 'react';

  export interface UserGuideButtonProps {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: MouseEvent) => void;
    style?: CSSProperties;
    theme?: 'solid' | 'borderless' | 'light' | 'outline';
    type?: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
  }

  export interface UserGuideStepItem {
    className?: string;
    cover?: ReactNode;
    description?: ReactNode;
    mask?: boolean;
    position?: string;
    showArrow?: boolean;
    spotlightPadding?: number;
    target?: Element | (() => Element | null | undefined);
    theme?: 'default' | 'primary';
    title?: ReactNode;
  }

  export interface UserGuideProps {
    className?: string;
    current?: number;
    finishText?: string;
    getPopupContainer?: () => HTMLElement;
    mask?: boolean;
    mode?: 'popup' | 'modal';
    nextButtonProps?: UserGuideButtonProps;
    onChange?: (current: number) => void;
    onFinish?: () => void;
    onNext?: (current: number) => void;
    onPrev?: (current: number) => void;
    onSkip?: () => void;
    position?: string;
    prevButtonProps?: UserGuideButtonProps;
    showPrevButton?: boolean;
    showSkipButton?: boolean;
    spotlightPadding?: number;
    steps: UserGuideStepItem[];
    style?: CSSProperties;
    theme?: 'default' | 'primary';
    visible?: boolean;
    zIndex?: number;
  }

  const UserGuide: ComponentType<UserGuideProps>;
  export default UserGuide;
}
