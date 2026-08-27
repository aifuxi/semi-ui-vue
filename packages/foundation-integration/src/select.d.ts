export interface SelectAdapter<P = Record<string, unknown>, S = Record<string, unknown>> {
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
  persistEvent(): void;
  [key: string]: unknown;
}

export declare class SelectFoundation<P = Record<string, unknown>, S = Record<string, unknown>> {
  constructor(adapter: SelectAdapter<P, S>);
  init(): void;
  destroy(): void;
  open(input?: string): void;
  close(config?: { event?: Event; closeCb?: () => void; notToggleInput?: boolean }): void;
  focus(options?: unknown[], openDropdown?: boolean): void;
  clearInput(event?: Event): void;
  clearSelected(): void;
  selectAll(): void;
  handleValueChange(value: unknown): void;
  handleOptionListChange(): void;
  handleOptionListChangeHadDefaultValue(): void;
  handleClick(event: Event): void;
  handleInputChange(value: string, event?: Event): void;
  handleClearClick(event: Event): void;
  handleMouseEnter(event: MouseEvent): void;
  handleMouseLeave(event: MouseEvent): void;
  handleTriggerFocus(event: FocusEvent): void;
  handleTriggerBlur(event: FocusEvent): void;
  handleInputBlur(event: FocusEvent): void;
  handleContainerKeyDown(event: KeyboardEvent): void;
  handleOptionMouseEnter(index: number): void;
  handleListScroll(event: Event): void;
  handleSlotMouseEnter(): void;
  handlePopoverClose(): void;
  onSelect(option: unknown, index: number, event: Event): void;
  removeTag(option: unknown): void;
  updateOverflowItemCount(length: number, overflow?: number): void;
  _handleKeyDown(event: KeyboardEvent): void;
}
