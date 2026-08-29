import type { StyleValue, VNodeChild } from 'vue';

export type OverflowListKey = string | number;
export type OverflowListCollapseFrom = 'start' | 'end';
export type OverflowListRenderMode = 'collapse' | 'scroll';
export type OverflowListRenderDirection = 'both' | 'start' | 'end';
export type OverflowItem = Record<string, unknown>;

export interface OverflowListProps<Item extends OverflowItem = OverflowItem> {
  items?: readonly Item[];
  collapseFrom?: OverflowListCollapseFrom;
  minVisibleItems?: number;
  renderMode?: OverflowListRenderMode;
  threshold?: number;
  class?: unknown;
  className?: string;
  style?: StyleValue;
  wrapperClassName?: string;
  wrapperStyle?: StyleValue;
  itemKey?: OverflowListKey | ((item: Item) => OverflowListKey);
  overflowRenderDirection?: OverflowListRenderDirection;
}

export interface OverflowListSlots<Item extends OverflowItem = OverflowItem> {
  visibleItem?: (scope: { item: Item; index: number }) => VNodeChild;
  overflow?: (scope: { items: readonly Item[]; position: OverflowListCollapseFrom }) => VNodeChild;
}

export interface OverflowListEmits<Item extends OverflowItem = OverflowItem> {
  overflow: [items: Item[]];
  intersect: [entries: Record<string, IntersectionObserverEntry>];
  visibleStateChange: [visibleState: Map<string, boolean>];
}
