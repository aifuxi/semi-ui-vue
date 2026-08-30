import { computed, inject, shallowRef, type ComputedRef, type Ref } from 'vue';

import { formContextKey } from './form-context';
import type { ExternalFormController } from './internal-types';
import type { FieldApi, FormApi, FormFieldError, FormState } from './types';

function emptyState<Values extends Record<string, unknown>>(): FormState<Values> {
  return { values: {} as Values, errors: {}, touched: {} };
}

export function useForm<
  Values extends Record<string, unknown> = Record<string, unknown>,
>(): readonly [FormApi<Values>, Ref<FormState<Values>>, ComputedRef<Values>] {
  const state = shallowRef<FormState<Values>>(emptyState<Values>());
  let realApi: FormApi<Values> | undefined;

  const internals: ExternalFormController<Values> = {
    __bind(api) {
      realApi = api;
      state.value = api.getFormState();
    },
    __unbind() {
      realApi = undefined;
      state.value = emptyState<Values>();
    },
    __updateState(next) {
      state.value = next;
    },
  } as ExternalFormController<Values>;

  const api = new Proxy(internals, {
    get(target, key: string | symbol) {
      if (typeof key === 'string' && key.startsWith('__')) return Reflect.get(target, key);
      const value = realApi?.[key as keyof FormApi<Values>];
      if (typeof value === 'function') return value.bind(realApi);
      if (!realApi && typeof key === 'string') {
        return () => {
          console.warn(
            `[Semi Form] FormApi.${key}() is called before Form component is mounted. Please ensure the Form component is rendered first.`,
          );
        };
      }
      return value;
    },
  }) as FormApi<Values>;

  return [api, state, computed(() => state.value.values)] as const;
}

export function useFormApi<
  Values extends Record<string, unknown> = Record<string, unknown>,
>(): FormApi<Values> {
  const context = inject(formContextKey);
  if (!context) throw new Error('[Semi Form]: useFormApi must be used inside Form');
  return context.api as FormApi<Values>;
}

export function useFormState<
  Values extends Record<string, unknown> = Record<string, unknown>,
>(): Readonly<Ref<FormState<Values>>> {
  const context = inject(formContextKey);
  if (!context) throw new Error('[Semi Form]: useFormState must be used inside Form');
  return context.state as Ref<FormState<Values>>;
}

export function useFieldApi(field: string): FieldApi {
  const api = useFormApi();
  return {
    getError: () => api.getError(field) as FormFieldError,
    setError: (error) => api.setError(field, error),
    getTouched: () => api.getTouched(field),
    setTouched: (touched) => api.setTouched(field, touched),
    getValue: () => api.getValue(field),
    setValue: (value) => api.setValue(field, value),
  };
}

export function useFieldState(field: string) {
  const state = useFormState();
  return computed(() => ({
    value: getAtPath(state.value.values, field),
    error: getAtPath(state.value.errors, field),
    touched: getAtPath(state.value.touched, field),
  }));
}

function getAtPath(value: unknown, path: string): unknown {
  const parts = path.replaceAll('[', '.').replaceAll(']', '').split('.').filter(Boolean);
  return parts.reduce<unknown>((current, part) => {
    if (current === null || typeof current !== 'object') return undefined;
    return (current as Record<string, unknown>)[part];
  }, value);
}
