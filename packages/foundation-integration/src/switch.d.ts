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

export interface SwitchAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setNativeControlChecked(checked: boolean | undefined): void;
  setNativeControlDisabled(disabled: boolean | undefined): void;
  setFocusVisible(focusVisible: boolean): void;
  notifyChange(checked: boolean, event: Event): void;
}

export class SwitchFoundation<Props, State> {
  constructor(adapter: SwitchAdapter<Props, State>);
  init(): void;
  destroy(): void;
  setChecked(checked: boolean | undefined): void;
  setDisabled(disabled: boolean | undefined): void;
  handleChange(checked: boolean, event: Event): void;
  handleFocusVisible(event: FocusEvent): void;
  handleBlur(): void;
}
