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

export interface NotificationAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyWrapperToRemove(id: string): void;
  notifyClose(): void;
}

export interface NotificationListAdapter<Props, State, Notice> extends DefaultAdapter<
  Props,
  State
> {
  updateNotices(notices: Notice[], removedItems?: Notice[], updatedItems?: Notice[]): void;
  getNotices(): Notice[];
}

export class NotificationFoundation<Props, State> {
  constructor(adapter: NotificationAdapter<Props, State>);
  init(): void;
  destroy(): void;
  close(event?: { stopPropagation?: () => void }): void;
  _clearCloseTimer(): void;
  _startCloseTimer(): void;
  restartCloseTimer(): void;
}

export class NotificationListFoundation<Props, State, Notice> {
  constructor(adapter: NotificationListAdapter<Props, State, Notice>);
  addNotice(options: Notice): void;
  has(id: string): boolean;
  update(id: string, options: Partial<Notice>): void;
  removeNotice(id: string): void;
  destroyAll(): void;
}

export const notificationCssClasses: {
  WRAPPER: string;
  LIST: string;
  NOTICE: string;
};

export const notificationNumbers: { duration: number };
export const notificationStrings: {
  types: readonly string[];
  themes: readonly string[];
  directions: readonly ['ltr', 'rtl'];
};
