import type { InjectionKey } from 'vue';

import type { ArrayFieldContextValue, FormContextValue } from './internal-types';

export const formContextKey: InjectionKey<FormContextValue> = Symbol('semi-form');
export const arrayFieldContextKey: InjectionKey<ArrayFieldContextValue> =
  Symbol('semi-form-array-field');
