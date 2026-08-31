interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: string): unknown;
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface UserGuideAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyChange(current: number): void;
  notifyPrev(current: number): void;
  notifyNext(current: number): void;
  notifySkip(): void;
  notifyFinish(): void;
  setCurrent(current: number): void;
  disabledBodyScroll(): void;
  enabledBodyScroll(): void;
}

export class UserGuideFoundation<Props, State> {
  constructor(adapter: UserGuideAdapter<Props, State>);
  init(): void;
  destroy(): void;
  beforeShow(): void;
  afterHide(): void;
  getFinalPaading(): number;
  handlePrev(): void;
  handleNext(): void;
  handleSkip(): void;
}

export const userGuideCssClasses: Readonly<{
  PREFIX: 'semi-userGuide';
  PREFIX_MODAL: 'semi-userGuide-modal';
}>;
export const userGuideNumbers: Readonly<{
  DEFAULT_CURRENT: 0;
  DEFAULT_SPOTLIGHT_PADDING: 5;
  DEFAULT_Z_INDEX: 1030;
}>;
export const userGuideStrings: Readonly<{
  MODE: readonly ['popup', 'modal'];
  POSITION_SET: readonly string[];
  THEME: readonly ['default', 'primary'];
}>;
