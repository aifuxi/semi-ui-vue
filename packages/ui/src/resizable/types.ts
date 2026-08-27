import type { CSSProperties, VNodeChild } from 'vue';

export const RESIZE_DIRECTIONS = [
  'top',
  'right',
  'bottom',
  'left',
  'topRight',
  'bottomRight',
  'bottomLeft',
  'topLeft',
] as const;

export type ResizeDirection = (typeof RESIZE_DIRECTIONS)[number];
export type ResizeGroupDirection = 'horizontal' | 'vertical';
export type ResizeInputType = 'mouse' | 'touch';
export type ResizeMoveEvent = MouseEvent | TouchEvent;
export type ResizeStartPointer = MouseEvent | Touch;

export interface ResizeSize {
  width?: string | number;
  height?: string | number;
}

export type ResizeEnable = Partial<Record<ResizeDirection, boolean>>;
export type ResizeHandleStyle = Partial<Record<ResizeDirection, CSSProperties>>;
export type ResizeHandleClass = Partial<Record<ResizeDirection, string>>;
export type ResizeHandleNode = Partial<Record<ResizeDirection, VNodeChild>>;

export type ResizeStartGuard = (
  event: ResizeStartPointer,
  direction: ResizeDirection,
) => boolean | void;

export interface ResizableProps {
  size?: ResizeSize;
  defaultSize?: ResizeSize;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  grid?: number | readonly [number, number];
  snap?: { x?: readonly number[]; y?: readonly number[] };
  snapGap?: number;
  boundElement?: 'parent' | 'window' | HTMLElement;
  boundsByDirection?: boolean;
  lockAspectRatio?: boolean | number;
  lockAspectRatioExtraWidth?: number;
  lockAspectRatioExtraHeight?: number;
  enable?: ResizeEnable | false;
  handleStyle?: ResizeHandleStyle;
  handleClass?: ResizeHandleClass;
  handleWrapperStyle?: CSSProperties;
  handleWrapperClass?: string;
  handleNode?: ResizeHandleNode;
  scale?: number;
  ratio?: number | readonly [number, number];
  beforeResizeStart?: ResizeStartGuard;
}

export interface ResizableEmits {
  resizeStart: [event: ResizeStartPointer, direction: ResizeDirection];
  change: [
    size: ResizeSize,
    event: ResizeStartPointer | ResizeMoveEvent,
    direction: ResizeDirection,
  ];
  resizeEnd: [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection];
  'update:size': [size: ResizeSize];
}

export interface ResizableSlots {
  default?: () => unknown;
  'handle-top'?: () => unknown;
  'handle-right'?: () => unknown;
  'handle-bottom'?: () => unknown;
  'handle-left'?: () => unknown;
  'handle-topRight'?: () => unknown;
  'handle-bottomRight'?: () => unknown;
  'handle-bottomLeft'?: () => unknown;
  'handle-topLeft'?: () => unknown;
}

export interface ResizeGroupProps {
  direction?: ResizeGroupDirection;
}

export interface ResizeGroupSlots {
  default?: () => unknown;
}

export interface ResizeItemProps {
  min?: string;
  max?: string;
  defaultSize?: string | number;
}

export interface ResizeItemEmits {
  resizeStart: [event: ResizeStartPointer, direction: ResizeDirection];
  change: [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection];
  resizeEnd: [size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection];
}

export interface ResizeItemSlots {
  default?: () => unknown;
}

export interface ResizeHandlerSlots {
  default?: () => unknown;
}
