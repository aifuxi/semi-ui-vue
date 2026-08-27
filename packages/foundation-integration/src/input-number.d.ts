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

export interface InputNumberAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setValue(value: number | string, callback?: () => void): void;
  setNumber(value: number | null, callback?: () => void): void;
  setFocusing(value: boolean, callback?: () => void): void;
  setHovering(value: boolean): void;
  notifyChange(value: number | string, event?: Event | null): void;
  notifyNumberChange(value: number, event?: Event | null): void;
  notifyBlur(event: FocusEvent): void;
  notifyFocus(event: FocusEvent): void;
  notifyUpClick(value: string, event: MouseEvent): void;
  notifyDownClick(value: string, event: MouseEvent): void;
  notifyKeyDown(event: KeyboardEvent): void;
  registerGlobalEvent(eventName: string, handler: EventListener): void;
  unregisterGlobalEvent(eventName: string): void;
  recordCursorPosition(): void;
  restoreByAfter(value?: string): boolean;
  restoreCursor(value?: string): boolean;
  fixCaret(start: number, end: number): void;
  setClickUpOrDown(value: boolean): void;
  updateStates(states: Partial<State>, callback?: () => void): void;
  getInputCharacter(index: number): string;
}

export class InputNumberFoundation<Props, State> {
  constructor(adapter: InputNumberAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleInputFocus(event: FocusEvent): void;
  handleInputChange(value: string, event: Event): void;
  handleInputKeyDown(event: KeyboardEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleInputMouseEnter(event?: MouseEvent): void;
  handleInputMouseLeave(event?: MouseEvent): void;
  handleInputMouseMove(event?: MouseEvent): void;
  handleMouseUp(event?: MouseEvent): void;
  handleUpClick(event: MouseEvent): void;
  handleDownClick(event: MouseEvent): void;
  handleMouseLeave(event: MouseEvent): void;
  doFormat(value?: string | number, needAdjustPrec?: boolean, needAdjustCurrency?: boolean): string;
  doParse(
    value: string | number,
    needCheckPrec?: boolean,
    needAdjustPrec?: boolean,
    needAdjustMaxMin?: boolean,
  ): number;
  isValidNumber(value: number, needCheckPrec?: boolean): boolean;
  updateStates(states: Partial<State>, callback?: () => void): void;
  notifyChange(value: string, event?: Event | null): void;
  _isCurrency(): boolean;
}
