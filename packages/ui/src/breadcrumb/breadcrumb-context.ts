import type { ComputedRef, InjectionKey, VNodeChild } from 'vue';

import type { BreadcrumbItemInfo, BreadcrumbShowTooltip } from './types';

export interface BreadcrumbContextValue {
  compact: ComputedRef<boolean>;
  separator: ComputedRef<VNodeChild>;
  showTooltip: ComputedRef<boolean | BreadcrumbShowTooltip>;
  onClick(item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent): void;
}

export const breadcrumbContextKey: InjectionKey<BreadcrumbContextValue> =
  Symbol('semi-breadcrumb-context');
