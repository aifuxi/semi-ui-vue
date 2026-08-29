interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: string): unknown;
  getCaches(): Map<unknown, unknown>;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event?: { stopPropagation?: () => void }): void;
  persistEvent(event?: unknown): void;
}

export interface FoundationScrollItem {
  disabled?: boolean;
  text?: string;
  transform?: (value: unknown, text: string) => unknown;
  value: unknown;
  [key: string]: unknown;
}

export interface ScrollItemAdapter<
  Props,
  State,
  Item extends FoundationScrollItem,
> extends DefaultAdapter<Props, State> {
  setPrependCount(prependCount: number): void;
  setAppendCount(appendCount: number): void;
  setSelectedNode(element: HTMLElement): void;
  isDisabledIndex(index: number): boolean;
  notifySelectItem(data: Item & { index: number; type?: number | string }): void;
  scrollToCenter(selectedNode: Element, scrollWrapper?: Element, duration?: number): void;
}

export interface ScrollItemNearestNodeInfo {
  nearestIndex: number;
  nearestNode: HTMLElement | null;
}

export interface ScrollItemTargetNodeInfo<Item> {
  indexInList: number;
  infoInList: Item | null;
  targetIndex: number;
  targetNode: HTMLElement | undefined;
}

export class ScrollItemFoundation<Props, State, Item extends FoundationScrollItem> {
  constructor(adapter: ScrollItemAdapter<Props, State, Item>);
  init(): void;
  destroy(): void;
  selectIndex(index: number, listWrapper: HTMLElement): void;
  selectNode(node: HTMLElement, listWrapper: HTMLElement): void;
  initWheelList(listWrapper: HTMLElement, wrapper: HTMLElement, callback: () => void): void;
  adjustInfiniteList(
    listWrapper: HTMLElement,
    wrapper: HTMLElement,
    nearestNode: HTMLElement,
  ): void;
  getNearestNodeInfo(listWrapper: HTMLElement, selector: HTMLElement): ScrollItemNearestNodeInfo;
  getTargetNode(event: Event, listWrapper: HTMLElement): ScrollItemTargetNodeInfo<Item> | null;
}

export interface ScrollAnimation {
  destroy(): void;
  on(event: 'rest', callback: () => void): void;
  start(): void;
}

export function animatedScrollTo(
  element: HTMLElement,
  to: number,
  duration: number,
): ScrollAnimation;

export const scrollListCssClasses: Readonly<{
  PREFIX: string;
  SELECTED: string;
}>;
export const scrollListNumbers: Readonly<{
  DEFAULT_ITEM_HEIGHT: number;
  DEFAULT_SCROLL_DURATION: number;
}>;
export const scrollListStrings: Readonly<{ MODE: readonly ['normal', 'wheel'] }>;
