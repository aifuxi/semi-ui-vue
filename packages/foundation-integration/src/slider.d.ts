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

export interface SliderLengths {
  sliderX: number;
  sliderY: number;
  sliderWidth: number;
  sliderHeight: number;
}

export interface SliderAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getSliderLengths(): SliderLengths;
  getParentRect(): DOMRect | undefined;
  getScrollParentVal(): { scrollTop: number; scrollLeft: number };
  isEventFromHandle(event: Event): boolean;
  getOverallVars(): { dragging: boolean[] };
  updateDisabled(disabled: boolean): void;
  transNewPropsToState(nextState: Partial<State>, callback?: () => void): void;
  notifyChange(value: number | number[]): void;
  setDragging(value: boolean[]): void;
  updateCurrentValue(value: number | number[]): void;
  setOverallVars(key: string, value: unknown): void;
  getMinHandleEl(): HTMLSpanElement | null;
  getMaxHandleEl(): HTMLSpanElement | null;
  onHandleDown(event: Event): void;
  onHandleMove(
    mousePosition: number,
    isMin: boolean,
    callback?: () => void,
    clickTrack?: boolean,
    outputValue?: number | number[],
  ): boolean | void;
  setEventDefault(event: Event): void;
  setStateVal<Key extends keyof State>(key: Key, value: State[Key]): void;
  checkAndUpdateIsInRenderTreeState(): boolean;
  onHandleEnter(position: 'min' | 'max' | ''): void;
  onHandleLeave(): void;
  onHandleUpBefore(event: Event): void;
  onHandleUpAfter(): void;
  unSubscribeEventListener(): void;
}

export class SliderFoundation<Props, State> {
  constructor(adapter: SliderAdapter<Props, State>);
  init(): void;
  destroy(): void;
  getMinAndMaxPercent(value: number | number[]): { min: number; max: number };
  computeHandleVisibleVal(
    visible: boolean | undefined,
    formatter: ((value: unknown) => unknown) | null | undefined,
    range: boolean,
  ): {
    tipVisible: { min: boolean; max: boolean };
    tipChildren: { min: unknown; max: unknown };
  };
  valueFormatIsCorrect(value: number | number[] | undefined): boolean;
  getScrollParent(element: HTMLElement | null): HTMLElement;
  outPutValue(value: number | number[]): number | number[];
  handleDisabledChange(disabled: boolean): void;
  handleValueChange(
    previousValue: number | number[] | undefined,
    nextValue: number | number[] | undefined,
  ): void;
  checkAndUpdateIsInRenderTreeState(): boolean;
  onHandleDown(event: MouseEvent, handler: 'min' | 'max'): boolean;
  onHandleMove(event: MouseEvent): boolean;
  onHandleTouchStart(event: TouchEvent, handler: 'min' | 'max'): void;
  onHandleTouchMove(event: TouchEvent): void;
  onHandleEnter(position: 'min' | 'max'): void;
  onHandleLeave(): void;
  onHandleUp(event: MouseEvent | TouchEvent | KeyboardEvent): boolean;
  handleKeyDown(event: KeyboardEvent, handler: 'min' | 'max'): void;
  onFocus(event: FocusEvent, handler: 'min' | 'max'): void;
  onBlur(event: FocusEvent, handler: 'min' | 'max'): void;
  handleWrapClick(event: MouseEvent): void;
  handleWrapperEnter(): void;
  handleWrapperLeave(): void;
  isMarkActive(mark: number): 'active' | 'unActive' | false;
}
