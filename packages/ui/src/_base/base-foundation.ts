import { BaseFoundation as PinnedBaseFoundation } from '@workspace/foundation-integration';

export interface BaseFoundationAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: string): unknown;
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: unknown): void;
  persistEvent(event: unknown): void;
}

export interface BaseFoundation<Props, State> {
  getProp(key: string): unknown;
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getContext(key: string): unknown;
  getContexts(): unknown;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: string, value: unknown): unknown;
  stopPropagation(event: unknown): void;
  init(lifecycle?: unknown): void;
  destroy(): void;
}

export interface BaseFoundationConstructor {
  new <
    Props = Record<string, unknown>,
    State = Record<string, unknown>,
    Adapter extends Partial<BaseFoundationAdapter<Props, State>> = Partial<
      BaseFoundationAdapter<Props, State>
    >,
  >(
    adapter: Adapter,
  ): BaseFoundation<Props, State>;
  readonly cssClasses: Record<string, string>;
  readonly strings: Record<string, string>;
  readonly numbers: Record<string, number>;
  readonly defaultAdapter: BaseFoundationAdapter<unknown, unknown>;
}

export const BaseFoundation = PinnedBaseFoundation as unknown as BaseFoundationConstructor;
