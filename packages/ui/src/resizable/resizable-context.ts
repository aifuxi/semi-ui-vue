import type { InjectionKey } from 'vue';

import type {
  ResizeDirection,
  ResizeGroupDirection,
  ResizeInputType,
  ResizeMoveEvent,
  ResizeSize,
  ResizeStartPointer,
} from './types';

export interface ResizeItemRegistration {
  id: symbol;
  element: HTMLElement;
  min?: string;
  max?: string;
  defaultSize?: string | number;
  onResizeStart: (event: ResizeStartPointer, direction: ResizeDirection) => void;
  onChange: (size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection) => void;
  onResizeEnd: (size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection) => void;
}

export interface ResizeHandlerRegistration {
  id: symbol;
  element: HTMLElement;
}

export interface ResizeGroupContext {
  direction: Readonly<{ value: ResizeGroupDirection }>;
  registerItem: (item: ResizeItemRegistration) => void;
  unregisterItem: (id: symbol) => void;
  registerHandler: (handler: ResizeHandlerRegistration) => void;
  unregisterHandler: (id: symbol) => void;
  startResize: (id: symbol, event: ResizeStartPointer, type: ResizeInputType) => void;
}

export const resizeGroupContextKey: InjectionKey<ResizeGroupContext> = Symbol('resize-group');
