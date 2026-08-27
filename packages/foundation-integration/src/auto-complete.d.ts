export interface AutoCompleteAdapter<P = Record<string, unknown>, S = Record<string, unknown>> {
  getContext(): unknown;
  getContexts(): unknown;
  getProp(key: keyof P): unknown;
  getProps(): P;
  getState(key: keyof S): unknown;
  getStates(): S;
  setState(state: Partial<S>, callback?: () => void): void;
  getCache(key: unknown): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): void;
  stopPropagation(event?: Event): void;
  persistEvent(event?: Event): void;
  getTriggerWidth(): number | undefined;
  setOptionWrapperWidth(width: string | number): void;
  updateInputValue(value: string | number): void;
  toggleListVisible(visible: boolean): void;
  updateOptionList(options: unknown[]): void;
  updateScrollTop(index?: number): void;
  updateSelection(selection: Map<unknown, unknown>): void;
  notifySearch(value: string): void;
  notifyChange(value: string | number): void;
  notifySelect(value: unknown): void;
  notifyDropdownVisibleChange(visible: boolean): void;
  notifyClear(): void;
  notifyFocus(event?: FocusEvent): void;
  notifyBlur(event?: FocusEvent): void;
  notifyKeyDown(event: KeyboardEvent): void;
  rePositionDropdown(): void;
  registerKeyDown(callback: (event: KeyboardEvent) => void): void;
  unregisterKeyDown(callback: (event: KeyboardEvent) => void): void;
  updateFocusIndex(index: number): void;
  registerClickOutsideHandler(callback: (event: MouseEvent) => void): void;
  unregisterClickOutsideHandler(): void;
}

export declare class AutoCompleteFoundation<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  constructor(adapter: AutoCompleteAdapter<P, S>);
  init(): void;
  destroy(): void;
  openDropdown(): void;
  closeDropdown(event?: Event): void;
  handleInputClick(event?: MouseEvent): void;
  handleSearch(value: string): void;
  handleSelect(option: unknown, index?: number): void;
  handleDataChange(data: unknown[]): void;
  handleValueChange(value: unknown): void;
  handleClear(): void;
  handleFocus(event: FocusEvent): void;
  handleBlur(event: FocusEvent): void;
  handleOptionMouseEnter(index: number): void;
}
