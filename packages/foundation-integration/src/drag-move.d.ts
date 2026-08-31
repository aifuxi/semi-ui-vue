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

export interface DragMoveFoundationProps {
  allowInputDrag: boolean;
  allowMove?: ((event: MouseEvent | TouchEvent, element: HTMLElement) => boolean) | undefined;
  customMove?: ((element: HTMLElement, top: number, left: number) => void) | undefined;
  positionStrategy: 'absolute' | 'relative';
}

export interface DragMoveAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getDragElement(): HTMLElement;
  getConstrainer(): HTMLElement | null;
  getHandler(): HTMLElement;
  notifyMouseDown?(event: MouseEvent): void;
  notifyMouseMove?(event: MouseEvent): void;
  notifyMouseUp?(event: MouseEvent): void;
  notifyTouchStart?(event: TouchEvent): void;
  notifyTouchMove?(event: TouchEvent): void;
  notifyTouchEnd?(event: TouchEvent): void;
  notifyTouchCancel?(event: TouchEvent): void;
}

export function clampValueInRange(value: number, min: number, max: number): number;

export class DragMoveFoundation<Props, State> {
  constructor(adapter: DragMoveAdapter<Props, State>);
  init(): void;
  destroy(): void;
  updatePositionStrategy(): void;
  onMouseDown(event: MouseEvent): void;
  onTouchStart(event: TouchEvent): void;
}
