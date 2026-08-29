import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { ColProps, RowProps } from '../grid';

export const LIST_LAYOUTS = ['vertical', 'horizontal'] as const;
export const LIST_SIZES = ['small', 'default', 'large'] as const;
export const LIST_ITEM_ALIGNS = [
  'flex-start',
  'flex-end',
  'center',
  'baseline',
  'stretch',
] as const;

export type ListLayout = (typeof LIST_LAYOUTS)[number];
export type ListSize = (typeof LIST_SIZES)[number];
export type ListItemAlign = (typeof LIST_ITEM_ALIGNS)[number];

export interface ListGrid extends Omit<RowProps, 'prefixCls'>, Omit<ColProps, 'prefixCls'> {}

export interface ListProps<T = unknown> {
  bordered?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  dataSource?: readonly T[];
  emptyContent?: VNodeChild;
  footer?: VNodeChild;
  grid?: ListGrid;
  header?: VNodeChild;
  layout?: ListLayout;
  loading?: boolean;
  loadMore?: VNodeChild;
  renderItem?: (item: T, index: number) => VNodeChild;
  size?: ListSize;
  split?: boolean;
  style?: StyleValue;
}

export interface ListSlots<T = unknown> {
  default?: () => VNodeChild;
  emptyContent?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
  item?: (props: { item: T; index: number }) => VNodeChild;
  loadMore?: () => VNodeChild;
}

export interface ListEmits {
  (event: 'click', mouseEvent: MouseEvent): void;
  (event: 'rightClick', mouseEvent: MouseEvent): void;
}

export interface ListItemProps {
  align?: ListItemAlign;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  extra?: VNodeChild;
  header?: VNodeChild;
  main?: VNodeChild;
  style?: StyleValue;
}

export interface ListItemSlots {
  default?: () => VNodeChild;
  extra?: () => VNodeChild;
  header?: () => VNodeChild;
  main?: () => VNodeChild;
}

export interface ListItemEmits {
  (event: 'click', mouseEvent: MouseEvent): void;
  (event: 'rightClick', mouseEvent: MouseEvent): void;
  (event: 'mouseEnter', mouseEvent: MouseEvent): void;
  (event: 'mouseLeave', mouseEvent: MouseEvent): void;
}

export interface ListLocale {
  emptyText: string;
}
