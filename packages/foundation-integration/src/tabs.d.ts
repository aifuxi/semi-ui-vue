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

export interface TabsAdapter<Props, State> extends DefaultAdapter<Props, State> {
  collectPane(): void;
  collectActiveKey(): void;
  notifyTabClick(activeKey: string, event: MouseEvent | KeyboardEvent): void;
  notifyChange(activeKey: string): void;
  setNewActiveKey(activeKey: string): void;
  getDefaultActiveKeyFromChildren(): string;
  notifyTabDelete(tabKey: string): void;
}

export class TabsFoundation<Props, State> {
  constructor(adapter: TabsAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleTabClick(activeKey: string, event: MouseEvent | KeyboardEvent): void;
  handleNewActiveKey(activeKey: string): void;
  getDefaultActiveKey(): string;
  handleTabListChange(): void;
  handleTabPanesChange(): void;
  handleTabDelete(tabKey: string): void;
  handleKeyDown(event: KeyboardEvent, itemKey: string, closable: boolean): void;
}
