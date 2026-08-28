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

export interface TimePickerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  togglePanel(show: boolean): void;
  registerClickOutSide(): void;
  setInputValue(inputValue: string, callback?: () => void): void;
  unregisterClickOutSide(): void;
  notifyOpenChange(open: boolean): void;
  notifyChange(value: unknown, formatted: unknown): void;
  notifyFocus(event: FocusEvent): void;
  notifyBlur(event: FocusEvent | MouseEvent): void;
  isRangePicker(): boolean;
}

export interface TimePickerPanelChange {
  isAM: boolean;
  value: string;
  timeStampValue: number;
}

export class TimePickerFoundation<Props, State> {
  constructor(adapter: TimePickerAdapter<Props, State>);
  init(): void;
  destroy(): void;
  getPosition(): string;
  getDefaultFormatIfNeed(): string;
  getValidFormat(validFormat?: string): string;
  initDataFromDefaultValue(): void;
  refreshProps(props?: Record<string, unknown>): void;
  handleFocus(event: FocusEvent): void;
  handlePanelOpen(): void;
  handlePanelClose(clickedOutside: boolean, event: FocusEvent | MouseEvent): void;
  handleVisibleChange(visible: boolean): void;
  handlePanelChange(result: TimePickerPanelChange, index?: number): void;
  handleInputChange(input: string): void;
  handleInputBlur(event: FocusEvent): void;
  parseValue(value?: unknown): Date[];
  formatValue(dates: Date[]): string;
  validateDates(dates?: Date[]): boolean;
}

export class TimeInputFoundation<Props, State> {
  constructor(adapter: DefaultAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleFocus(event: FocusEvent): void;
  handleChange(value: string): void;
  handleBlur(event: FocusEvent): void;
  restoreCursor(): void;
}

export interface TimePickerComboboxState {
  showHour: boolean;
  showMinute: boolean;
  showSecond: boolean;
  hourOptions: number[];
  minuteOptions: number[];
  secondOptions: number[];
}

export class TimePickerComboboxFoundation<Props, State> {
  constructor(adapter: DefaultAdapter<Props, State>);
  initData(): TimePickerComboboxState;
  getDisplayDateFromTimeStamp(timeStamp: Date | string | number): Date;
}

export function formatOption(
  option: number,
  disabledOptions: number[],
): { value: string; disabled: boolean };
