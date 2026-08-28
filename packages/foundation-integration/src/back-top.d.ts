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

export interface BackTopAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateVisible(visible: boolean): void;
  notifyClick(event: MouseEvent): void;
  targetIsWindow(target: unknown): boolean;
  isWindowUndefined(): boolean;
  targetScrollToTop(target: unknown, scrollTop: number): void;
}

export class BackTopFoundation<Props, State> {
  constructor(adapter: BackTopAdapter<Props, State>);
  init(): void;
  destroy(): void;
  getScroll(target: unknown): number;
  scrollTo(target: unknown, from: number, to: number): void;
  setScrollTop(to: number): void;
  handleScroll(): void;
  onClick(event: MouseEvent): void;
}
