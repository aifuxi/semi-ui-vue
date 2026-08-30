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

export type NavigationItemKey = string | number;

export interface NavigationItemFoundationProps {
  disabled?: boolean;
  indent?: boolean | number;
  isCollapsed?: boolean;
  isSubNav?: boolean;
  itemKey?: NavigationItemKey;
  link?: string;
  linkOptions?: Record<string, unknown>;
  text?: unknown;
  toggleIcon?: string;
}

export interface NavigationSelectedData {
  domEvent?: unknown;
  itemKey: NavigationItemKey;
  selectedItems?: NavigationItemFoundationProps[];
  selectedKeys?: NavigationItemKey[];
  text?: unknown;
}

export interface NavigationAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifySelect(data: NavigationSelectedData): void;
  notifyOpenChange(data: Record<string, unknown>): void;
  setIsCollapsed(isCollapsed: boolean): void;
  notifyCollapseChange(isCollapsed: boolean): void;
  updateItems(items: NavigationItemFoundationProps[]): void;
  setItemKeysMap(map: Record<string, NavigationItemKey[]>): void;
  addSelectedKeys(...keys: NavigationItemKey[]): void;
  removeSelectedKeys(...keys: NavigationItemKey[]): void;
  updateSelectedKeys(keys: NavigationItemKey[], includeParentKeys?: boolean): void;
  updateOpenKeys(keys: NavigationItemKey[]): void;
  addOpenKeys(...keys: NavigationItemKey[]): void;
  removeOpenKeys(...keys: NavigationItemKey[]): void;
  setItemsChanged(isChanged: boolean): void;
}

export interface NavigationItemAdapter<Props, State> extends DefaultAdapter<Props, State> {
  cloneDeep(value: unknown, customizer?: (value: unknown) => void): unknown;
  updateTooltipShow(showTooltip: boolean): void;
  updateSelected(selected: boolean): void;
  updateGlobalSelectedKeys(keys: NavigationItemKey[]): void;
  getSelectedKeys(): NavigationItemKey[];
  getSelectedKeysIsControlled(): boolean;
  notifyGlobalOnSelect(item: NavigationSelectedData): void;
  notifyGlobalOnClick(item: NavigationSelectedData): void;
  notifyClick(item: NavigationSelectedData): void;
  notifyMouseEnter(event: MouseEvent): void;
  notifyMouseLeave(event: MouseEvent): void;
  getIsCollapsed(): boolean;
  getSelected(): boolean;
  getIsOpen(): boolean;
}

export interface NavigationSubNavAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateIsHovered(isHovered: boolean): void;
  getOpenKeys(): NavigationItemKey[];
  getOpenKeysIsControlled(): boolean;
  getCanUpdateOpenKeys(): boolean;
  updateOpen(isOpen: boolean): void;
  notifyGlobalOpenChange(data: Record<string, unknown>): void;
  notifyGlobalOnSelect(data: Record<string, unknown>): void;
  notifyGlobalOnClick(data: Record<string, unknown>): void;
  getIsSelected(itemKey: NavigationItemKey): boolean;
  getIsOpen(): boolean;
}

export class NavigationFoundation<Props, State> {
  constructor(adapter: NavigationAdapter<Props, State>);
  static buildItemKeysMap(
    items?: Record<string, unknown>[],
    keysMap?: Record<string, NavigationItemKey[]>,
    parentKeys?: NavigationItemKey[],
    keyPropName?: string,
  ): Record<string, NavigationItemKey[]>;
  static getZeroParentKeys(
    itemKeysMap: Record<string, NavigationItemKey[]>,
    ...itemKeys: NavigationItemKey[]
  ): NavigationItemKey[];
  init(lifecycle?: string): Partial<State> | undefined;
  destroy(): void;
  selectLevelZeroParentKeys(
    itemKeysMap: Record<string, NavigationItemKey[]> | null,
    itemKeys: NavigationItemKey[],
  ): NavigationItemKey[];
  getShouldOpenKeys(
    itemKeysMap?: Record<string, NavigationItemKey[]>,
    selectedKeys?: NavigationItemKey[],
  ): NavigationItemKey[];
  handleSelect(data: NavigationSelectedData): void;
  handleCollapseChange(): void;
  handleItemsChange(isChanged: boolean): void;
}

export class NavigationItemFoundation<Props, State> {
  constructor(adapter: NavigationItemAdapter<Props, State>);
  init(): void;
  destroy(): void;
  isValidKey(itemKey: NavigationItemKey): boolean;
  handleClick(event: MouseEvent | KeyboardEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
}

export class NavigationSubNavFoundation<Props, State> {
  constructor(adapter: NavigationSubNavAdapter<Props, State>);
  init(): void;
  destroy(): void;
  clearDelayTimer(): void;
  isValidKey(itemKey: NavigationItemKey): boolean;
  handleDropdownVisibleChange(visible: boolean): void;
  handleClick(event: MouseEvent | KeyboardEvent, titleRef: HTMLElement | null): void;
  handleKeyPress(event: KeyboardEvent, titleRef: HTMLElement | null): void;
}

export class FoundationNavigationItem {
  constructor(options?: unknown);
  items: FoundationNavigationItem[] | null;
  toggleIcon: unknown;
  static isValidToggleIcon(toggleIcon: unknown): boolean;
}

export const navigationCssClasses: { PREFIX: 'semi-navigation' };
export const navigationNumbers: {
  DEFAULT_SUBNAV_MAX_HEIGHT: 999;
  DEFAULT_TOOLTIP_SHOW_DELAY: 0;
  DEFAULT_TOOLTIP_HIDE_DELAY: 100;
  DEFAULT_SUBNAV_OPEN_DELAY: 0;
  DEFAULT_SUBNAV_CLOSE_DELAY: 100;
};
export const navigationStrings: {
  MODE: readonly ['vertical', 'horizontal'];
  MODE_VERTICAL: 'vertical';
  MODE_HORIZONTAL: 'horizontal';
  ICON_POS_LEFT: 'left';
  ICON_POS_RIGHT: 'right';
  DEFAULT_LOGO_ICON_SIZE: 'extra-large';
  TOGGLE_ICON_LEFT: 'left';
  TOGGLE_ICON_RIGHT: 'right';
};
