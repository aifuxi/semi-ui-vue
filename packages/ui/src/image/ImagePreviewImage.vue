<script setup lang="ts">
import {
  ImagePreviewImageFoundation,
  type ImagePreviewImageAdapter,
} from '@workspace/foundation-integration';
import {
  computed,
  markRaw,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useTemplateRef,
  watch,
} from 'vue';

import type { ImageCrossOrigin, ImagePreviewImageState, ImageRatioType } from './types';

const props = defineProps<{
  crossOrigin?: ImageCrossOrigin | undefined;
  disableDownload: boolean;
  initialZoom?: number | undefined;
  maxZoom: number;
  minZoom: number;
  ratio: ImageRatioType;
  rotation: number;
  src?: string | undefined;
  zoom: number;
}>();
const emit = defineEmits<{
  error: [src: string];
  load: [src: string];
  ratio: [type: ImageRatioType];
  zoom: [zoom: number, notify?: boolean];
}>();
const container = useTemplateRef<HTMLDivElement>('container');
const image = useTemplateRef<HTMLImageElement>('image');
const state = shallowReactive<ImagePreviewImageState>({
  currZoom: props.zoom,
  height: 0,
  loading: true,
  translate: { x: 0, y: 0 },
  width: 0,
});
const cache = new Map<unknown, unknown>();

type RuntimeProps = typeof props & {
  onError: (src: string) => void;
  onLoad: (src: string) => void;
  onZoom: (zoom: number, notify?: boolean) => void;
  setRatio: (type: ImageRatioType) => void;
};

function runtimeProps(): RuntimeProps {
  return {
    ...props,
    onError: (src) => emit('error', src),
    onLoad: (src) => emit('load', src),
    onZoom: (zoom, notify) => emit('zoom', zoom, notify),
    setRatio: (type) => emit('ratio', type),
  };
}

const adapter: ImagePreviewImageAdapter<RuntimeProps, ImagePreviewImageState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps()[key],
  getProps: runtimeProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  getContainer: () => container.value,
  getImage: () => image.value,
  setLoading: (loading) => {
    state.loading = loading;
  },
  setImageCursor: (canDrag) => {
    if (image.value) image.value.style.cursor = canDrag ? 'grab' : 'default';
  },
};
const foundation = markRaw(
  new ImagePreviewImageFoundation<RuntimeProps, ImagePreviewImageState>(adapter),
);

const imageStyle = computed(() => ({
  height: `${state.height}px`,
  position: 'absolute' as const,
  transform: `translate(${state.translate.x}px, ${state.translate.y}px) rotate(${props.rotation}deg)`,
  visibility: state.loading ? ('hidden' as const) : ('visible' as const),
  width: `${state.width}px`,
}));

function handleLoad(event: Event): void {
  foundation.handleLoad(event);
}

watch(
  () => props.src,
  (src, previous) => {
    if (src && src !== previous) foundation.setLoading(true);
  },
);
watch(
  () => props.ratio,
  (ratio, previous) => {
    if (ratio !== previous) foundation.handleRatioChange();
  },
);
watch(
  () => props.rotation,
  (rotation, previous) => {
    if (rotation !== previous) foundation.handleWindowResize();
  },
);

onMounted(() => {
  foundation.init();
  window.addEventListener('resize', foundation.handleWindowResize);
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', foundation.handleWindowResize);
  foundation.destroy();
});

defineExpose({ changeZoom: foundation.changeZoom.bind(foundation) });
</script>

<template>
  <div ref="container" class="semi-image-preview-image">
    <img
      ref="image"
      alt="previewImag"
      class="semi-image-preview-image-img"
      :crossorigin="props.crossOrigin"
      :src="props.src"
      :style="imageStyle"
      @contextmenu="foundation.handleRightClickImage"
      @dragstart.prevent
      @error="foundation.handleError"
      @load="handleLoad"
      @mousedown="foundation.handleImageMouseDown"
      @mousemove="foundation.handleImageMove"
    />
    <div v-if="state.loading" class="semi-spin semi-spin-large semi-image-preview-image-spin">
      <div class="semi-spin-wrapper">
        <svg
          aria-hidden="true"
          data-icon="spin"
          height="48"
          version="1.1"
          viewBox="0 0 36 36"
          width="48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="linearGradient-semi-image-preview-spin"
              x1="0%"
              x2="100%"
              y1="100%"
              y2="100%"
            >
              <stop offset="0%" stop-color="currentColor" stop-opacity="0" />
              <stop offset="39.9430698%" stop-color="currentColor" stop-opacity="0.50" />
              <stop offset="100%" stop-color="currentColor" />
            </linearGradient>
          </defs>
          <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
            <rect fill="none" fill-opacity="0.01" height="36" width="36" x="0" y="0" />
            <path
              d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951"
              stroke="url(#linearGradient-semi-image-preview-spin)"
              stroke-linecap="round"
              stroke-width="4"
            />
          </g>
        </svg>
      </div>
      <div class="semi-spin-children" x-semi-prop="children" />
    </div>
  </div>
</template>
