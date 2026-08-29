import type { ComputedRef, InjectionKey } from 'vue';

import type { ListGrid } from './types';

export interface ListContextValue {
  grid: ComputedRef<ListGrid | undefined>;
  onClick: (event: MouseEvent) => void;
  onRightClick: (event: MouseEvent) => void;
}

export const listContextKey: InjectionKey<ListContextValue> = Symbol('semi-list-context');
