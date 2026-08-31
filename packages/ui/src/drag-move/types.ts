import type { VNodeChild } from 'vue';

export type DragMovePositionStrategy = 'absolute' | 'relative';
export type DragMoveConstrainer = 'parent' | (() => HTMLElement | null | undefined);
export type DragMoveAllowMove = (event: MouseEvent | TouchEvent, element: HTMLElement) => boolean;
export type DragMoveCustomMove = (element: HTMLElement, top: number, left: number) => void;

export interface DragMoveProps {
  allowInputDrag?: boolean;
  allowMove?: DragMoveAllowMove;
  constrainer?: DragMoveConstrainer;
  customMove?: DragMoveCustomMove;
  handler?: () => HTMLElement | null | undefined;
  positionStrategy?: DragMovePositionStrategy;
}

export interface DragMoveEmits {
  mouseDown: [event: MouseEvent];
  mouseMove: [event: MouseEvent];
  mouseUp: [event: MouseEvent];
  touchStart: [event: TouchEvent];
  touchMove: [event: TouchEvent];
  touchEnd: [event: TouchEvent];
  touchCancel: [event: TouchEvent];
}

export interface DragMoveSlots {
  default: () => VNodeChild;
}
