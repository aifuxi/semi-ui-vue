import type { CSSProperties, HTMLAttributes, VNodeChild } from 'vue';

export type TreePrimitive = string | number;
export type TreeValue = TreePrimitive | TreeNodeData | Array<TreePrimitive | TreeNodeData>;
export type TreeCheckRelation = 'related' | 'unRelated';
export type TreeExpandAction = false | 'click' | 'doubleClick';

export interface TreeKeyMaps extends Record<string, string | undefined> {
  key?: string;
  label?: string;
  value?: string;
  children?: string;
  disabled?: string;
  isLeaf?: string;
  icon?: string;
}

export interface TreeNodeData extends Record<string, unknown> {
  key?: string;
  value?: TreePrimitive;
  label?: VNodeChild;
  icon?: VNodeChild;
  disabled?: boolean;
  isLeaf?: boolean;
  children?: TreeNodeData[];
}

export interface TreeVirtualize {
  itemSize: number;
  height?: number | string;
  width?: number | string;
}

export interface TreeExpandDetail {
  expanded: boolean;
  node: TreeNodeData;
}

export interface TreeDragNode extends TreeNodeData {
  expanded: boolean;
  pos: string;
}

export interface TreeDragProps {
  event: DragEvent;
  node: TreeDragNode;
}

export interface TreeDragEnterProps extends TreeDragProps {
  expandedKeys?: string[];
}

export interface TreeDropProps extends TreeDragProps {
  dragNode: TreeDragNode;
  dragNodesKeys: string[];
  dropPosition: number;
  dropToGap: boolean;
}

export interface TreeSearchSlotProps {
  className: string;
  placeholder: string;
  prefix: VNodeChild;
  showClear: boolean;
  value: string;
  onChange(value: string): void;
}

export interface TreeExpandIconSlotProps {
  className: string;
  expanded: boolean;
  onClick(event: MouseEvent | KeyboardEvent): void;
}

export interface TreeFullLabelSlotProps {
  className: string;
  data: TreeNodeData;
  level: number;
  style?: CSSProperties;
  expandIcon: VNodeChild;
  checkStatus: { checked: boolean; halfChecked: boolean };
  expandStatus: { expanded: boolean; loading: boolean };
  filtered?: boolean;
  searchWord?: string;
  onClick(event: MouseEvent | KeyboardEvent): void;
  onContextMenu(event: MouseEvent): void;
  onDoubleClick(event: MouseEvent): void;
  onExpand(event: MouseEvent | KeyboardEvent): void;
  onCheck(event: MouseEvent | KeyboardEvent): void;
}

export interface TreeProps {
  ariaLabel?: string;
  autoExpandParent?: boolean;
  autoExpandWhenDragEnter?: boolean;
  autoMergeValue?: boolean;
  blockNode?: boolean;
  checkRelation?: TreeCheckRelation;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  defaultExpandAll?: boolean;
  defaultExpandedKeys?: string[];
  defaultValue?: TreeValue;
  directory?: boolean;
  disabled?: boolean;
  disableStrictly?: boolean;
  draggable?: boolean;
  emptyContent?: VNodeChild;
  expandAction?: TreeExpandAction;
  expandAll?: boolean;
  expandedKeys?: string[];
  expandIcon?: VNodeChild | ((props: TreeExpandIconSlotProps) => VNodeChild);
  filterTreeNode?:
    boolean | ((inputValue: string, treeNodeString: string, data?: TreeNodeData) => boolean);
  hideDraggingNode?: boolean;
  icon?: VNodeChild | ((props: Record<string, unknown>) => VNodeChild);
  keyMaps?: TreeKeyMaps;
  labelEllipsis?: boolean;
  leafOnly?: boolean;
  loadData?: (node?: TreeNodeData) => Promise<void>;
  loadedKeys?: string[];
  modelValue?: TreeValue;
  motion?: boolean;
  multiple?: boolean;
  onChangeWithObject?: boolean;
  preventScroll?: boolean;
  renderDraggingNode?: (node: HTMLElement, data: TreeNodeData) => HTMLElement;
  renderFullLabel?: (props: TreeFullLabelSlotProps) => VNodeChild;
  renderLabel?: (label?: VNodeChild, data?: TreeNodeData, searchWord?: string) => VNodeChild;
  searchClassName?: HTMLAttributes['class'];
  searchPlaceholder?: string;
  searchRender?: ((props: TreeSearchSlotProps) => VNodeChild) | false;
  searchStyle?: CSSProperties;
  showClear?: boolean;
  showFilteredOnly?: boolean;
  showLine?: boolean;
  style?: CSSProperties;
  treeData?: TreeNodeData[];
  treeDataSimpleJson?: Record<string, unknown>;
  treeNodeFilterProp?: string;
  value?: TreeValue;
  virtualize?: TreeVirtualize;
}

export interface TreeEmits {
  change: [value?: TreeValue];
  contextMenu: [event: MouseEvent, node: TreeNodeData];
  doubleClick: [event: MouseEvent, node: TreeNodeData];
  dragEnd: [props: TreeDragProps];
  dragEnter: [props: TreeDragEnterProps];
  dragLeave: [props: TreeDragProps];
  dragOver: [props: TreeDragProps];
  dragStart: [props: TreeDragProps];
  drop: [props: TreeDropProps];
  expand: [expandedKeys: string[], detail: TreeExpandDetail];
  load: [loadedKeys: Set<string>, node?: TreeNodeData];
  search: [input: string, filteredExpandedKeys: string[]];
  select: [key: string, selected: boolean, node: TreeNodeData];
  'update:expandedKeys': [keys: string[]];
  'update:modelValue': [value?: TreeValue];
  'update:value': [value?: TreeValue];
}

export interface TreeSlots {
  empty?: () => VNodeChild;
  expandIcon?: (props: TreeExpandIconSlotProps) => VNodeChild;
  fullLabel?: (props: TreeFullLabelSlotProps) => VNodeChild;
  icon?: (props: { node: TreeNodeData; expanded: boolean }) => VNodeChild;
  label?: (props: { label?: VNodeChild; node: TreeNodeData; searchWord?: string }) => VNodeChild;
  search?: (props: TreeSearchSlotProps) => VNodeChild;
}

export interface TreeExposed {
  search(value: string): void;
  scrollTo(data: { key: string; align?: 'center' | 'start' | 'end' | 'smart' | 'auto' }): void;
  focus(): void;
}

export interface TreeNodeProps extends TreeNodeData {
  className?: HTMLAttributes['class'];
  style?: CSSProperties;
}
