interface DefaultAdapter<Props, State> {
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
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

export interface ToastAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyWrapperToRemove(id: string): void;
  notifyClose(): void;
}

export interface ToastListAdapter<Props, State, Entry> extends DefaultAdapter<Props, State> {
  updateToast(list: Entry[], removedItems: Entry[], updatedItems: Entry[]): void;
  handleMouseInSideChange(mouseInSide: boolean): void;
  getInputWrapperRect(): DOMRect | undefined;
}

export class ToastFoundation<Props, State> {
  _id: string | null;
  constructor(adapter: ToastAdapter<Props, State>);
  init(): void;
  destroy(): void;
  close(event?: { stopPropagation?: () => void }): void;
  clearCloseTimer_(): void;
  startCloseTimer_(): void;
  restartCloseTimer(): void;
}

export class ToastListFoundation<Props, State, Entry> {
  constructor(adapter: ToastListAdapter<Props, State, Entry>);
  hasToast(id: string): boolean;
  handleMouseInSideChange(mouseInSide: boolean): void;
  getInputWrapperRect(): DOMRect | undefined;
  addToast(options: Entry): void;
  updateToast(id: string, options: Partial<Entry>): void;
  removeToast(id: string): void;
  destroyAll(): void;
}

export const toastCssClasses: {
  PREFIX: string;
  WRAPPER: string;
  LIST: string;
};
export const toastNumbers: { duration: number };
export const toastStrings: {
  types: readonly ['warning', 'success', 'info', 'error', 'default'];
  themes: readonly ['normal', 'light'];
  directions: readonly ['ltr', 'rtl'];
};
