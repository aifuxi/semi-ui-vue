export type FoundationResizeDirection =
  'top' | 'right' | 'bottom' | 'left' | 'topRight' | 'bottomRight' | 'bottomLeft' | 'topLeft';

export type FoundationResizeEventType = 'mouse' | 'touch';

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

export interface ResizableAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getResizable(): HTMLDivElement | null;
  registerEvent(type?: FoundationResizeEventType): void;
  unregisterEvent(type?: FoundationResizeEventType): void;
}

export interface ResizeGroupAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getGroupRef(): HTMLDivElement | null;
  getItem(index: number): HTMLDivElement;
  getItemCount(): number;
  getHandler(index: number): HTMLDivElement;
  getHandlerCount(): number;
  getItemMin(index: number): string;
  getItemMax(index: number): string;
  getItemStart(index: number): (...args: never[]) => void;
  getItemChange(index: number): (...args: never[]) => void;
  getItemEnd(index: number): (...args: never[]) => void;
  getItemDefaultSize(index: number): string | number;
  registerEvents(type?: FoundationResizeEventType): void;
  unregisterEvents(type?: FoundationResizeEventType): void;
}

export class ResizableFoundation<Props, State> {
  constructor(adapter: ResizableAdapter<Props, State>);
  init(): void;
  destroy(): void;
  readonly sizeStyle: { width: string; height: string };
  onResizeStart(
    event: MouseEvent,
    direction: FoundationResizeDirection,
    type: FoundationResizeEventType,
  ): void;
  onMouseMove(event: MouseEvent): void;
  onTouchMove(event: TouchEvent): void;
  onMouseUp(event: MouseEvent | TouchEvent): void;
}

export class ResizeGroupFoundation<Props, State> {
  constructor(adapter: ResizeGroupAdapter<Props, State>);
  direction: 'horizontal' | 'vertical';
  init(): void;
  destroy(): void;
  initSpace(): void;
  ensureConstraint(): void;
  onResizeStart(
    handlerIndex: number,
    event: MouseEvent | Touch,
    type: FoundationResizeEventType,
  ): void;
  onMouseMove(event: MouseEvent): void;
  onTouchMove(event: TouchEvent): void;
  onResizeEnd(event: MouseEvent | TouchEvent): void;
}
