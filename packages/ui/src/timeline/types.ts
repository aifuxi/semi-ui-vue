import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const TIMELINE_MODES = ['left', 'right', 'center', 'alternate'] as const;
export const TIMELINE_ITEM_POSITIONS = ['left', 'right'] as const;
export const TIMELINE_ITEM_TYPES = ['default', 'ongoing', 'success', 'warning', 'error'] as const;

export type TimelineMode = (typeof TIMELINE_MODES)[number];
export type TimelineItemPosition = (typeof TIMELINE_ITEM_POSITIONS)[number];
export type TimelineItemType = (typeof TIMELINE_ITEM_TYPES)[number];

export interface TimelineItemProps {
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  color?: string;
  dot?: VNodeChild;
  extra?: VNodeChild;
  position?: TimelineItemPosition;
  style?: StyleValue;
  time?: VNodeChild;
  type?: TimelineItemType;
}

export interface TimelineItemEmits {
  click: [event: MouseEvent];
}

export interface TimelineItemSlots {
  default?: () => VNodeChild;
  dot?: () => VNodeChild;
  extra?: () => VNodeChild;
  time?: () => VNodeChild;
}

export interface TimelineData extends TimelineItemProps {
  content: VNodeChild;
  onClick?: (event: MouseEvent) => void;
  [dataAttribute: `data-${string}`]: unknown;
}

export interface TimelineProps {
  ariaLabel?: string;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  dataSource?: readonly TimelineData[];
  mode?: TimelineMode;
  style?: StyleValue;
}

export interface TimelineSlots {
  default?: () => VNodeChild;
}
