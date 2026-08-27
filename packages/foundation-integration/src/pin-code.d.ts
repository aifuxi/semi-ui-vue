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

export interface PinCodeAdapter<Props, State> extends DefaultAdapter<Props, State> {
  onCurrentActiveIndexChange(index: number): Promise<void> | void;
  notifyValueChange(values: string[]): void;
  changeSpecificInputFocusState(index: number, state: 'blur' | 'focus'): void;
  updateValueList(valueList: string[]): Promise<void> | void;
}

export class PinCodeFoundation<Props, State> {
  static numberReg: RegExp;
  static mixedReg: RegExp;

  constructor(adapter: PinCodeAdapter<Props, State>);
  handleCurrentActiveIndexChange(index: number, state: 'focus' | 'blur'): void;
  completeSingleInput(index: number, value: string): Promise<void>;
  validateValue(value?: string): boolean;
  updateValueList(valueList: string[]): Promise<void>;
  handlePaste(event: ClipboardEvent, startInputIndex: number): Promise<void>;
  handleKeyDownOnSingleInput(event: KeyboardEvent, index: number): void;
}
