interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
}

export interface OverflowListAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateStates(state: Partial<State>): void;
  updateVisibleState(visible: Map<string, boolean>): void;
  notifyIntersect(result: Record<string, IntersectionObserverEntry>): void;
  getItemSizeMap(): Map<string | number, number>;
}

export class OverflowListFoundation<Props, State> {
  constructor(adapter: OverflowListAdapter<Props, State>);
  init(): void;
  destroy(): void;
  getOverflowItem(): unknown[] | [unknown[], unknown[]];
  handleIntersect(entries: IntersectionObserverEntry[]): void;
  handleCollapseOverflow(): void;
}
