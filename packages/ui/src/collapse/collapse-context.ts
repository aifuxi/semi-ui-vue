import type { ComputedRef, InjectionKey, VNodeChild } from 'vue';

import type { CollapseIconPosition } from './types';

export interface CollapseContextValue {
  activeSet: ComputedRef<ReadonlySet<string>>;
  clickHeaderToExpand: ComputedRef<boolean>;
  collapseIcon: () => VNodeChild;
  expandIcon: () => VNodeChild;
  expandIconPosition: ComputedRef<CollapseIconPosition>;
  keepDOM: ComputedRef<boolean>;
  lazyRender: ComputedRef<boolean>;
  motion: ComputedRef<boolean>;
  onClick: (itemKey: string, event: MouseEvent) => void;
}

export const collapseContextKey: InjectionKey<CollapseContextValue> =
  Symbol('semi-collapse-context');
