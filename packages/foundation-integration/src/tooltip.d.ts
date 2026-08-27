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

export interface TooltipPopupContainerRect {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

export interface TooltipAdapter<Props, State> extends DefaultAdapter<Props, State> {
  registerPortalEvent(events: Record<string, (...args: unknown[]) => void>): void;
  registerResizeHandler(handler: () => void): void;
  unregisterResizeHandler(handler?: () => void): void;
  on(name: string, handler: () => void): void;
  off(name: string, handler?: () => void): void;
  notifyVisibleChange(visible: boolean): void;
  getPopupContainerRect(): TooltipPopupContainerRect | null;
  containerIsBody(): boolean;
  canMotion(): boolean;
  registerScrollHandler(handler: (position: { x: number; y: number }) => void): void;
  unregisterScrollHandler(): void;
  insertPortal(content: unknown, style: Record<string, unknown>): void;
  removePortal(): void;
  setDisplayNone(displayNone: boolean, callback?: () => void): void;
  getEventName(): Record<
    | 'mouseEnter'
    | 'mouseLeave'
    | 'mouseOut'
    | 'mouseOver'
    | 'click'
    | 'focus'
    | 'blur'
    | 'keydown'
    | 'contextMenu',
    string
  >;
  registerTriggerEvent(events: Record<string, (...args: unknown[]) => void>): void;
  getTriggerBounding(): DOMRect | undefined;
  getWrapperBounding(): DOMRect | undefined;
  setPosition(style: Record<string, unknown> & { position: string }): void;
  togglePortalVisible(visible: boolean, callback: () => void): void;
  registerClickOutsideHandler(callback: () => void): void;
  unregisterClickOutsideHandler(): void;
  containerIsRelative(): boolean;
  containerIsRelativeOrAbsolute(): boolean;
  getDocumentElementBounding(): DOMRect;
  updateContainerPosition(): void;
  updatePlacementAttr(placement: string): void;
  getContainerPosition(): string | undefined;
  getFocusableElements(node: HTMLElement | null): HTMLElement[];
  getActiveElement(): Element | null;
  getContainer(): HTMLElement | null;
  setInitialFocus(): void;
  notifyEscKeydown(event: KeyboardEvent): void;
  getTriggerNode(): HTMLElement | null;
  setId(): void;
  getTriggerDOM(): HTMLElement | null;
  getAnimatingState(): boolean;
}

export class TooltipFoundation<Props, State> {
  constructor(adapter: TooltipAdapter<Props, State>);
  init(): void;
  destroy(): void;
  delayShow(): void;
  delayHide(): void;
  show(): void;
  hide(): void;
  calcPosition(
    triggerRect?: DOMRect,
    wrapperRect?: DOMRect,
    containerRect?: TooltipPopupContainerRect,
    shouldUpdatePos?: boolean,
  ): Record<string, unknown>;
  handleContainerKeydown(event: KeyboardEvent): void;
  focusTrigger(): void;
  setDisplayNone(displayNone: boolean, callback?: () => void): void;
  unBindEvent(): void;
}
