import type { Component, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ConfigDirection } from '../config-provider';

export const TOAST_TYPES = ['warning', 'success', 'info', 'error', 'default'] as const;
export const TOAST_THEMES = ['normal', 'light'] as const;

export type ToastType = (typeof TOAST_TYPES)[number];
export type ToastTheme = (typeof TOAST_THEMES)[number];
export type ToastId = string;
export type ToastInputId = string | number;

export interface ToastConfig {
  bottom?: number | string;
  duration?: number;
  getPopupContainer?: () => HTMLElement | null;
  left?: number | string;
  right?: number | string;
  theme?: ToastTheme;
  top?: number | string;
  zIndex?: number;
}

export interface ToastOptions extends ToastConfig {
  className?: HTMLAttributes['class'];
  content?: VNodeChild;
  direction?: ConfigDirection;
  icon?: VNodeChild;
  id?: ToastInputId;
  motion?: boolean;
  onClose?: () => void;
  showClose?: boolean;
  stack?: boolean;
  style?: StyleValue;
  textMaxWidth?: number | string;
  type?: ToastType;
}

export interface ToastEntry extends Omit<ToastOptions, 'id'> {
  id: ToastId;
  motion: boolean;
  phase: 'enter' | 'stable' | 'leave';
  revision: number;
  type: ToastType;
}

export type ToastInput = ToastOptions | string;
export type ToastMethod = (options: ToastInput) => ToastId;
export type ToastHookMethod = (options: ToastOptions) => ToastId;

export interface ToastMethods {
  close: (id: ToastInputId) => ToastId;
  error: ToastHookMethod;
  info: ToastHookMethod;
  open: ToastHookMethod;
  success: ToastHookMethod;
  warning: ToastHookMethod;
}

export type ToastUseResult = readonly [ToastMethods, Component];

export interface ToastStaticMethods {
  close: (id: ToastInputId) => ToastId;
  config: (config: ToastConfig) => void;
  destroyAll: () => void;
  error: ToastMethod;
  getWrapperId: () => string | null;
  info: ToastMethod;
  success: ToastMethod;
  useToast: () => ToastUseResult;
  warning: ToastMethod;
}

export interface ToastFactoryStatic {
  create: (config?: ToastConfig) => ToastStaticMethods;
}
