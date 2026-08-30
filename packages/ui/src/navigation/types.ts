import type { AnchorHTMLAttributes, HTMLAttributes, StyleValue, VNode, VNodeChild } from 'vue';

import type { DropdownProps } from '../dropdown';

export type ItemKey = string | number;
export type NavigationMode = 'vertical' | 'horizontal';
export type ToggleIconPosition = 'left' | 'right';
export type NavigationContent = VNodeChild | (() => VNodeChild);

export interface NavigationLocale {
  collapseText: string;
  expandText: string;
}

export interface NavItemProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  disabled?: boolean;
  forwardRef?: ((element: HTMLLIElement | null) => void) | undefined;
  icon?: NavigationContent;
  indent?: boolean | number;
  isCollapsed?: boolean;
  isSubNav?: boolean;
  itemKey: ItemKey;
  level?: number;
  link?: string;
  linkOptions?: AnchorHTMLAttributes | undefined;
  style?: StyleValue;
  tabIndex?: number;
  text?: NavigationContent;
  toggleIcon?: NavigationContent;
  tooltipHideDelay?: number;
  tooltipShowDelay?: number;
}

export interface NavItemSelectedData {
  domEvent: MouseEvent | KeyboardEvent;
  itemKey: ItemKey;
  selectedItems?: Array<NavItemProps | SubNavProps>;
  selectedKeys?: ItemKey[];
  text?: NavigationContent;
}

export interface NavItemEmits {
  click: [data: NavItemSelectedData];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}

export interface NavItemSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
  text?: () => VNodeChild;
}

export interface SubNavProps extends Omit<
  NavItemProps,
  'forwardRef' | 'isSubNav' | 'link' | 'linkOptions' | 'tabIndex'
> {
  dropdownProps?: DropdownProps | undefined;
  dropdownStyle?: StyleValue;
  expandIcon?: NavigationContent;
  isOpen?: boolean;
  maxHeight?: number;
  subDropdownProps?: DropdownProps | undefined;
}

export interface SubNavSlots extends NavItemSlots {
  expandIcon?: () => VNodeChild;
}

export interface NavHeaderProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  link?: string;
  linkOptions?: AnchorHTMLAttributes;
  logo?: NavigationContent;
  prefixCls?: string;
  style?: StyleValue;
  text?: NavigationContent;
}

export interface NavHeaderSlots {
  default?: () => VNodeChild;
  logo?: () => VNodeChild;
  text?: () => VNodeChild;
}

export interface NavFooterProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  collapseButton?: boolean | NavigationContent;
  collapseText?: ((collapsed: boolean) => VNodeChild) | undefined;
  style?: StyleValue;
}

export interface NavFooterEmits {
  click: [event: MouseEvent];
}

export interface NavFooterSlots {
  collapseButton?: () => VNodeChild;
  default?: () => VNodeChild;
}

export interface CollapseButtonProps {
  collapseText?: (collapsed: boolean) => VNodeChild;
  isCollapsed?: boolean;
  locale?: NavigationLocale;
  prefixCls?: string;
}

export interface CollapseButtonEmits {
  click: [isCollapsed: boolean];
}

export interface NavigationItemObject extends NavItemProps {
  items?: readonly NavigationItemInput[];
  [key: string]: unknown;
}

export type NavigationItemInput = string | NavigationItemObject;
export type NavigationItems = readonly NavigationItemInput[];

export interface NavigationClickData {
  domEvent?: MouseEvent | KeyboardEvent;
  isOpen?: boolean;
  itemKey?: ItemKey;
  text?: NavigationContent;
}

export interface NavigationOpenChangeData extends NavigationClickData {
  isOpen: boolean;
  itemKey: ItemKey;
  openKeys: ItemKey[];
}

export interface NavigationSelectData extends NavigationClickData {
  domEvent: MouseEvent | KeyboardEvent;
  itemKey: ItemKey;
  selectedItems: Array<NavItemProps | SubNavProps>;
  selectedKeys: ItemKey[];
}

export interface NavigationWrapperData {
  isInSubNav: boolean;
  isSubNav: boolean;
  itemElement: VNode;
  props: NavItemProps | SubNavProps;
}

export interface NavigationProps {
  bodyStyle?: StyleValue;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  defaultIsCollapsed?: boolean;
  defaultOpenKeys?: readonly ItemKey[];
  defaultSelectedKeys?: readonly ItemKey[];
  expandIcon?: NavigationContent;
  footer?: NavigationContent | NavFooterProps;
  getPopupContainer?: () => HTMLElement;
  header?: NavigationContent | NavHeaderProps;
  isCollapsed?: boolean;
  items?: NavigationItems;
  limitIndent?: boolean;
  mode?: NavigationMode;
  multiple?: boolean;
  openKeys?: readonly ItemKey[];
  prefixCls?: string;
  renderWrapper?: (data: NavigationWrapperData) => VNodeChild;
  selectedKeys?: readonly ItemKey[];
  style?: StyleValue;
  subDropdownProps?: DropdownProps;
  subNavCloseDelay?: number;
  subNavMotion?: boolean;
  subNavOpenDelay?: number;
  toggleIconPosition?: ToggleIconPosition;
  tooltipHideDelay?: number;
  tooltipShowDelay?: number;
}

export interface NavigationEmits {
  click: [data: NavigationClickData];
  collapseChange: [isCollapsed: boolean];
  deselect: [data?: unknown];
  openChange: [data: NavigationOpenChangeData];
  select: [data: NavigationSelectData];
  'update:isCollapsed': [isCollapsed: boolean];
  'update:openKeys': [openKeys: ItemKey[]];
  'update:selectedKeys': [selectedKeys: ItemKey[]];
}

export interface NavigationSlots {
  default?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
  itemWrapper?: (data: NavigationWrapperData) => VNodeChild;
}

export interface NavigationState {
  isCollapsed: boolean;
  itemKeysMap: Record<string, ItemKey[]>;
  items: NavigationItemObject[];
  openKeys: ItemKey[];
  selectedKeys: ItemKey[];
}
