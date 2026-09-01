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

export class BaseFoundation<
  Adapter extends Partial<BaseFoundationAdapter<Props, State>>,
  Props = Record<string, unknown>,
  State = Record<string, unknown>,
> {
  static readonly cssClasses: Record<string, string>;
  static readonly strings: Record<string, string>;
  static readonly numbers: Record<string, number>;
  static readonly defaultAdapter: BaseFoundationAdapter<unknown, unknown>;

  constructor(adapter: Adapter);
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

export const baseValidateStatus: readonly ['default', 'error', 'warning', 'success'];
