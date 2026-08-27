import type { ComputedRef, InjectionKey } from 'vue';

import type { ConfigContextValue } from './types';

export const configContextKey: InjectionKey<ComputedRef<ConfigContextValue>> =
  Symbol('semi-config-context');
