interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: string): unknown;
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface TransferBasicDataItem extends Record<string, unknown> {
  key: string | number;
  label?: unknown;
  value?: string | number;
  disabled?: boolean;
  fullPath?: TransferBasicDataItem[];
}

export type TransferDataItemMap = Map<string | number, TransferBasicDataItem>;

export interface TransferAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getSelected(): TransferDataItemMap;
  updateSelected(selectedItems: TransferDataItemMap): void;
  notifyChange(values: Array<string | number>, items: TransferBasicDataItem[]): void;
  notifySearch(input: string): void;
  notifySelect(item: TransferBasicDataItem): void;
  notifyDeselect(item: TransferBasicDataItem): void;
  updateInput(input: string): void;
  updateSearchResult(searchResult: Set<string | number>): void;
  searchTree(keyword: string): void;
  updateCurrentPage(currentPage: number): void;
  notifyPageChange(currentPage: number): void;
}

export interface TransferSortEnd {
  oldIndex: number;
  newIndex: number;
}

export class TransferFoundation<Props, State> {
  constructor(adapter: TransferAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleInputChange(input: string, notify: boolean): void;
  handleAll(wantAllChecked: boolean): void;
  handleClear(): void;
  handleSelectOrRemove(item: TransferBasicDataItem): void;
  handleSelect(values: Array<string | number>): void;
  handleSortEnd(props: TransferSortEnd): void;
  handlePageChange(currentPage: number): void;
  getValuesAndItemsFromMap(selectedItems: TransferDataItemMap): {
    values: Array<string | number>;
    items: TransferBasicDataItem[];
  };
  _generatePath(item: TransferBasicDataItem & { path?: TransferBasicDataItem[] }): string;
}

export function generateTransferDataByType(
  dataSource: unknown[],
  type?: string,
): TransferBasicDataItem[];
export function generateTransferGroupedData(dataSource: unknown[]): TransferBasicDataItem[];
export function generateTransferTreeData(dataSource: unknown[]): TransferBasicDataItem[];
export function generateTransferSelectedItems(
  value: Array<string | number>,
  data: TransferBasicDataItem[],
): TransferDataItemMap;

export const transferCssClasses: { PREFIX: string };
export const transferNumbers: { DEFAULT_PAGE_SIZE: number };
export const transferStrings: {
  TYPE_GROUP_LIST: 'groupList';
  TYPE_LIST: 'list';
  TYPE_TREE_TO_LIST: 'treeList';
};
