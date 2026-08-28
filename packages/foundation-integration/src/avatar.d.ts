export interface AvatarAdapter<Props> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: keyof Props): unknown;
  getProps(): Props;
  getState(key: string): unknown;
  getStates(): Record<string, unknown>;
  setState(state: Record<string, unknown>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
  notifyImgState(isImgExist: boolean): void;
  notifyLeave(event: MouseEvent): void;
  notifyEnter(event: MouseEvent): void;
  setFocusVisible(focusVisible: boolean): void;
  setScale(scale: number): void;
  getAvatarNode(): HTMLSpanElement | null;
}

export class AvatarFoundation<Props> {
  constructor(adapter: AvatarAdapter<Props>);
  init(): void;
  destroy(): void;
  handleImgLoadError(): void;
  handleEnter(event: MouseEvent): void;
  handleLeave(event: MouseEvent): void;
  handleFocusVisible(event: FocusEvent): void;
  handleBlur(): void;
  changeScale(): void;
}
