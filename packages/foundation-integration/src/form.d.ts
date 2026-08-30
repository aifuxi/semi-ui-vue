export interface FoundationFormState<
  Values extends Record<string, unknown> = Record<string, unknown>,
> {
  values: Values;
  errors: Record<string, unknown>;
  touched: Record<string, unknown>;
}

export interface FoundationFieldState {
  value?: unknown | undefined;
  error?: unknown | undefined;
  touched?: boolean | undefined;
  status?: string | undefined;
}

export interface FoundationCallOptions {
  notNotify?: boolean;
  notUpdate?: boolean;
  needClone?: boolean;
  silent?: boolean;
  allowEmpty?: boolean;
  fieldAllowEmpty?: boolean;
}

export interface FoundationFieldApi {
  setValue(value: unknown, options?: FoundationCallOptions): void;
  setError(error: unknown, options?: FoundationCallOptions): void;
  setTouched(touched: boolean | undefined, options?: FoundationCallOptions): void;
  reset(): void;
  validate(value: unknown, options?: FoundationCallOptions): Promise<unknown>;
}

export interface FoundationFormUpdater {
  register(
    field: string,
    state: FoundationFieldState,
    staff: {
      field: string;
      fieldApi: FoundationFieldApi;
      keepState?: boolean;
      allowEmpty?: boolean;
    },
  ): void;
  unRegister(field: string): void;
  updateStateValue(
    field: string,
    value: unknown,
    options?: FoundationCallOptions,
    callback?: () => void,
  ): void;
  updateStateError(
    field: string,
    error: unknown,
    options?: FoundationCallOptions,
    callback?: () => void,
  ): void;
  updateStateTouched(
    field: string,
    touched: boolean | undefined,
    options?: FoundationCallOptions,
    callback?: () => void,
  ): void;
  getValue(field?: string, options?: FoundationCallOptions): unknown;
  getError(field?: string): unknown;
  getTouched(field?: string): unknown;
  getInitValue(field: string): unknown;
  getInitValues(): Record<string, unknown>;
  getFormProps(fields?: string[]): Record<string, unknown>;
  getField(field: string): unknown;
  registerArrayField(field: string, value: unknown): void;
  unRegisterArrayField(field: string): void;
  getArrayField(field: string): { initValue?: unknown; updateKey?: string | number } | undefined;
  updateArrayField(
    field: string,
    value: { initValue?: unknown; updateKey?: string | number },
  ): void;
}

export interface FormFoundationAdapter<Props extends Record<string, unknown>> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): Record<string, unknown>;
  setState(state: Record<string, unknown>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
  cloneDeep<T>(value: T): T;
  getInitValues(): Record<string, unknown>;
  getFormProps(fields?: string[]): Record<string, unknown>;
  notifySubmit(values: Record<string, unknown>, event?: Event): void;
  notifySubmitFail(errors: unknown, values: Record<string, unknown>, event?: Event): void;
  notifyChange(state: FoundationFormState): void;
  notifyValueChange(values: Record<string, unknown>, changedValues: Record<string, unknown>): void;
  notifyErrorChange(errors: Record<string, unknown>, changedErrors: Record<string, unknown>): void;
  notifyReset(): void;
  forceUpdate(callback?: () => void): void;
  initFormId(): void;
  getFormDOM(): HTMLElement | null;
  getAllErrorDOM(): NodeListOf<Element> | HTMLElement[];
  getFieldDOM(field: string): HTMLElement | null;
  getFieldErrorDOM(field: string): HTMLElement | null;
}

export class FormFoundation<Props extends Record<string, unknown> = Record<string, unknown>> {
  constructor(adapter: FormFoundationAdapter<Props>);
  init(): void;
  destroy(): void;
  submit(event?: Event): void;
  reset(fields?: string[]): void;
  validate(fields?: string[] | { fields?: string[]; silent?: boolean }): Promise<unknown>;
  getFormApi(): Record<string, (...args: unknown[]) => unknown>;
  getFormState(clone?: boolean): FoundationFormState;
  getModifyFormStateApi(): FoundationFormUpdater;
}

export const formCssClasses: Record<string, string>;
export const formStrings: {
  EXTRA_POS: readonly string[];
  LAYOUT: readonly string[];
  LABEL_POS: readonly string[];
  LABEL_ALIGN: readonly string[];
};
export function isValidFormError(error: unknown): boolean;
export function resolveFormBoolean(
  fieldValue: boolean | undefined,
  formValue: boolean | undefined,
  fallback: boolean,
): boolean;
export function resolveFormTrigger(
  fieldValue?: string | string[],
  formValue?: string | string[],
): string[];
