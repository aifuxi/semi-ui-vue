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

export type PaginationPage = number | '...';

export interface PaginationPageListState {
  pageList: PaginationPage[];
  restLeftPageList: number[];
  restRightPageList: number[];
}

export interface PaginationAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setPageList(state: PaginationPageListState): void;
  setDisabled(previous: boolean, next: boolean): void;
  updateTotal(total: number): void;
  updatePageSize(pageSize: number): void;
  updateQuickJumpPage(page: string | number): void;
  updateAllPageNumbers(pages: number[]): void;
  setCurrentPage(page: number): void;
  registerKeyDownHandler(handler: (event: KeyboardEvent) => void): void;
  unregisterKeyDownHandler(handler: (event: KeyboardEvent) => void): void;
  notifyPageChange(page: number): void;
  notifyPageSizeChange(pageSize: number): void;
  notifyChange(page: number, pageSize: number): void;
}

export class PaginationFoundation<Props, State> {
  constructor(adapter: PaginationAdapter<Props, State>);
  init(): void;
  destroy(): void;
  goPage(page: PaginationPage): void;
  goPrev(): void;
  goNext(): void;
  updatePage(page?: number, total?: number, pageSize?: number): void;
  updateAllPageNumbers(total: number, pageSize: number): void;
  changePageSize(pageSize: number): void;
  pageSizeInOpts(): number[];
  handleQuickJumpNumberChange(page: string | number): void;
  handleQuickJumpBlur(): void;
  handleQuickJumpEnterPress(page: string | number): void;
  _getTotalPageNumber(total: number, pageSize: number): number;
}
