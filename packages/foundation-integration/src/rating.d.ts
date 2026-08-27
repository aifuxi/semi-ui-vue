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

export interface RatingAdapter<Props, State> extends DefaultAdapter<Props, State> {
  focus(): void;
  getStarDOM(index: number): Element;
  notifyHoverChange(hoverValue: number | undefined, clearedValue: number | null): void;
  updateValue(value: number): void;
  clearValue(clearedValue: number | null): void;
  notifyFocus(event: FocusEvent): void;
  notifyBlur(event: FocusEvent): void;
  notifyKeyDown(event: KeyboardEvent): void;
  setEmptyStarFocusVisible(focusVisible: boolean): void;
}

export interface RatingItemAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setFirstStarFocus(value: boolean): void;
  setSecondStarFocus(value: boolean): void;
}

export class RatingFoundation<Props, State> {
  constructor(adapter: RatingAdapter<Props, State>);
  init(): void;
  destroy(): void;
  getStarValue(index: number, position: number): number;
  handleHover(event: MouseEvent, index: number): void;
  handleMouseLeave(): void;
  handleClick(event: MouseEvent | KeyboardEvent, index: number): void;
  handleFocus(event: FocusEvent): void;
  handleBlur(event: FocusEvent): void;
  handleKeyDown(event: KeyboardEvent, value: number): void;
  handleStarFocusVisible(event: FocusEvent): void;
  handleStarBlur(event: FocusEvent): void;
}

export class RatingItemFoundation<Props, State> {
  constructor(adapter: RatingItemAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleFocusVisible(event: FocusEvent, star: 'first' | 'second'): void;
  handleBlur(event: FocusEvent, star: 'first' | 'second'): void;
}
