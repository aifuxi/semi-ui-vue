import type { HTMLAttributes, ImgHTMLAttributes, StyleValue, VNodeChild } from 'vue';

export type ImageRatioType = 'adaptation' | 'realSize';
export type ImageCrossOrigin = 'anonymous' | 'use-credentials';

export interface ImageLocale {
  preview: string;
  loading: string;
  loadError: string;
  prevTip: string;
  nextTip: string;
  zoomInTip: string;
  zoomOutTip: string;
  rotateTip: string;
  downloadTip: string;
  adaptiveTip: string;
  originTip: string;
}

export interface ImagePreviewMenuProps {
  min: number;
  max: number;
  step: number;
  curPage: number;
  totalNum: number;
  zoom: number;
  ratio: ImageRatioType;
  disabledPrev: boolean;
  disabledNext: boolean;
  disabledZoomIn: boolean;
  disabledZoomOut: boolean;
  disableDownload: boolean;
  onDownload: () => void;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRatioClick: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  menuItems: VNodeChild[];
}

export interface ImagePreviewProps {
  adaptiveTip?: string | undefined;
  class?: HTMLAttributes['class'] | undefined;
  className?: string | undefined;
  closable?: boolean | undefined;
  closeOnEsc?: boolean | undefined;
  crossOrigin?: ImageCrossOrigin | undefined;
  currentIndex?: number | undefined;
  defaultCurrentIndex?: number | undefined;
  defaultVisible?: boolean | undefined;
  disableDownload?: boolean | undefined;
  downloadTip?: string | undefined;
  getPopupContainer?: (() => HTMLElement) | undefined;
  infinite?: boolean | undefined;
  initialZoom?: number | undefined;
  lazyLoad?: boolean | undefined;
  lazyLoadMargin?: string | undefined;
  maskClosable?: boolean | undefined;
  maxZoom?: number | undefined;
  minZoom?: number | undefined;
  nextTip?: string | undefined;
  originTip?: string | undefined;
  preLoad?: boolean | undefined;
  preLoadGap?: number | undefined;
  prevTip?: string | undefined;
  previewCls?: string | undefined;
  previewStyle?: StyleValue | undefined;
  previewTitle?: VNodeChild | undefined;
  renderCloseIcon?: VNodeChild | (() => VNodeChild) | undefined;
  renderHeader?: ((title: VNodeChild) => VNodeChild) | undefined;
  renderLeftIcon?: VNodeChild | ((index: number) => VNodeChild) | undefined;
  renderPreviewMenu?: ((props: ImagePreviewMenuProps) => VNodeChild) | undefined;
  renderRightIcon?: VNodeChild | ((index: number) => VNodeChild) | undefined;
  rotateTip?: string | undefined;
  setDownloadName?: ((src: string) => string) | undefined;
  showTooltip?: boolean | undefined;
  src?: string | string[] | undefined;
  style?: StyleValue | undefined;
  viewerVisibleDelay?: number | undefined;
  visible?: boolean | undefined;
  zIndex?: number | undefined;
  zoomInTip?: string | undefined;
  zoomOutTip?: string | undefined;
  zoomStep?: number | undefined;
}

export interface ImagePreviewOptions extends ImagePreviewProps {
  onChange?: ((index: number) => void) | undefined;
  onClose?: (() => void) | undefined;
  onDownload?: ((src: string, index: number) => void) | undefined;
  onDownloadError?: ((src: string) => void) | undefined;
  onNext?: ((index: number) => void) | undefined;
  onPrev?: ((index: number) => void) | undefined;
  onRatioChange?: ((type: ImageRatioType) => void) | undefined;
  onRotateLeft?: ((angle: number) => void) | undefined;
  onVisibleChange?: ((visible: boolean) => void) | undefined;
  onZoomIn?: ((zoom: number) => void) | undefined;
  onZoomOut?: ((zoom: number) => void) | undefined;
}

export interface ImageProps extends /* @vue-ignore */ Omit<
  ImgHTMLAttributes,
  | 'class'
  | 'style'
  | 'src'
  | 'width'
  | 'height'
  | 'crossorigin'
  | 'onLoad'
  | 'onError'
  | 'placeholder'
> {
  alt?: string | undefined;
  class?: HTMLAttributes['class'] | undefined;
  className?: string | undefined;
  crossOrigin?: ImageCrossOrigin | undefined;
  fallback?: string | VNodeChild | undefined;
  height?: string | number | undefined;
  imageID?: number | undefined;
  imgCls?: HTMLAttributes['class'] | undefined;
  imgStyle?: StyleValue | undefined;
  placeholder?: VNodeChild | undefined;
  preview?: boolean | ImagePreviewOptions | undefined;
  setDownloadName?: ((src: string) => string) | undefined;
  src?: string | undefined;
  style?: StyleValue | undefined;
  width?: string | number | undefined;
}

export interface ImageEmits {
  click: [event: MouseEvent];
  error: [event: Event];
  load: [event: Event];
}

export interface ImageSlots {
  fallback?: () => VNodeChild;
  placeholder?: () => VNodeChild;
}

export interface ImagePreviewEmits {
  change: [index: number];
  close: [];
  download: [src: string, index: number];
  downloadError: [src: string];
  next: [index: number];
  prev: [index: number];
  ratioChange: [type: ImageRatioType];
  rotateLeft: [angle: number];
  'update:currentIndex': [index: number];
  'update:visible': [visible: boolean];
  visibleChange: [visible: boolean];
  zoomIn: [zoom: number];
  zoomOut: [zoom: number];
}

export interface ImagePreviewSlots {
  closeIcon?: () => VNodeChild;
  default?: () => VNodeChild;
  header?: (props: { title: VNodeChild }) => VNodeChild;
  leftIcon?: (props: { index: number }) => VNodeChild;
  previewMenu?: (props: ImagePreviewMenuProps) => VNodeChild;
  rightIcon?: (props: { index: number }) => VNodeChild;
}

export interface ImageState {
  loadStatus: 'loading' | 'success' | 'error';
  previewVisible: boolean;
  src: string;
}

export interface ImagePreviewState {
  currentIndex: number;
  visible: boolean;
}

export interface ImagePreviewInnerState {
  currentIndex: number;
  direction: string;
  imgLoadStatus: Record<string, boolean>;
  imgSrc: string[];
  preloadAfterVisibleChange: boolean;
  ratio: ImageRatioType;
  rotation: number;
  viewerVisible: boolean;
  visible: boolean;
  zoom: number;
}

export interface ImagePreviewImageState {
  currZoom: number;
  height: number;
  loading: boolean;
  translate: { x: number; y: number };
  width: number;
}
