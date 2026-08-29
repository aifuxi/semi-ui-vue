import type { Component, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ConfigDirection } from '../config-provider';

export const NOTIFICATION_POSITIONS = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
] as const;
export const NOTIFICATION_TYPES = ['warning', 'success', 'info', 'error', 'default'] as const;
export const NOTIFICATION_THEMES = ['normal', 'light'] as const;

export type NotificationPosition = (typeof NOTIFICATION_POSITIONS)[number];
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
export type NotificationTheme = (typeof NOTIFICATION_THEMES)[number];
export type NotificationId = string;

export interface NotificationOptions {
  className?: HTMLAttributes['class'];
  content?: VNodeChild;
  direction?: ConfigDirection;
  duration?: number;
  getPopupContainer?: () => HTMLElement;
  icon?: VNodeChild;
  id?: NotificationId;
  onClick?: (event: MouseEvent) => void;
  onClose?: () => void;
  onCloseClick?: (id: NotificationId) => void;
  position?: NotificationPosition;
  showClose?: boolean;
  style?: StyleValue;
  theme?: NotificationTheme;
  title?: VNodeChild;
  type?: NotificationType;
  zIndex?: number;
}

export interface NotificationConfig {
  bottom?: number | string;
  direction?: ConfigDirection;
  duration?: number;
  left?: number | string;
  position?: NotificationPosition;
  right?: number | string;
  top?: number | string;
  zIndex?: number;
}

export interface NotificationEntry extends NotificationOptions {
  bottom?: number | string;
  id: NotificationId;
  left?: number | string;
  phase: 'enter' | 'stable' | 'leave';
  revision: number;
  right?: number | string;
  top?: number | string;
  type: NotificationType;
}

export type NotificationMethod = (options: NotificationOptions) => NotificationId;

export interface NotificationMethods {
  close: (id: NotificationId) => NotificationId;
  error: NotificationMethod;
  info: NotificationMethod;
  open: NotificationMethod;
  success: NotificationMethod;
  warning: NotificationMethod;
}

export type NotificationUseResult = readonly [NotificationMethods, Component];

export interface NotificationStaticMethods extends NotificationMethods {
  config: (config: NotificationConfig) => void;
  destroyAll: () => void;
  useNotification: () => NotificationUseResult;
}
