import { CropperFoundation, type CropperAdapter } from '@workspace/foundation-integration';
import { markRaw, onBeforeUnmount, onMounted, shallowReactive, watch, type ShallowRef } from 'vue';

import type { CropperEmits, CropperProps, CropperState } from './types';

type RuntimeCropperProps = Readonly<
  CropperProps &
    Required<
      Pick<
        CropperProps,
        | 'defaultAspectRatio'
        | 'fill'
        | 'maxZoom'
        | 'minZoom'
        | 'shape'
        | 'showResizeBox'
        | 'zoomStep'
      >
    >
>;

export function useCropperFoundation(
  props: RuntimeCropperProps,
  containerRef: Readonly<ShallowRef<HTMLDivElement | null>>,
  imageRef: Readonly<ShallowRef<HTMLImageElement | null>>,
  emit: <Event extends keyof CropperEmits>(event: Event, ...args: CropperEmits[Event]) => void,
) {
  const state = shallowReactive<CropperState>({
    imgData: { width: 0, height: 0, centerPoint: { x: 0, y: 0 } },
    cropperBox: { width: 0, height: 0, centerPoint: { x: 0, y: 0 } },
    zoom: 1,
    rotate: 0,
    loaded: false,
  });
  const cache = new Map<unknown, unknown>();
  const runtimeProps = () => props;
  const adapter: CropperAdapter<RuntimeCropperProps, CropperState> = {
    getContext: () => undefined,
    getContexts: () => ({}),
    getProp: (key) => runtimeProps()[key],
    getProps: runtimeProps,
    getState: (key) => state[key],
    getStates: () => state,
    setState: (nextState, callback) => {
      const wasLoaded = state.loaded;
      Object.assign(state, nextState);
      if (!wasLoaded && state.loaded) syncControlledProps(props.rotate, props.zoom);
      callback?.();
    },
    getCache: (key) => cache.get(key),
    getCaches: () => cache,
    setCache: (key, value) => cache.set(key, value),
    stopPropagation: (event) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
    getContainer: () => containerRef.value as HTMLDivElement,
    getImg: () => imageRef.value as HTMLImageElement,
    notifyZoomChange: (zoom) => {
      emit('zoomChange', zoom);
      emit('update:zoom', zoom);
    },
  };
  const foundation = markRaw(new CropperFoundation<RuntimeCropperProps, CropperState>(adapter));
  let observer: ResizeObserver | undefined;

  function syncControlledProps(newRotate: number | undefined, newZoom: number | undefined): void {
    if (!state.loaded) return;
    const { rotate, zoom, imgData, cropperBox } = state;
    let nextWidth = imgData.width;
    let nextHeight = imgData.height;
    let nextImgCenter = { ...imgData.centerPoint };
    const nextState: Partial<CropperState> = {};

    if (newRotate !== undefined && newRotate !== rotate) {
      nextState.rotate = newRotate;
      const rotateCenter = { x: cropperBox.centerPoint.x, y: -cropperBox.centerPoint.y };
      const imgCenter = { x: imgData.centerPoint.x, y: -imgData.centerPoint.y };
      const angle = ((newRotate - rotate) * Math.PI) / 180;
      nextImgCenter = {
        x:
          (imgCenter.x - rotateCenter.x) * Math.cos(angle) +
          (imgCenter.y - rotateCenter.y) * Math.sin(angle) +
          rotateCenter.x,
        y: -(
          -(imgCenter.x - rotateCenter.x) * Math.sin(angle) +
          (imgCenter.y - rotateCenter.y) * Math.cos(angle) +
          rotateCenter.y
        ),
      };
    }
    // The pinned Adapter gates zoom synchronization on rotate being provided.
    if (newRotate !== undefined && newZoom !== zoom) {
      nextState.zoom = newZoom as number;
      const resolvedZoom = newZoom as number;
      const scaleCenter = { x: cropperBox.centerPoint.x, y: -cropperBox.centerPoint.y };
      const currentImgCenter = { x: nextImgCenter.x, y: -nextImgCenter.y };
      nextWidth = (imgData.width / zoom) * resolvedZoom;
      nextHeight = (imgData.height / zoom) * resolvedZoom;
      nextImgCenter = {
        x: ((currentImgCenter.x - scaleCenter.x) / zoom) * resolvedZoom + scaleCenter.x,
        y: -(((currentImgCenter.y - scaleCenter.y) / zoom) * resolvedZoom + scaleCenter.y),
      };
    }
    if (newRotate !== rotate || newZoom !== zoom) {
      nextState.imgData = {
        width: nextWidth,
        height: nextHeight,
        centerPoint: nextImgCenter,
      };
    }
    Object.assign(state, nextState);
  }

  watch(
    () => [props.rotate, props.zoom] as const,
    ([newRotate, newZoom]) => syncControlledProps(newRotate, newZoom),
  );

  onMounted(() => {
    foundation.init();
    containerRef.value?.addEventListener('wheel', foundation.handleWheel, { passive: false });
    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
      observer = new ResizeObserver(() => foundation.handleResize());
      observer.observe(containerRef.value);
    }
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = undefined;
    containerRef.value?.removeEventListener('wheel', foundation.handleWheel);
    foundation.destroy();
  });

  return { foundation, state };
}
