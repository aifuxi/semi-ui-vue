interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
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

export interface HotKeysFoundationProps {
  hotKeys: string[];
  mergeMetaCtrl: boolean;
  preventDefault: boolean;
}

export interface HotKeysAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyHotKey(event: KeyboardEvent): void;
  registerEvent(): void;
  unregisterEvent(): void;
}

export const HotKeysFoundationKeys: Readonly<Record<string, string>>;

export class HotKeysFoundation<Props extends HotKeysFoundationProps, State> {
  constructor(adapter: HotKeysAdapter<Props, State>);
  init(): void;
  destroy(): void;
  isValidHotKeys(hotKeys: string[]): boolean;
  handleKeyDown(event: KeyboardEvent): void;
}
