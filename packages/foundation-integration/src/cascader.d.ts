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

export interface CascaderAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyClear(): void;
  updateInputValue(value: string): void;
  updateInputPlaceHolder(value: string): void;
  focusInput(): void;
  blurInput(): void;
  registerClickOutsideHandler(callback: (event: MouseEvent) => void): void;
  unregisterClickOutsideHandler(): void;
  rePositionDropdown(): void;
  updateStates(states: Partial<State>): void;
  openMenu(): void;
  closeMenu(callback?: () => void): void;
  updateSelection(selectedKeys: Set<string>): void;
  notifyChange(value: unknown): void;
  notifySelect(value: unknown): void;
  notifyOnSearch(input: string): void;
  notifyFocus(event: unknown): void;
  notifyBlur(event: unknown): void;
  notifyDropdownVisibleChange(visible: boolean): void;
  toggleHovering(hovering: boolean): void;
  notifyLoadData(selectedOptions: Record<string, unknown>[], callback: () => void): void;
  notifyOnLoad(loadedKeys: Set<string>, data: Record<string, unknown>): void;
  notifyListScroll(event: Event, panel: Record<string, unknown>): void;
  notifyOnExceed(data: Record<string, unknown>[]): void;
  toggleInputShow(show: boolean, callback: () => void): void;
  updateFocusState(focus: boolean): void;
  updateLoadingKeyRefValue(keys: Set<string>): void;
  getLoadingKeyRefValue(): Set<string>;
  updateLoadedKeyRefValue(keys: Set<string>): void;
  getLoadedKeyRefValue(): Set<string>;
  setEmptyContentMinWidth(width: number | string): void;
  getTriggerWidth(): number;
}

export class CascaderFoundation<Props, State> {
  constructor(adapter: CascaderAdapter<Props, State>);
  init(): void;
  destroy(): void;
  collectOptions(init?: boolean): void;
  recalculateFilteredKeys(input?: string, entities?: Record<string, unknown>): void;
  handleValueChange(value: unknown): void;
  open(): void;
  close(event?: unknown, key?: string): void;
  focus(): void;
  blur(): void;
  updateSearching(searching: boolean): void;
  handleItemClick(event: MouseEvent | KeyboardEvent, item: Record<string, unknown>): void;
  handleItemHover(event: MouseEvent, item: Record<string, unknown>): void;
  onItemCheckboxClick(item: Record<string, unknown>): void;
  handleClick(event: MouseEvent | KeyboardEvent): void;
  handleSelectionEnterPress(event: KeyboardEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  toggleHoverState(hovering: boolean): void;
  getItemPropPath(
    key: string,
    prop: string | unknown[],
    entities?: Record<string, unknown>,
  ): unknown[];
  handleInputChange(value: string): void;
  handleClear(): void;
  handleClearEnterPress(event: KeyboardEvent): void;
  getRenderData(): Record<string, unknown>[];
  handleListScroll(event: Event, panelIndex: number): void;
  handleTagRemoveByKey(key: string): void;
  handleTagRemoveInTrigger(position: string): void;
}

export interface CascaderKeyMaps {
  value?: string;
  label?: string;
  disabled?: string;
  children?: string;
  isLeaf?: string;
}

export function convertCascaderDataToEntities(
  data: Record<string, unknown>[],
  keyMaps?: CascaderKeyMaps,
): Record<string, Record<string, unknown>>;
export function calcCascaderMergeType(autoMergeValue: boolean, leafOnly: boolean): string;
export function getCascaderKeyByValuePath(valuePath: Array<string | number>): string;
export function getCascaderKeysByValuePath(
  valuePath: Array<string | number> | Array<Array<string | number>>,
): string[];
export function getCascaderKeyByPosition(
  position: string,
  treeData: Record<string, unknown>[],
  keyMaps?: CascaderKeyMaps,
): string;
export function getCascaderValueOrKey(
  data: Record<string, unknown> | Record<string, unknown>[],
  keyMaps?: CascaderKeyMaps,
): unknown;

export const cascaderCssClasses: {
  PREFIX: 'semi-cascader';
  PREFIX_OPTION: 'semi-cascader-option';
};
export const cascaderNumbers: Record<string, never>;
export const cascaderStrings: {
  SIZE_SET: readonly ['small', 'large', 'default'];
  VALIDATE_STATUS: readonly ['success', 'default', 'error', 'warning'];
  SHOW_NEXT_BY_CLICK: 'click';
  SHOW_NEXT_BY_HOVER: 'hover';
  LEAF_ONLY_MERGE_TYPE: 'leafOnly';
  AUTO_MERGE_VALUE_MERGE_TYPE: 'autoMergeValue';
  NONE_MERGE_TYPE: 'none';
  SEARCH_POSITION_TRIGGER: 'trigger';
  SEARCH_POSITION_CUSTOM: 'custom';
  RELATED: 'related';
  UN_RELATED: 'unRelated';
};
