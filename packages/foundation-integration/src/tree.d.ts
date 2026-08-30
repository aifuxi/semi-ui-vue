export interface TreeFoundationNode extends Record<string, unknown> {
  data?: Record<string, unknown>;
  eventKey?: string;
  key?: string;
}

export interface TreeEntity<Node extends Record<string, unknown>> extends Record<string, unknown> {
  data: Node;
  key: string;
}

export interface TreeFlattenNode<Node extends Record<string, unknown>> extends Record<
  string,
  unknown
> {
  data: Node;
  key: string;
}

export interface TreeAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: keyof Props): unknown;
  getProps(): Props;
  getState(key: keyof State): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
  updateInputValue(value: string): void;
  focusInput(): void;
  updateState(states: Partial<State>): void;
  notifyExpand(
    expandedKeys: Set<string>,
    detail: { expanded: boolean; node: Record<string, unknown> },
  ): void;
  notifySelect(key: string, selected: boolean, node: Record<string, unknown>): void;
  notifyChange(value: unknown): void;
  notifySearch(input: string, filteredExpandedKeys: string[]): void;
  notifyRightClick(event: MouseEvent, node: Record<string, unknown>): void;
  notifyDoubleClick(event: MouseEvent, node: Record<string, unknown>): void;
  cacheFlattenNodes(cache: boolean): void;
  setDragNode(node: Record<string, unknown> | null): void;
}

export class TreeFoundation<Props, State> {
  constructor(adapter: TreeAdapter<Props, State>);
  destroy(): void;
  getTreeNodeProps(key: string): Record<string, unknown> | null;
  handleInputChange(value: string): void;
  handleNodeSelect(event: MouseEvent | KeyboardEvent, node: TreeFoundationNode): void;
  handleNodeExpand(event: MouseEvent | KeyboardEvent, node: TreeFoundationNode): void;
  handleNodeRightClick(event: MouseEvent, node: TreeFoundationNode): void;
  handleNodeDoubleClick(event: MouseEvent, node: TreeFoundationNode): void;
  handleNodeLoad(
    loaded: Set<string>,
    loading: Set<string>,
    data: Record<string, unknown>,
    resolve: () => void,
  ): Partial<State>;
  handleNodeDragStart(event: DragEvent, node: TreeFoundationNode): void;
  handleNodeDragEnter(
    event: DragEvent,
    node: TreeFoundationNode,
    dragNode: TreeFoundationNode | null,
  ): void;
  handleNodeDragOver(
    event: DragEvent,
    node: TreeFoundationNode,
    dragNode: TreeFoundationNode | null,
  ): void;
  handleNodeDragLeave(event: DragEvent, node: TreeFoundationNode): void;
  handleNodeDragEnd(event: DragEvent, node: TreeFoundationNode): void;
  handleNodeDrop(
    event: DragEvent,
    node: TreeFoundationNode,
    dragNode: TreeFoundationNode | null,
  ): void;
}

export function convertJsonToData(data: Record<string, unknown>): Record<string, unknown>[];
export function convertDataToEntities<Node extends Record<string, unknown>>(
  data: Node[],
  keyMaps?: Record<string, string | undefined>,
): {
  keyEntities: Record<string, TreeEntity<Node>>;
  valueEntities: Record<string, string>;
};
export function flattenTreeData<Node extends Record<string, unknown>>(
  data: Node[],
  expanded: Set<string>,
  keyMaps?: Record<string, string | undefined>,
  filtered?: Set<string> | false,
): TreeFlattenNode<Node>[];
export function findKeysForValues(
  value: unknown,
  entities: Record<string, string>,
  multiple?: boolean,
): string[];
export function normalizeValue(
  value: unknown,
  withObject: boolean,
  keyMaps?: Record<string, string | undefined>,
): unknown;
export function normalizeKeyList<Node extends Record<string, unknown>>(
  keys: string[],
  entities: Record<string, TreeEntity<Node>>,
  leafOnly?: boolean,
  includeHalfChecked?: boolean,
): string[];
export function calcExpandedKeys<Node extends Record<string, unknown>>(
  keys: string[],
  entities: Record<string, TreeEntity<Node>>,
  autoExpandParent?: boolean,
): Set<string>;
export function calcExpandedKeysForValues<Node extends Record<string, unknown>>(
  value: unknown,
  entities: Record<string, TreeEntity<Node>>,
  multiple: boolean,
  valueEntities: Record<string, string>,
): Set<string>;
export function calcCheckedKeys<Node extends Record<string, unknown>>(
  keys: string[],
  entities: Record<string, TreeEntity<Node>>,
): { checkedKeys: Set<string>; halfCheckedKeys: Set<string> };
export function calcDisabledKeys<Node extends Record<string, unknown>>(
  entities: Record<string, TreeEntity<Node>>,
  keyMaps?: Record<string, string | undefined>,
): Set<string>;
export function filterTreeData<Node extends Record<string, unknown>>(
  info: Record<string, unknown>,
): {
  flattenNodes: TreeFlattenNode<Node>[];
  filteredKeys: Set<string>;
  filteredExpandedKeys: Set<string>;
  filteredShownKeys: Set<string>;
};
