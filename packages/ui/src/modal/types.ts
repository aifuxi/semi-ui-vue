import type { Component, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ButtonProps, ButtonType } from '../button';
import type { ConfigDirection } from '../config-provider';

export const MODAL_SIZES = ['small', 'medium', 'large', 'full-width'] as const;
export const MODAL_CONFIRM_TYPES = ['success', 'info', 'warning', 'error', 'confirm'] as const;

export type ModalSize = (typeof MODAL_SIZES)[number];
export type ModalConfirmType = (typeof MODAL_CONFIRM_TYPES)[number];
export type ModalActionHandler = (event: MouseEvent | KeyboardEvent) => void | Promise<unknown>;
export type ModalButtonProps = ButtonProps & Record<string, unknown>;

export interface ModalLocale {
  cancel: string;
  confirm: string;
}

export interface ModalProps {
  afterClose?: () => void;
  bodyStyle?: StyleValue;
  cancelButtonProps?: ModalButtonProps;
  cancelLoading?: boolean;
  cancelText?: string;
  centered?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  closable?: boolean;
  closeIcon?: VNodeChild;
  closeOnEsc?: boolean;
  confirmLoading?: boolean;
  content?: VNodeChild;
  direction?: ConfigDirection;
  footer?: VNodeChild;
  footerFill?: boolean;
  fullScreen?: boolean;
  getContainerContext?: () => unknown;
  getPopupContainer?: () => HTMLElement;
  hasCancel?: boolean;
  header?: VNodeChild;
  height?: string | number;
  icon?: VNodeChild;
  keepDOM?: boolean;
  lazyRender?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  maskFixed?: boolean;
  maskStyle?: StyleValue;
  modalContentClass?: HTMLAttributes['class'];
  modalRender?: (dialog: VNodeChild) => VNodeChild;
  motion?: boolean;
  okButtonProps?: ModalButtonProps;
  okText?: string;
  okType?: ButtonType;
  onAfterClose?: () => void;
  onCancel?: ModalActionHandler;
  onOk?: ModalActionHandler;
  preventScroll?: boolean;
  size?: ModalSize;
  style?: StyleValue;
  title?: VNodeChild;
  visible?: boolean;
  width?: string | number;
  zIndex?: number;
}

export interface ModalSlots {
  body?: () => VNodeChild;
  closeIcon?: () => VNodeChild;
  default?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
  icon?: () => VNodeChild;
  title?: () => VNodeChild;
}

export interface ModalEmits {
  'update:visible': [visible: boolean];
}

export interface ModalConfirmProps extends ModalProps {
  type?: ModalConfirmType;
}

export interface ModalHandle {
  destroy: () => void;
  update: (config: Partial<ModalConfirmProps>) => void;
}

export type ModalMethod = (config: ModalProps) => ModalHandle;

export interface ModalMethods {
  confirm: ModalMethod;
  error: ModalMethod;
  info: ModalMethod;
  success: ModalMethod;
  warning: ModalMethod;
}

export type ModalUseModalResult = readonly [ModalMethods, Component];

export interface ModalStaticMethods extends ModalMethods {
  destroyAll: () => void;
  useModal: () => ModalUseModalResult;
}
