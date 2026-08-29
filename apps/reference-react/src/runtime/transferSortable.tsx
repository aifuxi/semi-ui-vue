import React from 'react';

export const verticalListSortingStrategy = {};
export const rectSortingStrategy = {};
export const sortableKeyboardCoordinates = () => undefined;
export const closestCenter = () => undefined;
export const MouseSensor = class {};
export const TouchSensor = class {};
export const KeyboardSensor = class {};
export const TraversalOrder = {};
export const CSS = { Transform: { toString: () => '' } };

export function useSensor(): Record<string, never> {
  return {};
}

export function useSensors(...sensors: unknown[]): unknown[] {
  return sensors;
}

export function useSortable(): Record<string, unknown> {
  return {
    attributes: {},
    listeners: {},
    setNodeRef: () => undefined,
    transform: null,
    transition: null,
    isDragging: false,
  };
}

export function DndContext(props: { children?: React.ReactNode }): React.ReactElement {
  return <>{props.children}</>;
}

export const DragOverlay = DndContext;
export const SortableContext = DndContext;

export function Sortable(): React.ReactElement | null {
  return null;
}

export default Sortable;
