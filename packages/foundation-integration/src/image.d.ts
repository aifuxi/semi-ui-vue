export type ImageRatioType = 'adaptation' | 'realSize';

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

export interface ImageFoundationAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getIsInGroup(): boolean;
}

export class ImageFoundation<Props, State> {
  constructor(adapter: ImageFoundationAdapter<Props, State>);
  destroy(): void;
  handleClick(event: MouseEvent): void;
  handleLoaded(event: Event): void;
  handleError(event: Event): void;
  handlePreviewVisibleChange(visible: boolean): void;
}

export class ImagePreviewFoundation<Props, State> {
  constructor(adapter: DefaultAdapter<Props, State>);
  destroy(): void;
  handleVisibleChange(visible: boolean): void;
  handleCurrentIndexChange(index: number): void;
}

export interface ImagePreviewInnerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getIsInGroup(): boolean;
  notifyChange(index: number, direction: string): void;
  notifyZoom(zoom: number, increase: boolean): void;
  notifyClose(): void;
  notifyVisibleChange(visible: boolean): void;
  notifyRatioChange(type: ImageRatioType): void;
  notifyRotateChange(angle: number): void;
  notifyDownload(src: string, index: number): void;
  notifyDownloadError(src: string): void;
  registerKeyDownListener(): void;
  unregisterKeyDownListener(): void;
  disabledBodyScroll(): void;
  enabledBodyScroll(): void;
  getSetDownloadFunc(): ((src: string) => string) | undefined;
  isValidTarget(event: MouseEvent): boolean;
  changeImageZoom(zoom: number, event?: WheelEvent): void;
}

export class ImagePreviewInnerFoundation<Props, State> {
  constructor(adapter: ImagePreviewInnerAdapter<Props, State>);
  destroy(): void;
  beforeShow(): void;
  afterHide(): void;
  clearTimer(): void;
  updateTimer(): void;
  handleMouseMove(event: MouseEvent): void;
  handleMouseDown(event: MouseEvent): void;
  handleMouseUp(event: MouseEvent): void;
  handleKeyDown(event: KeyboardEvent): void;
  handleWheel(event: WheelEvent): void;
  handleSwitchImage(direction: string): void;
  handleDownload(): void;
  handlePreviewClose(event: MouseEvent): void;
  handleAdjustRatio(type: ImageRatioType): void;
  handleRotateImage(direction: string): void;
  handleZoomImage(zoom: number, notify?: boolean, event?: WheelEvent): void;
  preloadSingleImage(): void;
  onImageLoad(src: string): void;
}

export interface ImagePreviewImageAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getContainer(): HTMLDivElement | null;
  getImage(): HTMLImageElement | null;
  setLoading(loading: boolean): void;
  setImageCursor(canDrag: boolean): void;
}

export class ImagePreviewImageFoundation<Props, State> {
  constructor(adapter: ImagePreviewImageAdapter<Props, State>);
  destroy(): void;
  init(): void;
  setLoading(loading: boolean): void;
  handleWindowResize(): void;
  handleLoad(event: Event): void;
  handleError(event: Event): void;
  handleRatioChange(): void;
  handleRightClickImage(event: MouseEvent): boolean;
  handleImageMove(event: MouseEvent): void;
  handleImageMouseDown(event: MouseEvent): void;
  changeZoom(zoom: number, event?: WheelEvent): void;
}

export class ImagePreviewFooterFoundation<Props, State> {
  constructor(adapter: DefaultAdapter<Props, State>);
  destroy(): void;
  changeSliderValue(type: string): void;
  handleValueChange(value: number): void;
  handleRatioClick(): void;
  handleRotate(direction: string): void;
}

export function crossMergeImageSources<T>(left: T[], right: T[]): T[];
export function getPreloadImageSources(
  sources: string[],
  currentIndex: number,
  preLoadGap: number,
  infinite: boolean,
): string[];
export function isImagePreviewTarget(
  event: Event,
  targetClasses: readonly string[],
): boolean | undefined;
