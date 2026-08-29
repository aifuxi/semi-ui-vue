import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const SIDE_SHEET_PLACEMENTS = ['top', 'right', 'bottom', 'left'] as const;
export const SIDE_SHEET_SIZES = ['small', 'medium', 'large'] as const;

export type SideSheetPlacement = (typeof SIDE_SHEET_PLACEMENTS)[number];
export type SideSheetSize = (typeof SIDE_SHEET_SIZES)[number];
export type SideSheetCancelEvent = MouseEvent | KeyboardEvent;

export interface SideSheetProps {
  'aria-label'?: string;
  afterVisibleChange?: (visible: boolean) => void;
  bodyStyle?: StyleValue;
  canVerticalSetWidth?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  closable?: boolean;
  closeIcon?: VNodeChild;
  closeOnEsc?: boolean;
  disableScroll?: boolean;
  footer?: VNodeChild;
  getPopupContainer?: () => HTMLElement;
  headerStyle?: StyleValue;
  height?: number | string;
  keepDOM?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  maskStyle?: StyleValue;
  motion?: boolean;
  onCancel?: (event: SideSheetCancelEvent) => void;
  placement?: SideSheetPlacement;
  size?: SideSheetSize;
  style?: StyleValue;
  title?: VNodeChild;
  visible?: boolean;
  width?: number | string;
  zIndex?: number;
}

export interface SideSheetEmits {
  afterVisibleChange: [visible: boolean];
  cancel: [event: SideSheetCancelEvent];
  'update:visible': [visible: boolean];
}

export interface SideSheetSlots {
  closeIcon?: () => VNodeChild;
  default?: () => VNodeChild;
  footer?: () => VNodeChild;
  title?: () => VNodeChild;
}
