import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type {
  TooltipMargin,
  TooltipPosition,
  TooltipProps,
  TooltipSpacing,
  TooltipTrigger,
} from '../tooltip';

export const DROPDOWN_ITEM_TYPES = [
  'primary',
  'secondary',
  'tertiary',
  'warning',
  'danger',
] as const;

export type DropdownItemType = (typeof DROPDOWN_ITEM_TYPES)[number];

export interface DropdownItemProps {
  active?: boolean;
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  forwardRef?: (element: HTMLLIElement | null) => void;
  hover?: boolean;
  icon?: VNodeChild | (() => VNodeChild);
  showTick?: boolean;
  style?: StyleValue;
  type?: DropdownItemType;
}

export interface DropdownItemEmits {
  click: [event: MouseEvent];
  contextmenu: [event: MouseEvent];
  keydown: [event: KeyboardEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}

export interface DropdownItemSlots {
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
}

export interface DropdownMenuProps {
  class?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface DropdownMenuSlots {
  default?: () => VNodeChild;
}

export interface DropdownTitleProps {
  class?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface DropdownTitleSlots {
  default?: () => VNodeChild;
}

export interface DropdownDividerProps {
  class?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface DropdownMenuItemItem extends DropdownItemProps {
  key?: string | number;
  name?: VNodeChild | (() => VNodeChild);
  node: 'item';
  onClick?: (event: MouseEvent) => void;
  onContextmenu?: (event: MouseEvent) => void;
  onKeydown?: (event: KeyboardEvent) => void;
  onMouseenter?: (event: MouseEvent) => void;
  onMouseleave?: (event: MouseEvent) => void;
}

export interface DropdownMenuItemDivider extends DropdownDividerProps {
  key?: string | number;
  node: 'divider';
}

export interface DropdownMenuItemTitle extends DropdownTitleProps {
  key?: string | number;
  name?: VNodeChild | (() => VNodeChild);
  node: 'title';
}

export type DropdownMenuItem =
  DropdownMenuItemItem | DropdownMenuItemDivider | DropdownMenuItemTitle;

export interface DropdownProps extends Omit<
  TooltipProps,
  | 'class'
  | 'content'
  | 'mouseLeaveDelay'
  | 'position'
  | 'prefixCls'
  | 'returnFocusOnClose'
  | 'role'
  | 'showArrow'
  | 'spacing'
  | 'style'
  | 'trigger'
  | 'visible'
  | 'wrapperClassName'
> {
  class?: HTMLAttributes['class'];
  contentClassName?: HTMLAttributes['class'];
  menu?: readonly DropdownMenuItem[];
  mouseLeaveDelay?: number;
  position?: TooltipPosition;
  prefixCls?: string;
  render?: VNodeChild | (() => VNodeChild);
  returnFocusOnClose?: boolean;
  role?: string;
  showArrow?: boolean | VNodeChild;
  showTick?: boolean;
  spacing?: number | TooltipSpacing;
  style?: StyleValue;
  trigger?: TooltipTrigger;
  visible?: boolean;
}

export interface DropdownEmits {
  afterClose: [];
  clickOutside: [event: MouseEvent];
  escKeydown: [event: KeyboardEvent];
  visibleChange: [visible: boolean];
  'update:visible': [visible: boolean];
}

export interface DropdownSlots {
  content?: () => VNodeChild;
  default?: () => VNodeChild;
}

export interface DropdownExposed {
  focusTrigger(): void;
  getPopupId(): string | undefined;
  rePosition(): Record<string, unknown>;
}

export type { TooltipMargin, TooltipPosition, TooltipSpacing, TooltipTrigger };
