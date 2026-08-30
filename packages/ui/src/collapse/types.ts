import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export const COLLAPSE_ICON_POSITIONS = ['left', 'right'] as const;

export type CollapseIconPosition = (typeof COLLAPSE_ICON_POSITIONS)[number];
export type CollapseActiveKey = string | string[];

export interface CollapseProps {
  activeKey?: CollapseActiveKey;
  defaultActiveKey?: CollapseActiveKey;
  accordion?: boolean;
  clickHeaderToExpand?: boolean;
  expandIcon?: VNodeChild;
  collapseIcon?: VNodeChild;
  expandIconPosition?: CollapseIconPosition;
  keepDOM?: boolean;
  motion?: boolean;
  lazyRender?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}

export interface CollapseEmits {
  change: [activeKey: CollapseActiveKey, event: MouseEvent];
  'update:activeKey': [activeKey: CollapseActiveKey];
}

export interface CollapseSlots {
  default?: () => VNodeChild;
  expandIcon?: () => VNodeChild;
  collapseIcon?: () => VNodeChild;
}

export interface CollapseState {
  activeSet: Set<string>;
}

export interface CollapsePanelProps {
  itemKey: string;
  extra?: VNodeChild;
  header?: VNodeChild;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  reCalcKey?: number | string;
  style?: StyleValue;
  showArrow?: boolean;
  disabled?: boolean;
}

export interface CollapsePanelEmits {
  motionEnd: [];
}

export interface CollapsePanelSlots {
  default?: () => VNodeChild;
  extra?: () => VNodeChild;
  header?: () => VNodeChild;
}
