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

export interface CheckboxAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getIsInGroup(): boolean;
  getGroupValue(): unknown[];
  notifyGroupChange(event: unknown): void;
  getGroupDisabled(): boolean;
  setNativeControlChecked(checked: boolean): void;
  notifyChange(event: unknown): void;
  setAddonId(): void;
  setExtraId(): void;
  setFocusVisible(focusVisible: boolean): void;
  focusCheckboxEntity(): void;
  generateEvent(checked: boolean, event: Event): unknown;
}

export interface CheckboxGroupAdapter<Props, State> extends DefaultAdapter<Props, State> {
  updateGroupValue(value: unknown[]): void;
  notifyChange(value: unknown[]): void;
}

export class CheckboxFoundation<Props, State> {
  constructor(adapter: CheckboxAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleChange(event: Event): void;
  handleEnterPress(event: KeyboardEvent): void;
  handleFocusVisible(event: FocusEvent): void;
  handleBlur(): void;
  setChecked(checked: boolean): void;
}

export class CheckboxGroupFoundation<Props, State> {
  constructor(adapter: CheckboxGroupAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleChange(event: unknown): void;
  handlePropValueChange(value: unknown[] | undefined): void;
  getFormatName(): string;
}
