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

export interface InputAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setValue(value: string | number): void;
  setMinLength(minLength: number): void;
  notifyChange(value: string, event: Event): void;
  notifyClear(event: Event): void;
  notifyBlur(value: string | number, event: FocusEvent): void;
  setEyeClosed(eyeClosed: boolean): void;
  toggleFocusing(focused: boolean): void;
  focusInput(): void;
  notifyFocus(value: string | number, event: FocusEvent): void;
  notifyInput(event: Event): void;
  notifyKeyDown(event: KeyboardEvent): void;
  notifyKeyUp(event: KeyboardEvent): void;
  notifyKeyPress(event: KeyboardEvent): void;
  notifyEnterPress(event: KeyboardEvent): void;
  notifyCompositionStart(event: CompositionEvent): void;
  notifyCompositionEnd(event: CompositionEvent): void;
  notifyCompositionUpdate(event: CompositionEvent): void;
  isEventTarget(event: Event): boolean;
}

export interface TextAreaAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setValue(value: string): void;
  setMinLength(length: number): void;
  notifyChange(value: string, event: Event): void;
  notifyClear(event: Event): void;
  notifyBlur(value: string, event: FocusEvent): void;
  notifyFocus(value: string, event: FocusEvent): void;
  notifyKeyDown(event: KeyboardEvent): void;
  notifyPressEnter(event: KeyboardEvent): void;
  notifyCompositionStart(event: CompositionEvent): void;
  notifyCompositionEnd(event: CompositionEvent): void;
  notifyCompositionUpdate(event: CompositionEvent): void;
  notifyHeightUpdate(height: number): void;
  toggleFocusing(focusing: boolean): void;
  toggleHovering(hovering: boolean): void;
  getRef(): HTMLTextAreaElement | null;
  focusInput(): void;
  isEventTarget(event: Event): boolean;
}

export class InputFoundation<Props, State> {
  constructor(adapter: InputAdapter<Props, State>);
  init(): void;
  destroy(): void;
  setValue(value: string | number): void;
  handleChange(value: string, event: Event): void;
  handleCompositionStart(event: CompositionEvent): void;
  handleCompositionEnd(event: CompositionEvent): void;
  handleCompositionUpdate(event: CompositionEvent): void;
  handleClear(event: Event): void;
  handleClick(event: Event): void;
  handleModeChange(mode?: string): void;
  handleClickEye(event: Event): void;
  handleInputType(type: string): string;
  handleMouseDown(event: Event): void;
  handleMouseUp(event: Event): void;
  handleBlur(event: FocusEvent): void;
  handleFocus(event: FocusEvent): void;
  handleInput(event: Event): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyUp(event: KeyboardEvent): void;
  handleKeyPress(event: KeyboardEvent): void;
  isAllowClear(): boolean;
  handleClickPrefixOrSuffix(event: Event): void;
  handlePreventMouseDown(event: Event): void;
  handleModeEnterPress(event: KeyboardEvent): void;
}

export class TextAreaFoundation<Props, State> {
  constructor(adapter: TextAreaAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleValueChange(value: string): void;
  handleChange(value: string, event: Event): void;
  handleCompositionStart(event: CompositionEvent): void;
  handleCompositionEnd(event: CompositionEvent): void;
  handleCompositionUpdate(event: CompositionEvent): void;
  handleFocus(event: FocusEvent): void;
  handleBlur(event: FocusEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  resizeTextarea(): void;
  handleMouseEnter(event: MouseEvent): void;
  handleMouseLeave(event: MouseEvent): void;
  isAllowClear(): boolean;
  handleClear(event: Event): void;
  handleClick(event: Event): void;
  handleCounterClick(event: Event): void;
}
