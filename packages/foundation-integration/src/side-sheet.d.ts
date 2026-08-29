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

export interface FoundationSideSheetProps {
  closeOnEsc?: boolean;
  disableScroll?: boolean;
  visible?: boolean;
  [key: string]: unknown;
}

export interface FoundationSideSheetState {
  displayNone: boolean;
}

export interface SideSheetAdapter<Props, State> extends DefaultAdapter<Props, State> {
  disabledBodyScroll(): void;
  enabledBodyScroll(): void;
  notifyCancel(event: MouseEvent | KeyboardEvent): void;
  notifyVisibleChange(visible: boolean): void;
  setOnKeyDownListener(): void;
  removeKeyDownListener(): void;
  toggleDisplayNone(displayNone: boolean): void;
}

export class SideSheetFoundation<Props, State> {
  constructor(adapter: SideSheetAdapter<Props, State>);
  destroy(): void;
  handleCancel(event: MouseEvent | KeyboardEvent): void;
  beforeShow(): void;
  afterHide(): void;
  handleKeyDown(event: KeyboardEvent): void;
  onVisibleChange(visible: boolean): void;
  toggleDisplayNone(displayNone: boolean): void;
}

export const sideSheetCssClasses: {
  PREFIX: 'semi-sidesheet';
  DIALOG: 'semi-modal';
};

export const sideSheetStrings: {
  PLACEMENT: readonly ['top', 'right', 'bottom', 'left'];
  SIZE: readonly ['small', 'medium', 'large'];
  WIDTH: Readonly<{ small: 448; medium: 684; large: 920 }>;
  HEIGHT: 448;
};
