export type DatePickerBaseValue = string | number | Date;
export type DatePickerFoundationValue = DatePickerBaseValue | DatePickerBaseValue[];
export type DatePickerRangeFocus = 'rangeStart' | 'rangeEnd' | false;

interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
}

export interface FoundationDatePickerProps extends Record<string, unknown> {
  value?: DatePickerFoundationValue;
  defaultValue?: DatePickerFoundationValue;
  defaultOpen?: boolean;
  open?: boolean;
  type?: string;
  format?: string;
  multiple?: boolean;
  max?: number;
  disabled?: boolean;
  disabledDate?: (date?: Date, options?: Record<string, unknown>) => boolean;
  disabledTime?: (date?: Date | Date[], panelType?: string) => Record<string, unknown>;
  onChangeWithDateFirst?: boolean;
  rangeSeparator?: string;
  timeZone?: string | number;
  dateFnsLocale?: unknown;
  locale?: unknown;
  insetInput?: boolean | Record<string, unknown>;
  needConfirm?: boolean;
  preventScroll?: boolean;
}

export interface FoundationDatePickerState {
  panelShow: boolean;
  isRange: boolean;
  inputValue: string | null;
  value: Date[];
  cachedSelectedValue: Array<Date | null>;
  prevTimeZone: string | number | null;
  rangeInputFocus: DatePickerRangeFocus | undefined;
  autofocus: boolean;
  insetInputValue: unknown;
  triggerDisabled: boolean | undefined;
}

export interface DatePickerAdapter<
  Props extends FoundationDatePickerProps = FoundationDatePickerProps,
  State extends FoundationDatePickerState = FoundationDatePickerState,
> extends DefaultAdapter<Props, State> {
  togglePanel(panelShow: boolean, callback?: () => void): void;
  registerClickOutSide(): void;
  unregisterClickOutSide(): void;
  notifyBlur(...args: unknown[]): void;
  notifyFocus(...args: unknown[]): void;
  notifyClear(...args: unknown[]): void;
  notifyChange(...args: unknown[]): void;
  notifyCancel(...args: unknown[]): void;
  notifyConfirm(...args: unknown[]): void;
  notifyOpenChange(open: boolean): void;
  notifyPresetsClick(...args: unknown[]): void;
  updateValue(value: Date[]): void;
  updatePrevTimezone(value: string | number | null): void;
  updateCachedSelectedValue(value: Array<Date | null>): void;
  updateInputValue(value: string | null): void;
  needConfirm(): boolean;
  typeIsYearOrMonth(): boolean;
  setRangeInputFocus(value: DatePickerRangeFocus): void;
  couldPanelClosed(): boolean;
  isEventTarget(event: unknown): boolean;
  updateInsetInputValue(value: unknown): void;
  setInsetInputFocus(): void;
  setTriggerDisabled(disabled: boolean): void;
  setInputFocus(): void;
  setInputBlur(): void;
  setRangeInputBlur(): void;
}

export class DatePickerFoundation<
  Props extends FoundationDatePickerProps = FoundationDatePickerProps,
  State extends FoundationDatePickerState = FoundationDatePickerState,
> {
  constructor(adapter: DatePickerAdapter<Props, State>);
  init(): void;
  destroy(): void;
  initFromProps(options: {
    value?: DatePickerFoundationValue;
    timeZone?: string | number;
    prevTimeZone?: string | number | null;
  }): void;
  openPanel(): void;
  closePanel(): void;
  open(): void;
  close(): void;
  focus(focusType?: Exclude<DatePickerRangeFocus, false>): void;
  blur(): void;
  handleInputChange(input: string, event: unknown): void;
  handleInputBlur(input?: string, event?: unknown): void;
  handleInputFocus(event: unknown, range?: 'rangeStart' | 'rangeEnd'): void;
  handleInputClear(event: unknown): void;
  handleRangeInputClear(event: unknown): void;
  handleRangeInputBlur(value: unknown, event: unknown): void;
  handleRangeEndTabPress(event: unknown): void;
  handleInputComplete(input?: string): void;
  handleSelectedChange(
    value: Date[],
    options?: { fromPreset?: boolean; needCheckFocusRecord?: boolean },
  ): void;
  handleConfirm(): void;
  handleCancel(): void;
  handlePresetClick(item: Record<string, unknown>, event: unknown): void;
  handleTriggerWrapperClick(event: unknown): void;
  handlePanelVisibleChange(visible: boolean): void;
  handleSetRangeFocus(value: DatePickerRangeFocus): void;
  formatDates(dates?: Date[], customFormat?: string): string;
  formatMultipleDates(dates?: Date[], separator?: string, customFormat?: string): string;
  disabledDisposeDate(date: Date, ...rest: unknown[]): boolean;
  disabledDisposeTime(date: Date | Date[], ...rest: unknown[]): unknown;
}

export interface DatePickerMonthDay {
  dayNumber: number | string;
  dayNumberFull?: string;
  fullDate: string;
}

export interface DatePickerMonthTable {
  monthText: string;
  weeks: DatePickerMonthDay[][];
  month: Date;
}

export function getDatePickerMonthTable(
  month: Date,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6,
): DatePickerMonthTable;
export function getDatePickerDayOfWeek(options: {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}): string[];
export function getDatePickerDefaultFormat(type: string): string | undefined;

export const datePickerCssClasses: Record<string, string>;
export const datePickerNumbers: {
  WEEK_START_ON: 0;
  WEEK_HEIGHT: 36;
  SPACING: number;
  SPACING_INSET_INPUT: 1;
};
export const datePickerStrings: Record<string, string | readonly string[]>;
