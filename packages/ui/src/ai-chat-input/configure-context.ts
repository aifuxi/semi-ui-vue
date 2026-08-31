import type { InjectionKey, Ref } from 'vue';

import type { LeftMenuChangeProps } from './types';

export interface ConfigureContextValue {
  value: Readonly<Ref<LeftMenuChangeProps>>;
  change(field: string, value: unknown): void;
  remove(field: string): void;
}

export const configureContextKey: InjectionKey<ConfigureContextValue> = Symbol(
  'semi-aiChatInput-configure',
);
