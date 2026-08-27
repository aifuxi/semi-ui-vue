import { ResizableFoundation, type ResizableAdapter } from '@workspace/foundation-integration';
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  type CSSProperties,
  type ShallowRef,
} from 'vue';

import type {
  ResizableEmits,
  ResizableProps,
  ResizeDirection,
  ResizeInputType,
  ResizeMoveEvent,
  ResizeStartPointer,
  ResizeSize,
} from './types';

interface FoundationSingleState {
  isResizing: boolean;
  direction: ResizeDirection;
  original: { x: number; y: number; width: number; height: number };
  width: string | number;
  height: string | number;
  backgroundStyle: CSSProperties;
  flexBasis?: string | number;
}

type FoundationSingleProps = ResizableProps & {
  onResizeStart: (event: ResizeStartPointer, direction: ResizeDirection) => boolean | void;
  onChange: (size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection) => void;
  onResizeEnd: (size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection) => void;
};

export interface SingleResizeBinding {
  state: FoundationSingleState;
  sizeStyle: Readonly<{ value: CSSProperties }>;
  constraintStyle: Readonly<{ value: CSSProperties }>;
  startResize: (
    event: ResizeStartPointer,
    direction: ResizeDirection,
    type: ResizeInputType,
  ) => void;
}

export function useSingleResize(
  props: Readonly<{ [Key in keyof ResizableProps]-?: ResizableProps[Key] | undefined }>,
  emit: <K extends keyof ResizableEmits>(event: K, ...args: ResizableEmits[K]) => void,
  root: Readonly<ShallowRef<HTMLElement | null>>,
): SingleResizeBinding {
  const initialSize = props.size ?? props.defaultSize ?? {};
  const state = shallowReactive<FoundationSingleState>({
    isResizing: false,
    direction: 'right',
    original: { x: 0, y: 0, width: 0, height: 0 },
    width: initialSize.width ?? 'auto',
    height: initialSize.height ?? 'auto',
    backgroundStyle: { cursor: 'auto' },
  });
  const cache = new Map<string, unknown>();

  function getWindow(): Window | null {
    return root.value?.ownerDocument.defaultView ?? null;
  }

  function getFoundationProps(): FoundationSingleProps {
    const foundationProps = {
      ...props,
      snap:
        props.snap === undefined
          ? undefined
          : {
              ...(props.snap.x === undefined ? {} : { x: [...props.snap.x] }),
              ...(props.snap.y === undefined ? {} : { y: [...props.snap.y] }),
            },
      onResizeStart: (event, direction) => {
        if (props.beforeResizeStart?.(event, direction) === false) return false;
        emit('resizeStart', event, direction);
      },
      onChange: (size, event, direction) => {
        emit('change', size, event, direction);
        emit('update:size', size);
      },
      onResizeEnd: (size, event, direction) => {
        emit('resizeEnd', size, event, direction);
      },
    } as FoundationSingleProps;
    return foundationProps;
  }

  const adapter: ResizableAdapter<FoundationSingleProps, FoundationSingleState> = {
    getContext: () => undefined,
    getContexts: () => undefined,
    getProp: (key) => getFoundationProps()[key as keyof FoundationSingleProps],
    getProps: getFoundationProps,
    getState: (key) => state[key as keyof FoundationSingleState],
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
    getResizable: () => root.value as HTMLDivElement | null,
    registerEvent: (type = 'mouse') => {
      const view = getWindow();
      if (!view) return;
      if (type === 'mouse') {
        view.addEventListener('mouseup', foundation.onMouseUp);
        view.addEventListener('mousemove', foundation.onMouseMove);
        view.addEventListener('mouseleave', foundation.onMouseUp);
      } else {
        view.addEventListener('touchmove', foundation.onTouchMove, { passive: false });
        view.addEventListener('touchend', foundation.onMouseUp);
        view.addEventListener('touchcancel', foundation.onMouseUp);
      }
    },
    unregisterEvent: (type = 'mouse') => {
      const view = getWindow();
      if (!view) return;
      if (type === 'mouse') {
        view.removeEventListener('mouseup', foundation.onMouseUp);
        view.removeEventListener('mousemove', foundation.onMouseMove);
        view.removeEventListener('mouseleave', foundation.onMouseUp);
      } else {
        view.removeEventListener('touchmove', foundation.onTouchMove);
        view.removeEventListener('touchend', foundation.onMouseUp);
        view.removeEventListener('touchcancel', foundation.onMouseUp);
      }
    },
  };
  const foundation = markRaw(
    new ResizableFoundation<FoundationSingleProps, FoundationSingleState>(adapter),
  );

  const sizeStyle = computed<CSSProperties>(() => ({
    ...foundation.sizeStyle,
    ...(state.flexBasis === undefined ? {} : { flexBasis: state.flexBasis }),
  }));
  const toCssDimension = (value: string | number | undefined) =>
    typeof value === 'number' ? `${value}px` : value;
  const constraintStyle = computed<CSSProperties>(() => ({
    userSelect: state.isResizing ? 'none' : 'auto',
    minWidth: toCssDimension(props.minWidth),
    minHeight: toCssDimension(props.minHeight),
    maxWidth: toCssDimension(props.maxWidth),
    maxHeight: toCssDimension(props.maxHeight),
  }));

  function startResize(
    event: ResizeStartPointer,
    direction: ResizeDirection,
    type: ResizeInputType,
  ): void {
    foundation.onResizeStart(event as MouseEvent, direction, type);
  }

  onMounted(() => foundation.init());
  onBeforeUnmount(() => foundation.destroy());

  return { state, sizeStyle, constraintStyle, startResize };
}
