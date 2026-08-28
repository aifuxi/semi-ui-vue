import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const DESCRIPTIONS_ALIGNS = ['center', 'justify', 'left', 'plain'] as const;
export const DESCRIPTIONS_SIZES = ['small', 'medium', 'large'] as const;
export const DESCRIPTIONS_LAYOUTS = ['horizontal', 'vertical'] as const;

export type DescriptionsAlign = (typeof DESCRIPTIONS_ALIGNS)[number];
export type DescriptionsSize = (typeof DESCRIPTIONS_SIZES)[number];
export type DescriptionsLayout = (typeof DESCRIPTIONS_LAYOUTS)[number];

export interface DescriptionsDataItem {
  key?: VNodeChild;
  value?: VNodeChild | (() => VNodeChild);
  hidden?: boolean;
  span?: number;
  keyStyle?: StyleValue;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  [dataAttribute: `data-${string}`]: unknown;
}

export interface DescriptionsProps {
  align?: DescriptionsAlign;
  row?: boolean;
  size?: DescriptionsSize;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  data?: readonly DescriptionsDataItem[];
  layout?: DescriptionsLayout;
  column?: number;
}

export interface DescriptionsSlots {
  default?: () => VNodeChild;
}

export interface DescriptionsItemProps {
  hidden?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  itemKey?: VNodeChild;
  span?: number;
  keyStyle?: StyleValue;
}

export interface DescriptionsItemSlots {
  default?: () => VNodeChild;
  key?: () => VNodeChild;
}
