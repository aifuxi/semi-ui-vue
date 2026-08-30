import type { CSSProperties, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { InputProps } from '../input';
import type { PopoverMargin, PopoverPosition, PopoverProps } from '../popover';
import type {
  TreeCheckRelation,
  TreeExpandAction,
  TreeExpandDetail,
  TreeExpandIconSlotProps,
  TreeFullLabelSlotProps,
  TreeKeyMaps,
  TreeNodeData,
  TreeValue,
  TreeVirtualize,
} from '../tree';

export type TreeSelectSize = 'small' | 'default' | 'large';
export type TreeSelectValidateStatus = 'default' | 'warning' | 'error';
export type TreeSelectSearchPosition = 'dropdown' | 'trigger';

export interface TreeSelectSearchRenderProps extends InputProps {
  className: string;
  value: string;
  onChange(value: string): void;
}

export interface TreeSelectSelectedItemProps {
  node: TreeNodeData;
  index: number;
  onClose(content?: VNodeChild, event?: MouseEvent | KeyboardEvent): void;
}

export interface TreeSelectTriggerRenderProps {
  componentProps: TreeSelectProps;
  disabled: boolean;
  inputValue: string;
  placeholder: string;
  value: TreeNodeData[];
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onSearch(value: string): void;
  onRemove(key: string): void;
}

export interface TreeSelectProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean;
  arrowIcon?: VNodeChild;
  autoAdjustOverflow?: boolean;
  autoExpandParent?: boolean;
  autoMergeValue?: boolean;
  borderless?: boolean;
  checkRelation?: TreeCheckRelation;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  clickToHide?: boolean;
  clickTriggerToHide?: boolean;
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultOpen?: boolean;
  defaultValue?: TreeValue;
  disabled?: boolean;
  disableStrictly?: boolean;
  dropdownClassName?: HTMLAttributes['class'];
  dropdownMargin?: PopoverMargin;
  dropdownMatchSelectWidth?: boolean;
  dropdownStyle?: StyleValue;
  emptyContent?: VNodeChild;
  expandAction?: TreeExpandAction;
  expandAll?: boolean;
  expandedKeys?: string[];
  expandIcon?: VNodeChild | ((props: TreeExpandIconSlotProps) => VNodeChild);
  filterTreeNode?:
    boolean | ((inputValue: string, treeNodeString: string, data?: TreeNodeData) => boolean);
  getPopupContainer?: () => HTMLElement;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  keyMaps?: TreeKeyMaps;
  labelEllipsis?: boolean;
  leafOnly?: boolean;
  loadData?: (node?: TreeNodeData) => Promise<void>;
  loadedKeys?: string[];
  maxTagCount?: number;
  modelValue?: TreeValue;
  motion?: boolean;
  motionExpand?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  multiple?: boolean;
  onChangeWithObject?: boolean;
  optionListStyle?: CSSProperties;
  outerBottomSlot?: VNodeChild;
  outerTopSlot?: VNodeChild;
  placeholder?: string;
  position?: PopoverPosition;
  prefix?: VNodeChild;
  preventScroll?: boolean;
  remote?: boolean;
  renderFullLabel?: (props: TreeFullLabelSlotProps) => VNodeChild;
  renderLabel?: (label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild;
  renderSelectedItem?: (
    node: TreeNodeData,
    other?: { index: number; onClose(content?: VNodeChild, event?: MouseEvent): void },
  ) => VNodeChild | { content: VNodeChild; isRenderInTag: boolean };
  restTagsPopoverProps?: PopoverProps;
  searchAutoFocus?: boolean;
  searchPlaceholder?: string;
  searchPosition?: TreeSelectSearchPosition;
  searchRender?: ((props: TreeSelectSearchRenderProps) => VNodeChild) | boolean;
  showClear?: boolean;
  showFilteredOnly?: boolean;
  showLine?: boolean;
  showRestTagsPopover?: boolean;
  showSearchClear?: boolean;
  size?: TreeSelectSize;
  stopPropagation?: boolean | string;
  style?: StyleValue;
  suffix?: VNodeChild;
  treeData?: TreeNodeData[];
  treeNodeFilterProp?: string;
  treeNodeLabelProp?: string;
  triggerRender?: (props: TreeSelectTriggerRenderProps) => VNodeChild;
  triggerTagWrap?: boolean;
  validateStatus?: TreeSelectValidateStatus;
  value?: TreeValue;
  virtualize?: TreeVirtualize;
  zIndex?: number;
}

export interface TreeSelectEmits {
  blur: [event: unknown];
  change: [valueOrNode: unknown, nodeOrEvent?: unknown, event?: unknown];
  clear: [event: MouseEvent | KeyboardEvent];
  expand: [expandedKeys: string[], detail: TreeExpandDetail];
  focus: [event: unknown];
  load: [loadedKeys: Set<string>, node?: TreeNodeData];
  search: [input: string, filteredExpandedKeys: string[], filteredNodes: TreeNodeData[]];
  select: [key: string, selected: boolean, node: TreeNodeData];
  visibleChange: [visible: boolean];
  'update:expandedKeys': [expandedKeys: string[]];
  'update:modelValue': [value: unknown];
  'update:value': [value: unknown];
}

export interface TreeSelectSlots {
  arrowIcon?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  empty?: () => VNodeChild;
  expandIcon?: (props: TreeExpandIconSlotProps) => VNodeChild;
  fullLabel?: (props: TreeFullLabelSlotProps) => VNodeChild;
  label?: (props: { label?: VNodeChild; node: TreeNodeData; searchWord?: string }) => VNodeChild;
  outerBottom?: () => VNodeChild;
  outerTop?: () => VNodeChild;
  prefix?: () => VNodeChild;
  search?: (props: TreeSelectSearchRenderProps) => VNodeChild;
  selectedItem?: (props: TreeSelectSelectedItemProps) => VNodeChild;
  suffix?: () => VNodeChild;
  trigger?: (props: TreeSelectTriggerRenderProps) => VNodeChild;
}

export interface TreeSelectExposed {
  close(): void;
  search(value: string): void;
}

export type { TreeKeyMaps, TreeNodeData, TreeValue };
