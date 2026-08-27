import type { ComponentPublicInstance, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const TOOLTIP_POSITIONS = [
  'top',
  'topLeft',
  'topRight',
  'left',
  'leftTop',
  'leftBottom',
  'right',
  'rightTop',
  'rightBottom',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'leftTopOver',
  'rightTopOver',
  'leftBottomOver',
  'rightBottomOver',
] as const;

export const TOOLTIP_TRIGGERS = ['hover', 'focus', 'click', 'custom', 'contextMenu'] as const;

export type TooltipPosition = (typeof TOOLTIP_POSITIONS)[number];
export type TooltipTrigger = (typeof TOOLTIP_TRIGGERS)[number];

export interface TooltipArrowBounding {
  offsetX?: number;
  offsetY?: number;
  width?: number;
  height?: number;
}

export interface TooltipSpacing {
  x: number;
  y: number;
}

export interface TooltipMargin {
  marginLeft: number;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
}

export type TooltipInitialFocusRef = (element: Element | ComponentPublicInstance | null) => void;

export interface TooltipProps {
  arrowBounding?: TooltipArrowBounding;
  arrowPointAtCenter?: boolean;
  autoAdjustOverflow?: boolean;
  class?: HTMLAttributes['class'];
  clickToHide?: boolean;
  clickTriggerToHide?: boolean;
  closeOnEsc?: boolean;
  condition?: boolean;
  content?: VNodeChild;
  disableArrowKeyDown?: boolean;
  disableFocusListener?: boolean;
  getPopupContainer?: () => HTMLElement;
  guardFocus?: boolean;
  keepDOM?: boolean;
  margin?: number | TooltipMargin;
  motion?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  position?: TooltipPosition;
  prefixCls?: string;
  preventScroll?: boolean;
  rePosKey?: string | number;
  returnFocusOnClose?: boolean;
  role?: string;
  showArrow?: boolean | VNodeChild;
  spacing?: number | TooltipSpacing;
  stopPropagation?: boolean;
  style?: StyleValue;
  transformFromCenter?: boolean;
  trigger?: TooltipTrigger;
  visible?: boolean;
  wrapWhenSpecial?: boolean;
  wrapperClassName?: HTMLAttributes['class'];
  wrapperId?: string;
  zIndex?: number;
}

export interface TooltipEmits {
  afterClose: [];
  clickOutside: [event: MouseEvent];
  escKeydown: [event: KeyboardEvent];
  visibleChange: [visible: boolean];
  'update:visible': [visible: boolean];
}

export interface TooltipSlots {
  default?: () => VNodeChild;
  content?: (props: { initialFocusRef: TooltipInitialFocusRef }) => VNodeChild;
  arrow?: () => VNodeChild;
}

export interface TooltipExposed {
  focusTrigger(): void;
  getPopupId(): string | undefined;
  rePosition(): Record<string, unknown>;
}

export interface TooltipRuntimeProps extends Omit<TooltipProps, 'class' | 'style'> {
  arrowBounding: Required<TooltipArrowBounding>;
  arrowPointAtCenter: boolean;
  autoAdjustOverflow: boolean;
  class?: HTMLAttributes['class'];
  closeOnEsc: boolean;
  condition: boolean;
  disableArrowKeyDown: boolean;
  disableFocusListener: boolean;
  guardFocus: boolean;
  keepDOM: boolean;
  margin: number | TooltipMargin;
  motion: boolean;
  mouseEnterDelay: number;
  mouseLeaveDelay: number;
  position: TooltipPosition;
  prefixCls: string;
  returnFocusOnClose: boolean;
  role: string;
  showArrow: boolean | VNodeChild;
  spacing: number | TooltipSpacing;
  style?: StyleValue;
  transformFromCenter: boolean;
  trigger: TooltipTrigger;
  wrapWhenSpecial: boolean;
  zIndex: number;
}

export interface TooltipState {
  containerStyle: Record<string, string | number>;
  displayNone: boolean;
  id?: string | undefined;
  isInsert: boolean;
  isPositionUpdated: boolean;
  placement: TooltipPosition;
  portalEventSet: Record<string, (...args: unknown[]) => void>;
  transitionState: '' | 'enter' | 'leave';
  triggerEventSet: Record<string, (...args: unknown[]) => void>;
  visible: boolean;
}
