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

export interface CropperAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getContainer(): HTMLElement;
  getImg(): HTMLImageElement;
  notifyZoomChange(zoom: number): void;
}

export interface CropperPoint {
  x: number;
  y: number;
}

export interface CropperImageDataState {
  width: number;
  height: number;
  centerPoint: CropperPoint;
}

export interface CropperBoxState {
  width: number;
  height: number;
  centerPoint: CropperPoint;
}

export class CropperFoundation<Props, State> {
  constructor(adapter: CropperAdapter<Props, State>);
  destroy(): void;
  init(): void;
  getCropperCanvas(): HTMLCanvasElement;
  handleCornerMouseDown(event: MouseEvent): void;
  handleCropperBoxMouseDown(event: MouseEvent): void;
  handleImageLoad(event: Event): void;
  handleMaskMouseDown(event: MouseEvent): void;
  handleResize(): void;
  handleWheel(event: WheelEvent): void;
  updatePreview(props: {
    width: number;
    height: number;
    translateX: number;
    translateY: number;
    rotate: number;
  }): void;
  viewIMGDragStart(event: DragEvent): void;
}

export const cropperCssClasses: Readonly<Record<string, string>>;
export const cropperStrings: Readonly<{
  shape: readonly string[];
  corner: readonly string[];
  roundCorner: readonly string[];
}>;
