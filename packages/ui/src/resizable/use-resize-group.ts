import {
  ResizeGroupFoundation,
  type FoundationResizeEventType,
  type ResizeGroupAdapter,
} from '@workspace/foundation-integration';
import {
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  watch,
  type ComputedRef,
  type CSSProperties,
  type ShallowRef,
} from 'vue';

import type {
  ResizeGroupContext,
  ResizeHandlerRegistration,
  ResizeItemRegistration,
} from './resizable-context';
import type { ResizeGroupDirection, ResizeInputType, ResizeStartPointer } from './types';

interface FoundationGroupState {
  isResizing: boolean;
  originalPosition: {
    x: number;
    y: number;
    lastItemSize: number;
    nextItemSize: number;
    lastOffset: number;
    nextOffset: number;
  };
  backgroundStyle: CSSProperties;
  curHandler: number | null;
}

interface FoundationGroupProps {
  direction: ResizeGroupDirection;
}

export function useResizeGroup(
  direction: ComputedRef<ResizeGroupDirection>,
  root: Readonly<ShallowRef<HTMLElement | null>>,
) {
  const items = shallowReactive<ResizeItemRegistration[]>([]);
  const handlers = shallowReactive<ResizeHandlerRegistration[]>([]);
  const state = shallowReactive<FoundationGroupState>({
    isResizing: false,
    originalPosition: {
      x: 0,
      y: 0,
      lastItemSize: 0,
      nextItemSize: 0,
      lastOffset: 0,
      nextOffset: 0,
    },
    backgroundStyle: { cursor: 'auto' },
    curHandler: null,
  });
  const cache = new Map<string, unknown>();
  let mounted = false;

  function getWindow(): Window | null {
    return root.value?.ownerDocument.defaultView ?? null;
  }

  function getProps(): FoundationGroupProps {
    return { direction: direction.value };
  }

  const adapter: ResizeGroupAdapter<FoundationGroupProps, FoundationGroupState> = {
    getContext: () => undefined,
    getContexts: () => undefined,
    getProp: (key) => getProps()[key as keyof FoundationGroupProps],
    getProps,
    getState: (key) => state[key as keyof FoundationGroupState],
    getStates: () => state,
    setState: (nextState, callback) => {
      Object.assign(state, nextState);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(String(key), value),
    stopPropagation: (event) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
    getGroupRef: () => root.value as HTMLDivElement | null,
    getItem: (index) => items[index]!.element as HTMLDivElement,
    getItemCount: () => items.length,
    getHandler: (index) => handlers[index]!.element as HTMLDivElement,
    getHandlerCount: () => handlers.length,
    getItemMin: (index) => items[index]?.min as string,
    getItemMax: (index) => items[index]?.max as string,
    getItemStart: (index) => items[index]!.onResizeStart as (...args: never[]) => void,
    getItemChange: (index) => items[index]!.onChange as (...args: never[]) => void,
    getItemEnd: (index) => items[index]!.onResizeEnd as (...args: never[]) => void,
    getItemDefaultSize: (index) => items[index]?.defaultSize as string | number,
    registerEvents: (type = 'mouse') => {
      const view = getWindow();
      if (!view) return;
      if (type === 'mouse') {
        view.addEventListener('mousemove', foundation.onMouseMove);
        view.addEventListener('mouseup', foundation.onResizeEnd);
        view.addEventListener('mouseleave', foundation.onResizeEnd);
      } else {
        view.addEventListener('touchmove', foundation.onTouchMove, { passive: false });
        view.addEventListener('touchend', foundation.onResizeEnd);
        view.addEventListener('touchcancel', foundation.onResizeEnd);
      }
    },
    unregisterEvents: (type = 'mouse') => {
      const view = getWindow();
      if (!view) return;
      if (type === 'mouse') {
        view.removeEventListener('mousemove', foundation.onMouseMove);
        view.removeEventListener('mouseup', foundation.onResizeEnd);
        view.removeEventListener('mouseleave', foundation.onResizeEnd);
      } else {
        view.removeEventListener('touchmove', foundation.onTouchMove);
        view.removeEventListener('touchend', foundation.onResizeEnd);
        view.removeEventListener('touchcancel', foundation.onResizeEnd);
      }
    },
  };
  const foundation = markRaw(
    new ResizeGroupFoundation<FoundationGroupProps, FoundationGroupState>(adapter),
  );

  function refreshSpace(): void {
    if (mounted && root.value) void nextTick(() => foundation.initSpace());
  }

  function registerItem(item: ResizeItemRegistration): void {
    if (items.some((entry) => entry.id === item.id)) return;
    items.push(item);
    refreshSpace();
  }

  function unregisterItem(id: symbol): void {
    const index = items.findIndex((entry) => entry.id === id);
    if (index >= 0) items.splice(index, 1);
    refreshSpace();
  }

  function registerHandler(handler: ResizeHandlerRegistration): void {
    if (handlers.some((entry) => entry.id === handler.id)) return;
    handlers.push(handler);
    refreshSpace();
  }

  function unregisterHandler(id: symbol): void {
    const index = handlers.findIndex((entry) => entry.id === id);
    if (index >= 0) handlers.splice(index, 1);
    refreshSpace();
  }

  function startResize(id: symbol, event: ResizeStartPointer, type: ResizeInputType): void {
    const index = handlers.findIndex((handler) => handler.id === id);
    if (index < 0 || !items[index] || !items[index + 1]) return;
    foundation.onResizeStart(index, event as MouseEvent, type as FoundationResizeEventType);
  }

  watch(direction, async (nextDirection) => {
    foundation.direction = nextDirection;
    for (const item of items) {
      if (nextDirection === 'horizontal') {
        item.element.style.width = item.element.style.height;
        item.element.style.removeProperty('height');
      } else {
        item.element.style.height = item.element.style.width;
        item.element.style.removeProperty('width');
      }
    }
    await nextTick();
  });

  onMounted(() => {
    mounted = true;
    foundation.init();
    getWindow()?.addEventListener('resize', foundation.ensureConstraint);
  });
  onBeforeUnmount(() => {
    mounted = false;
    getWindow()?.removeEventListener('resize', foundation.ensureConstraint);
    adapter.unregisterEvents('mouse');
    adapter.unregisterEvents('touch');
    foundation.destroy();
  });

  const context: ResizeGroupContext = {
    direction,
    registerItem,
    unregisterItem,
    registerHandler,
    unregisterHandler,
    startResize,
  };
  return { state, context };
}
