import type { ComputedRef, InjectionKey } from 'vue';

import type { TooltipTrigger } from '../tooltip';

export interface DropdownContextValue {
  level: number;
  showTick: ComputedRef<boolean>;
  trigger: ComputedRef<TooltipTrigger>;
}

export const dropdownContextKey: InjectionKey<DropdownContextValue> = Symbol('SemiDropdown');
