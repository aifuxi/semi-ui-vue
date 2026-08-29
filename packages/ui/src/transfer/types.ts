import type { CSSProperties, HTMLAttributes, StyleValue, VNodeChild } from 'vue';

import type { InputProps } from '../input';
import type { TreeProps } from '../tree';

export type TransferPrimitive = string | number;
export type TransferType = 'list' | 'groupList' | 'treeList';

export interface TransferDataItem extends Record<string, unknown> {
  key: TransferPrimitive;
  label?: VNodeChild;
  value?: TransferPrimitive;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  fullPath?: TransferFullPathItem[];
}

export type TransferFullPathItem = TransferDataItem;

export interface TransferGroupItem {
  title?: string;
  children?: TransferDataItem[];
}

export interface TransferTreeItem extends TransferDataItem {
  children?: TransferTreeItem[];
}

export type TransferDataSource = TransferDataItem[] | TransferGroupItem[] | TransferTreeItem[];

export interface TransferResolvedDataItem extends TransferDataItem {
  _parent?: { title?: string };
  _optionKey?: TransferPrimitive;
  path?: TransferFullPathItem[];
  isLeaf?: boolean;
}

export interface TransferEmptyContent {
  left?: VNodeChild;
  right?: VNodeChild;
  search?: VNodeChild;
}

export interface TransferVirtualizeProps {
  height?: number | string;
  width?: number | string;
  itemSize: number;
}

export interface TransferPaginationProps {
  currentPage?: number;
  defaultCurrentPage?: number;
  pageSize?: number;
  onPageChange?: (currentPage: number) => void;
}

export interface TransferSourceItemProps extends TransferResolvedDataItem {
  checked: boolean;
  onChange(): void;
}

export interface TransferDragHandleProps extends Record<string, unknown> {
  draggable: true;
  role: 'button';
  'aria-label': 'Drag and sort';
  onDragstart(event: DragEvent): void;
  onDragend(): void;
}

export interface TransferSelectedItemProps extends TransferResolvedDataItem {
  onRemove(): void;
  dragHandleProps?: TransferDragHandleProps;
  sortableHandle?: (render: () => VNodeChild) => VNodeChild;
}

export interface TransferSourceHeaderProps {
  num: number;
  showButton: boolean;
  allChecked: boolean;
  leafOnlyNum?: number;
  onAllClick(): void;
}

export interface TransferSelectedHeaderProps {
  num: number;
  showButton: boolean;
  onClear(): void;
}

export interface TransferSourcePanelProps {
  value: TransferPrimitive[];
  loading: boolean;
  noMatch: boolean;
  filterData: TransferResolvedDataItem[];
  sourceData: TransferResolvedDataItem[];
  propsDataSource: TransferDataSource;
  allChecked: boolean;
  showNumber: number;
  inputValue: string;
  selectedItems: Map<TransferPrimitive, TransferResolvedDataItem>;
  onSearch(value: string): void;
  onAllClick(): void;
  onSelectOrRemove(item: TransferResolvedDataItem): void;
  onSelect(value: TransferPrimitive[]): void;
}

export interface TransferSelectedPanelProps {
  length: number;
  selectedData: TransferResolvedDataItem[];
  onClear(): void;
  onRemove(item: TransferResolvedDataItem): void;
  onSortEnd(props: { oldIndex: number; newIndex: number }): void;
}

export interface TransferLocale {
  emptyLeft: string;
  emptySearch: string;
  emptyRight: string;
  placeholder: string;
  clear: string;
  selectAll: string;
  clearSelectAll: string;
  total: string;
  selected: string;
}

export interface TransferProps {
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  disabled?: boolean;
  dataSource?: TransferDataSource;
  filter?: boolean | ((input: string, item: TransferDataItem) => boolean);
  defaultValue?: TransferPrimitive[];
  value?: TransferPrimitive[] | undefined;
  modelValue?: TransferPrimitive[] | undefined;
  inputProps?: InputProps;
  type?: TransferType;
  emptyContent?: TransferEmptyContent;
  draggable?: boolean;
  treeProps?: Omit<TreeProps, 'value' | 'modelValue'>;
  showPath?: boolean;
  loading?: boolean;
  virtualize?: TransferVirtualizeProps;
  pagination?: TransferPaginationProps;
  renderSourceItem?: (item: TransferSourceItemProps) => VNodeChild;
  renderSelectedItem?: (item: TransferSelectedItemProps) => VNodeChild;
  renderSourcePanel?: (props: TransferSourcePanelProps) => VNodeChild;
  renderSelectedPanel?: (props: TransferSelectedPanelProps) => VNodeChild;
  renderSourceHeader?: (props: TransferSourceHeaderProps) => VNodeChild;
  renderSelectedHeader?: (props: TransferSelectedHeaderProps) => VNodeChild;
}

export interface TransferEmits {
  change: [values: TransferPrimitive[], items: TransferDataItem[]];
  select: [item: TransferDataItem];
  deselect: [item: TransferDataItem];
  search: [input: string];
  'update:value': [values: TransferPrimitive[]];
  'update:modelValue': [values: TransferPrimitive[]];
}

export interface TransferSlots {
  sourceItem?: (props: TransferSourceItemProps) => VNodeChild;
  selectedItem?: (props: TransferSelectedItemProps) => VNodeChild;
  sourcePanel?: (props: TransferSourcePanelProps) => VNodeChild;
  selectedPanel?: (props: TransferSelectedPanelProps) => VNodeChild;
  sourceHeader?: (props: TransferSourceHeaderProps) => VNodeChild;
  selectedHeader?: (props: TransferSelectedHeaderProps) => VNodeChild;
  emptyLeft?: () => VNodeChild;
  emptyRight?: () => VNodeChild;
  emptySearch?: () => VNodeChild;
}

export interface TransferExposed {
  search(value: string): void;
}
