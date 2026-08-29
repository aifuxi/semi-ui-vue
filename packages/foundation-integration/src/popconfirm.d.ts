interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp(key: keyof Props): unknown;
  getProps(): Props;
  getState(key: keyof State): unknown;
  getStates(): State;
  setState(state: Partial<State>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
}

export interface PopconfirmAdapter<Props, State> extends DefaultAdapter<Props, State> {
  setVisible(visible: boolean): void;
  updateConfirmLoading(loading: boolean): void;
  updateCancelLoading(loading: boolean): void;
  notifyConfirm(event: MouseEvent): Promise<unknown> | void;
  notifyCancel(event: MouseEvent): Promise<unknown> | void;
  notifyVisibleChange(visible: boolean): void;
  notifyClickOutSide(event: MouseEvent): void;
  focusCancelButton(): void;
  focusOkButton(): void;
  focusPrevFocusElement(): void;
}

export class PopconfirmFoundation<Props, State> {
  constructor(adapter: PopconfirmAdapter<Props, State>);
  init(): void;
  destroy(): void;
  handleCancel(event: MouseEvent): void;
  handleConfirm(event: MouseEvent): void;
  handleClickOutSide(event: MouseEvent): void;
  handleVisibleChange(visible: boolean): void;
  handleFocusOperateButton(): void;
}

export const popconfirmCssClasses: {
  readonly PREFIX: 'semi-popconfirm';
  readonly POPOVER: 'semi-popconfirm-popover';
};

export const popconfirmNumbers: {
  readonly SPACING: 4;
  readonly DEFAULT_Z_INDEX: 1030;
};

export const popconfirmStrings: {
  readonly POSITION_SET: readonly string[];
  readonly TRIGGER_SET: readonly string[];
};
