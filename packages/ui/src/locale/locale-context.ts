import type { ComputedRef, InjectionKey } from 'vue';

import type { SemiLocale } from '../config-provider';

export const localeContextKey: InjectionKey<ComputedRef<Readonly<SemiLocale>>> =
  Symbol('semi-locale-context');
