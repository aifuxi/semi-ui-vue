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

export interface TagInputAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setInputValue(inputValue: string): void;
  setTagsArray(tagsArray: string[]): void;
  setFocusing(focusing: boolean): void;
  toggleFocusing(focused: boolean): void;
  setHovering(hovering: boolean): void;
  setActive(active: boolean): void;
  setEntering(entering: boolean): void;
  getClickOutsideHandler(): ((event: Event) => void) | null;
  registerClickOutsideHandler(callback: (event: Event) => void): void;
  unregisterClickOutsideHandler(): void;
  notifyBlur(event: FocusEvent): void;
  notifyFocus(event: FocusEvent): void;
  notifyInputChange(value: string, event: Event): void;
  notifyTagChange(value: string[]): void;
  notifyTagAdd(value: string[]): void;
  notifyTagRemove(value: string, index: number): void;
  notifyKeyDown(event: KeyboardEvent): void;
}

export interface TagInputSortEnd {
  oldIndex: number;
  newIndex: number;
}

export class TagInputFoundation<Props, State> {
  constructor(adapter: TagInputAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleInputChange(event: Event): void;
  handleInputCompositionStart(event: CompositionEvent): void;
  handleInputCompositionEnd(event: CompositionEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleInputFocus(event: FocusEvent): void;
  handleClearEnterPress(event: KeyboardEvent): void;
  handleClearBtn(event: MouseEvent | KeyboardEvent): void;
  handleTagClose(index: number): void;
  handleInputMouseEnter(): void;
  handleInputMouseLeave(): void;
  handleClick(event?: MouseEvent): void;
  clickOutsideCallBack(): void;
  handleClickPrefixOrSuffix(event: MouseEvent): void;
  handlePreventMouseDown(event: MouseEvent): void;
  handleSortEnd(props: TagInputSortEnd): void;
}
