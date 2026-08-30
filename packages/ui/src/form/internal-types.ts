import type { Ref } from 'vue';

import type { FormApi, FormProps, FormState } from './types';

interface InternalCallOptions {
  allowEmpty?: boolean;
  fieldAllowEmpty?: boolean;
  needClone?: boolean;
  notNotify?: boolean;
  notUpdate?: boolean;
  silent?: boolean;
}

interface InternalFieldApi {
  reset(): void;
  setError(error: unknown, options?: InternalCallOptions): void;
  setTouched(touched: boolean | undefined, options?: InternalCallOptions): void;
  setValue(value: unknown, options?: InternalCallOptions): void;
  validate(value: unknown, options?: InternalCallOptions): Promise<unknown>;
}

export interface InternalFormUpdater {
  getArrayField(field: string): { initValue?: unknown; updateKey?: string | number } | undefined;
  getError(field?: string): unknown;
  getField(field: string): unknown;
  getFormProps(fields?: string[]): Record<string, unknown>;
  getInitValue(field: string): unknown;
  getInitValues(): Record<string, unknown>;
  getTouched(field?: string): unknown;
  getValue(field?: string, options?: InternalCallOptions): unknown;
  register(
    field: string,
    state: {
      error?: unknown | undefined;
      status?: string | undefined;
      touched?: boolean | undefined;
      value?: unknown | undefined;
    },
    staff: {
      allowEmpty?: boolean;
      field: string;
      fieldApi: InternalFieldApi;
      keepState?: boolean;
    },
  ): void;
  registerArrayField(field: string, value: unknown): void;
  unRegister(field: string): void;
  unRegisterArrayField(field: string): void;
  updateArrayField(
    field: string,
    value: { initValue?: unknown; updateKey?: string | number },
  ): void;
  updateStateError(
    field: string,
    error: unknown,
    options?: InternalCallOptions,
    callback?: () => void,
  ): void;
  updateStateTouched(
    field: string,
    touched: boolean | undefined,
    options?: InternalCallOptions,
    callback?: () => void,
  ): void;
  updateStateValue(
    field: string,
    value: unknown,
    options?: InternalCallOptions,
    callback?: () => void,
  ): void;
}

export interface ExternalFormController<
  Values extends Record<string, unknown> = Record<string, unknown>,
> extends FormApi<Values> {
  __bind?: (api: FormApi<Values>) => void;
  __unbind?: () => void;
  __updateState?: (state: FormState<Values>) => void;
}

export interface FormContextValue {
  api: FormApi;
  props: Readonly<FormProps>;
  state: Ref<FormState>;
  updater: InternalFormUpdater;
}

export interface ArrayFieldContextValue {
  inArrayField: boolean;
  shouldUseInitValue: boolean;
}
