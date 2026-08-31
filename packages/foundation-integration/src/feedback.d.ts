interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: string): unknown;
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface FeedbackAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyClose(): void;
  setValue(value: unknown): void;
  notifyValueChange(value: unknown): void;
  notifyCancel(event: MouseEvent | KeyboardEvent): unknown;
  notifyOk(event: MouseEvent | KeyboardEvent): unknown;
  notifyTextAreaChange(value: string, event?: Event): void;
  notifyCheckBoxChange(value: unknown[]): void;
  notifyRadioChange(event: unknown): void;
}

export class FeedbackFoundation<Props, State> {
  constructor(adapter: FeedbackAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleRadioChange(event: { target: { value?: unknown } }): void;
  handleEmojiReasonChange(value: string, event?: Event): void;
  handleTextChange(value: string, event?: Event): void;
  handleEmojiClick(event: MouseEvent): void;
  handleCheckboxChange(value: unknown[]): void;
  handleCancel(event: MouseEvent | KeyboardEvent): void;
  handleSubmit(event: MouseEvent): void;
  handleModalOk(event: MouseEvent | KeyboardEvent): unknown;
  handleModalCancel(event: MouseEvent | KeyboardEvent): unknown;
  disableSubmitButton(): boolean;
  getRestProps(): Record<string, unknown>;
}

export const feedbackCssClasses: Readonly<{ PREFIX: 'semi-feedback' }>;
export const feedbackStrings: Readonly<{
  MODE: readonly ['modal', 'popup'];
  TYPE: readonly ['text', 'emoji', 'radio', 'checkbox', 'custom'];
  Emoji: Readonly<{ bad: '😞'; normal: '😐'; good: '😃' }>;
}>;
