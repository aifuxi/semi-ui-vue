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

export interface SpinAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setLoading(value: boolean): void;
}

export class SpinFoundation<Props, State> {
  constructor(adapter: SpinAdapter<Props, State>);
  init(): void;
  destroy(): void;
  updateLoadingIfNeedDelay(): void;
}
