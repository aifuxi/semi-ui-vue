import type { ComputedRef, InjectionKey } from 'vue';

import type { DescriptionsAlign, DescriptionsLayout } from './types';

export interface DescriptionsContextValue {
  align: ComputedRef<DescriptionsAlign>;
  layout: ComputedRef<DescriptionsLayout>;
}

export const descriptionsContextKey: InjectionKey<DescriptionsContextValue> = Symbol(
  'semi-descriptions-context',
);
