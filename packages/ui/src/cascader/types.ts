import type { CSSProperties, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { PopoverMargin, PopoverPosition, PopoverProps } from '../popover';

export type CascaderSize = 'small' | 'default' | 'large';
export type CascaderValidateStatus = 'success' | 'default' | 'error' | 'warning';
export type CascaderShowNext = 'click' | 'hover';
export type CascaderSearchPosition = 'trigger' | 'custom';
export type CascaderCheckRelation = 'related' | 'unRelated';

export interface CascaderKeyMaps {
  value?: string;
  label?: string;
  disabled?: string;
  children?: string;
  isLeaf?: string;
}

export interface CascaderData extends Record<string, unknown> {
  value?: string | number;
  label?: VNodeChild;
  disabled?: boolean;
  isLeaf?: boolean;
  loading?: boolean;
  children?: CascaderData[];
}

export interface CascaderEntity extends Record<string, unknown> {
  _notExist?: boolean;
  children?: CascaderEntity[];
  data: CascaderData;
  ind: number;
  key: string;
  level: number;
  parent?: CascaderEntity;
  parentKey?: string | null;
  path: string[];
  pos: string;
  valuePath: Array<string | number>;
}

export interface CascaderFilterData extends Record<string, unknown> {
  data: CascaderData;
  disabled: boolean;
  key: string;
  pathData: CascaderData[];
  searchText: VNodeChild[];
}

export type CascaderSimpleValue = string | number | CascaderData;
export type CascaderValue = CascaderSimpleValue | CascaderSimpleValue[] | CascaderSimpleValue[][];

export interface CascaderVirtualize {
  itemSize: number;
  height?: number | string;
  width?: number | string;
}

export interface CascaderFilterRenderProps {
  className: string;
  inputValue: string;
  disabled: boolean;
  data: CascaderData[];
  checkStatus: { checked: boolean; halfChecked: boolean };
  selected: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
  style?: CSSProperties;
}

export interface CascaderTriggerRenderProps {
  componentProps: CascaderProps;
  disabled: boolean;
  value?: string | Set<string>;
  inputValue: string;
  placeholder?: string;
  onSearch(inputValue: string): void;
  /** @deprecated Use onSearch. */
  onChange(inputValue: string): void;
  onClear(event?: MouseEvent | KeyboardEvent): void;
  onRemove(position: string): void;
}

export interface CascaderScrollPanelProps {
  panelIndex: number;
  activeNode: CascaderData | null;
}

export interface CascaderProps {
  ariaDescribedby?: string;
  ariaErrormessage?: string;
  ariaInvalid?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaRequired?: boolean | 'false' | 'true';
  arrowIcon?: VNodeChild;
  autoAdjustOverflow?: boolean;
  autoClearSearchValue?: boolean;
  autoMergeValue?: boolean;
  borderless?: boolean;
  bottomSlot?: VNodeChild;
  changeOnSelect?: boolean;
  checkRelation?: CascaderCheckRelation;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  clearIcon?: VNodeChild;
  clickToSelect?: boolean;
  defaultOpen?: boolean;
  defaultValue?: CascaderValue;
  disabled?: boolean;
  disableStrictly?: boolean;
  displayProp?: string;
  displayRender?: (selected: VNodeChild[] | CascaderEntity, index?: number) => VNodeChild;
  dropdownClassName?: HTMLAttributes['class'];
  dropdownMargin?: PopoverMargin;
  dropdownStyle?: StyleValue;
  emptyContent?: VNodeChild;
  enableLeafClick?: boolean;
  expandIcon?: VNodeChild;
  filterLeafOnly?: boolean;
  filterRender?: (props: CascaderFilterRenderProps) => VNodeChild;
  filterSorter?: (first: CascaderData[], second: CascaderData[], inputValue: string) => number;
  filterTreeNode?:
    boolean | ((inputValue: string, treeNodeString: string, data?: CascaderData) => boolean);
  getPopupContainer?: () => HTMLElement;
  id?: string;
  insetLabel?: VNodeChild;
  insetLabelId?: string;
  keyMaps?: CascaderKeyMaps;
  leafOnly?: boolean;
  loadData?: (selectOptions: CascaderData[]) => Promise<void>;
  loadedKeys?: string[];
  max?: number;
  maxTagCount?: number;
  modelValue?: CascaderValue;
  motion?: boolean;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  multiple?: boolean;
  onChangeWithObject?: boolean;
  placeholder?: string;
  position?: PopoverPosition;
  prefix?: VNodeChild;
  preventScroll?: boolean;
  remote?: boolean;
  restTagsPopoverProps?: PopoverProps;
  searchPlaceholder?: string;
  searchPosition?: CascaderSearchPosition;
  separator?: string;
  showClear?: boolean;
  showNext?: CascaderShowNext;
  showRestTagsPopover?: boolean;
  size?: CascaderSize;
  stopPropagation?: boolean | string;
  style?: StyleValue;
  suffix?: VNodeChild;
  topSlot?: VNodeChild;
  treeData?: CascaderData[];
  treeNodeFilterProp?: string;
  triggerRender?: (props: CascaderTriggerRenderProps) => VNodeChild;
  validateStatus?: CascaderValidateStatus;
  value?: CascaderValue;
  virtualizeInSearch?: CascaderVirtualize;
  zIndex?: number;
}

export interface CascaderEmits {
  blur: [event: unknown];
  change: [value: CascaderValue];
  clear: [];
  exceed: [checkedItems: CascaderEntity[]];
  focus: [event: unknown];
  listScroll: [event: Event, panel: CascaderScrollPanelProps];
  load: [loadedKeys: Set<string>, data: CascaderData];
  search: [value: string];
  select: [value: string | number | Array<string | number>];
  visibleChange: [visible: boolean];
  'update:modelValue': [value: CascaderValue];
  'update:value': [value: CascaderValue];
}

export interface CascaderSlots {
  arrowIcon?: () => VNodeChild;
  bottom?: () => VNodeChild;
  clearIcon?: () => VNodeChild;
  display?: (props: { selected: VNodeChild[] | CascaderEntity; index?: number }) => VNodeChild;
  empty?: () => VNodeChild;
  expandIcon?: () => VNodeChild;
  filter?: (props: CascaderFilterRenderProps) => VNodeChild;
  prefix?: () => VNodeChild;
  suffix?: () => VNodeChild;
  top?: () => VNodeChild;
  trigger?: (props: CascaderTriggerRenderProps) => VNodeChild;
}

export interface CascaderExposed {
  open(): void;
  close(): void;
  focus(): void;
  blur(): void;
  search(value: string): void;
}
