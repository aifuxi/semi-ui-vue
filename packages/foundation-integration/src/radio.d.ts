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

export interface RadioAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setHover(hover: boolean): void;
  setChecked(checked: boolean): void;
  setAddonId(): void;
  setExtraId(): void;
  setFocusVisible(focusVisible: boolean): void;
}

export interface RadioInnerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyChange(event: unknown): void;
  setNativeControlChecked(checked: boolean): void;
}

export interface RadioGroupAdapter<Props, State> extends DefaultAdapter<Props, State> {
  isInProps(name: string): boolean;
  notifyChange(event: unknown): void;
  setValue(value: unknown): void;
}

export class RadioFoundation<Props, State> {
  constructor(adapter: RadioAdapter<Props, State>);
  init(): void;
  destroy(): void;
  setHover(hover: boolean): void;
  setChecked(checked: boolean): void;
  handleFocusVisible(event: FocusEvent): void;
  handleBlur(): void;
}

export class RadioInnerFoundation<Props, State> {
  constructor(adapter: RadioInnerAdapter<Props, State>);
  init(): void;
  destroy(): void;
  setChecked(checked: boolean): void;
  getChecked(): unknown;
  handleChange(event: Event): void;
}

export class RadioGroupFoundation<Props, State> {
  constructor(adapter: RadioGroupAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleChange(event: unknown): void;
  handlePropValueChange(value: unknown): void;
}
