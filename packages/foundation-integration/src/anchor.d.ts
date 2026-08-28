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

export interface AnchorAdapter<Props, State> extends DefaultAdapter<Props, State> {
  addLink(link: string): void;
  removeLink(link: string): void;
  setChildMap(value: Record<string, Set<string>>): void;
  setScrollHeight(height: string): void;
  setSlideBarTop(height: number): void;
  setClickLink(value: boolean): void;
  setActiveLink(link: string, callback: () => void): void;
  setClickLinkWithCallBack(value: boolean, link: string, callback: (link: string) => void): void;
  getContainer(): HTMLElement | Window;
  getContainerBoundingTop(): number;
  getLinksBoundingTop(): number[];
  getAnchorNode(selector: string): HTMLElement | null;
  getContentNode(selector: string): HTMLElement | null;
  notifyChange(currentLink: string, previousLink: string): void;
  notifyClick(event: MouseEvent | KeyboardEvent | null, link: string): void;
  canSmoothScroll(): boolean;
}

export class AnchorFoundation<Props, State> {
  constructor(adapter: AnchorAdapter<Props, State>);
  addLink(link: string): void;
  removeLink(link: string): void;
  setScrollHeight(): void;
  handleScroll(): void;
  handleClick(event: MouseEvent | KeyboardEvent | null, link: string, shouldNotify?: boolean): void;
  handleClickLink(): void;
}

export interface AnchorLinkAdapter<Props, State> extends DefaultAdapter<Props, State> {
  addLink(link: string): void;
  removeLink(link: string): void;
}

export class AnchorLinkFoundation<Props, State> {
  constructor(adapter: AnchorLinkAdapter<Props, State>);
  handleAddLink(): void;
  handleRemoveLink(): void;
  handleUpdateLink(href: string, previousHref: string): void;
}
