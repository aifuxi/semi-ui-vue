import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const SCROLL_ITEM_MODES = ['normal', 'wheel'] as const;

export type ScrollItemMode = (typeof SCROLL_ITEM_MODES)[number];

export interface ScrollMotionObject {
  [key: string]: unknown;
}

export type ScrollMotion =
  boolean | ScrollMotionObject | ((props: Record<string, unknown>) => ScrollMotionObject);

export interface ScrollItemData {
  disabled?: boolean;
  text?: string;
  transform?: (value: unknown, text: string) => unknown;
  value: unknown;
  [key: string]: unknown;
}

export type ScrollItemSelectData<Item extends ScrollItemData = ScrollItemData> = Item & {
  index: number;
  type?: number | string;
};

export interface ScrollListProps {
  bodyHeight?: number | string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  footer?: VNodeChild;
  header?: VNodeChild;
  prefixCls?: string;
  style?: StyleValue;
}

export interface ScrollListSlots {
  default?: () => VNodeChild;
  footer?: () => VNodeChild;
  header?: () => VNodeChild;
}

export interface ScrollItemProps<Item extends ScrollItemData = ScrollItemData> {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  cycled?: boolean;
  list?: Item[];
  mode?: ScrollItemMode;
  motion?: ScrollMotion;
  selectedIndex?: number;
  style?: StyleValue;
  transform?: (value: unknown, text: string) => unknown;
  type?: number | string;
}

export interface ScrollItemEmits<Item extends ScrollItemData = ScrollItemData> {
  select: [data: ScrollItemSelectData<Item>];
}

export interface ScrollItemExposed {
  scrollToCenter(selectedNode?: HTMLElement, scrollWrapper?: HTMLElement, duration?: number): void;
  scrollToIndex(selectedIndex?: number, duration?: number): void;
  scrollToNode(node: HTMLElement, duration?: number): void;
  scrollToPos(targetTop: number, duration?: number): void;
}
