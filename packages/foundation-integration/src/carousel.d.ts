export interface CarouselAdapter<Props, State> {
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
  notifyChange(activeIndex: number, preIndex: number): void;
  setNewActiveIndex(activeIndex: number): void;
  setPreActiveIndex(activeIndex: number): void;
  setIsReverse(isReverse: boolean): void;
  setIsInit(isInit: boolean): void;
  getChildren(): unknown[];
}

export class CarouselFoundation<Props, State> {
  constructor(adapter: CarouselAdapter<Props, State>);
  destroy(): void;
  getDefaultActiveIndex(): number;
  getIsControlledComponent(): boolean;
  getSwitchingTime(): number;
  getValidIndex(index: number): number;
  goTo(activeIndex: number): void;
  handleAutoPlay(): void;
  handleKeyDown(event: KeyboardEvent): void;
  next(): void;
  onIndicatorChange(activeIndex: number): void;
  play(interval: number): void;
  prev(): void;
  setForcePlay(forcePlay: boolean): void;
  stop(): void;
}
