import type { ComputedRef, InjectionKey } from 'vue';

import type { StepsType } from './types';

export interface StepsContext {
  type: ComputedRef<StepsType>;
}

export const stepsContextKey: InjectionKey<StepsContext> = Symbol('semi-steps-context');
