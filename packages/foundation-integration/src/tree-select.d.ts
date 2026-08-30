interface DefaultAdapter<Props, State> {
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
}

export interface TreeSelectAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateInputValue(value: string): void;
  registerClickOutsideHandler(callback: (event: MouseEvent) => void): void;
  unregisterClickOutsideHandler(): void;
  rePositionDropdown(): void;
  updateState(states: Partial<State>): void;
  notifySelect(key: string, selected: boolean, node: Record<string, unknown>): void;
  notifySearch(
    input: string,
    filteredExpandedKeys: string[],
    filteredNodes: Record<string, unknown>[],
  ): void;
  cacheFlattenNodes(cache: boolean): void;
  openMenu(): void;
  closeMenu(callback?: () => void): void;
  getTriggerWidth(): boolean | number;
  setOptionWrapperWidth(width: null | number | string): void;
  notifyClear(event: MouseEvent | KeyboardEvent): void;
  notifyChange(value: unknown, node: unknown, event: unknown): void;
  notifyChangeWithObject(node: unknown, event: unknown): void;
  notifyExpand(
    expandedKeys: Set<string>,
    detail: { expanded: boolean; node: Record<string, unknown> },
  ): void;
  notifyFocus(event: unknown): void;
  notifyBlur(event: unknown): void;
  toggleHovering(hovering: boolean): void;
  notifyLoad(keys: Set<string>, node: Record<string, unknown>): void;
  updateInputFocus(focus: boolean): void;
  updateLoadKeys(node: Record<string, unknown>, resolve: () => void): void;
  updateIsFocus(focus: boolean): void;
}

export class TreeSelectFoundation<Props, State> {
  constructor(adapter: TreeSelectAdapter<Props, State>);
  init(): void;
  destroy(): void;
  open(): void;
  close(event: unknown): void;
  handleClick(event: MouseEvent | KeyboardEvent): void;
  handleSelectionEnterPress(event: KeyboardEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleClear(event: MouseEvent | KeyboardEvent): void;
  handleClearEnterPress(event: KeyboardEvent): void;
  handleInputChange(value: string): void;
  handleInputTriggerFocus(): void;
  handleInputTriggerBlur(): void;
  onClickSingleTriggerSearchItem(event: MouseEvent): void;
  toggleHoverState(hovering: boolean): void;
  handleNodeSelect(event: unknown, node: Record<string, unknown>): void;
  handleNodeExpand(event: unknown, node: Record<string, unknown>): void;
  handlePopoverVisibleChange(visible: boolean): void;
  handleAfterClose(): void;
  removeTag(key: string): void;
  getRenderTextInSingle(): unknown;
  getTreeNodeProps(key: string): Record<string, unknown> | null;
  getDataForKeyNotInKeyEntities(key: string): Record<string, unknown>;
  setLoadKeys(node: Record<string, unknown>, resolve: () => void): void;
}

export const treeSelectCssClasses: {
  PREFIX: 'semi-tree-select';
  PREFIX_TREE: 'semi-tree';
  PREFIX_OPTION: 'semi-tree-select-option';
};
export const treeSelectStrings: {
  SIZE_SET: readonly ['small', 'large', 'default'];
  SEARCH_POSITION_DROPDOWN: 'dropdown';
  SEARCH_POSITION_TRIGGER: 'trigger';
};
