export interface CollapsibleAdapter<Props, State> {
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
  setDOMInRenderTree(isInRenderTree: boolean): void;
  setDOMHeight(domHeight: number): void;
  setVisible(visible: boolean): void;
  setIsTransitioning(isTransitioning: boolean): void;
}

export class CollapsibleFoundation<Props, State> {
  constructor(adapter: CollapsibleAdapter<Props, State>);
  destroy(): void;
  updateDOMInRenderTree(isInRenderTree: boolean): void;
  updateDOMHeight(domHeight: number): void;
  updateVisible(visible: boolean): void;
  updateIsTransitioning(isTransitioning: boolean): void;
}
