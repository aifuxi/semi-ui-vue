import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ButtonProps, ButtonType } from '../button';
import type { PopoverProps } from '../popover';
import type { TooltipInitialFocusRef } from '../tooltip';

export type PopconfirmActionResult = Promise<unknown> | void;
export type PopconfirmActionHandler = (event: MouseEvent) => PopconfirmActionResult;

export interface PopconfirmButtonProps extends ButtonProps {
  autoFocus?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  onClick?: (event: MouseEvent) => void;
  style?: StyleValue;
  [attribute: `aria-${string}`]: unknown;
  [attribute: `data-${string}`]: unknown;
}

export interface PopconfirmLocale {
  cancel: string;
  confirm: string;
}

export interface PopconfirmProps extends Omit<
  PopoverProps,
  'class' | 'className' | 'content' | 'position' | 'prefixCls' | 'style' | 'trigger' | 'zIndex'
> {
  cancelButtonProps?: PopconfirmButtonProps;
  cancelText?: string;
  cancelType?: ButtonType;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  content?: VNodeChild;
  defaultVisible?: boolean;
  disabled?: boolean;
  icon?: VNodeChild;
  okButtonProps?: PopconfirmButtonProps;
  okText?: string;
  okType?: ButtonType;
  position?: PopoverProps['position'];
  prefixCls?: string;
  showCloseIcon?: boolean;
  style?: StyleValue;
  title?: VNodeChild;
  trigger?: PopoverProps['trigger'];
  visible?: boolean;
  zIndex?: number;
}

export interface PopconfirmEmits {
  cancel: [event: MouseEvent];
  clickOutside: [event: MouseEvent];
  confirm: [event: MouseEvent];
  escKeydown: [event: KeyboardEvent];
  visibleChange: [visible: boolean];
  'update:visible': [visible: boolean];
}

export interface PopconfirmSlots {
  content?: (props: { initialFocusRef: TooltipInitialFocusRef }) => VNodeChild;
  default?: () => VNodeChild;
  icon?: () => VNodeChild;
  title?: () => VNodeChild;
}
