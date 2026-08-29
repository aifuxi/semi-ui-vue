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

export interface FoundationModalProps {
  closeOnEsc?: boolean;
  fullScreen?: boolean;
  visible?: boolean;
  [key: string]: unknown;
}

export interface FoundationModalState {
  displayNone: boolean;
  isFullScreen: boolean;
  onOKReturnPromiseStatus?: 'pending' | 'fulfilled' | 'rejected';
  onCancelReturnPromiseStatus?: 'pending' | 'fulfilled' | 'rejected';
}

export interface ModalAdapter<Props, State> extends DefaultAdapter<Props, State> {
  disabledBodyScroll(): void;
  enabledBodyScroll(): void;
  notifyCancel(event: MouseEvent | KeyboardEvent): void | Promise<unknown>;
  notifyOk(event: MouseEvent | KeyboardEvent): void | Promise<unknown>;
  notifyClose(): void;
  toggleDisplayNone(displayNone: boolean, callback?: (displayNone: boolean) => void): void;
  notifyFullScreen(isFullScreen: boolean): void;
}

export class ModalFoundation<Props, State> {
  constructor(adapter: ModalAdapter<Props, State>);
  destroy(): void;
  handleCancel(event: MouseEvent | KeyboardEvent): void;
  handleOk(event: MouseEvent | KeyboardEvent): void;
  beforeShow(): void;
  afterHide(): void;
  enabledBodyScroll(): void;
  notifyFullScreen(isFullScreen: boolean): void;
  toggleDisplayNone(displayNone: boolean, callback?: (displayNone: boolean) => void): void;
}

export interface FoundationModalContentProps {
  closeOnEsc?: boolean;
  [key: string]: unknown;
}

export interface FoundationModalContentState {
  dialogMouseDown: boolean;
  prevFocusElement: HTMLElement | null;
}

export interface ModalContentAdapter<Props, State> extends DefaultAdapter<Props, State> {
  notifyClose(event: MouseEvent | KeyboardEvent): void;
  notifyDialogMouseDown(): void;
  notifyDialogMouseUp(): void;
  addKeyDownEventListener(): void;
  removeKeyDownEventListener(): void;
  getMouseState(): boolean;
  modalDialogFocus(): void;
  modalDialogBlur(): void;
  prevFocusElementReFocus(): void;
}

export class ModalContentFoundation<Props, State> {
  constructor(adapter: ModalContentAdapter<Props, State>);
  destroy(): void;
  handleDialogMouseDown(): void;
  handleMaskMouseUp(): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleKeyDownEventListenerMount(): void;
  handleKeyDownEventListenerUnmount(): void;
  handleMaskClick(event: MouseEvent): void;
  close(event: MouseEvent | KeyboardEvent): void;
  modalDialogFocus(): void;
  modalDialogBlur(): void;
  prevFocusElementReFocus(): void;
}

interface ModalFocusTrapOptions {
  enable?: boolean;
  preventScroll?: boolean;
}

export class ModalFocusTrapHandle {
  constructor(container: HTMLElement, options?: ModalFocusTrapOptions);
  destroy(): void;
  static getActiveElement(): HTMLElement | null;
  static getFocusableElements(node: HTMLElement): HTMLElement[];
}
