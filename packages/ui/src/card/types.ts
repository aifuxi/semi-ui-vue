import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const CARD_SHADOWS = ['hover', 'always'] as const;
export const CARD_GROUP_TYPES = ['grid'] as const;

export type CardShadows = (typeof CARD_SHADOWS)[number];
export type CardGroupType = (typeof CARD_GROUP_TYPES)[number];

export interface CardProps {
  actions?: readonly VNodeChild[];
  bodyStyle?: StyleValue;
  bordered?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  cover?: VNodeChild;
  footer?: VNodeChild;
  footerLine?: boolean;
  footerStyle?: StyleValue;
  header?: VNodeChild;
  headerExtraContent?: VNodeChild;
  headerLine?: boolean;
  headerStyle?: StyleValue;
  loading?: boolean;
  shadows?: CardShadows;
  style?: StyleValue;
  title?: VNodeChild;
}

export interface CardSlots {
  default?: () => VNodeChild;
  actions?: () => VNodeChild;
  cover?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
  headerExtraContent?: () => VNodeChild;
  title?: () => VNodeChild;
}

export interface CardMetaProps {
  avatar?: VNodeChild;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  description?: VNodeChild;
  style?: StyleValue;
  title?: VNodeChild;
}

export interface CardMetaSlots {
  avatar?: () => VNodeChild;
  description?: () => VNodeChild;
  title?: () => VNodeChild;
}

export interface CardGroupProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  spacing?: number | readonly number[];
  style?: StyleValue;
  type?: CardGroupType;
}

export interface CardGroupSlots {
  default?: () => VNodeChild;
}
