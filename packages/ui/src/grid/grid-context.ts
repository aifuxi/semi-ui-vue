import type { ComputedRef, InjectionKey } from 'vue';

import type { GridGutters } from './types';

export interface GridRowContext {
  gutters: ComputedRef<GridGutters>;
}

export const gridRowContextKey: InjectionKey<GridRowContext> = Symbol('semi-grid-row-context');
