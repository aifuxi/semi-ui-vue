<script setup lang="ts">
import { ImageFoundation, type ImageFoundationAdapter } from '@workspace/foundation-integration';
import { IconEyeOpened, IconUploadError } from '@workspace/icons';
import {
  computed,
  inject,
  markRaw,
  normalizeStyle,
  shallowReactive,
  useAttrs,
  useSlots,
  watch,
  type VNodeChild,
} from 'vue';

import ImageNodeRenderer from './ImageNodeRenderer';
import ImagePreviewInner from './ImagePreviewInner.vue';
import { imagePreviewContextKey } from './image-context';
import type { ImageEmits, ImageProps, ImageSlots, ImageState } from './types';

defineOptions({ name: 'Image', inheritAttrs: false });
const props = withDefaults(defineProps<ImageProps>(), { preview: true });
const emit = defineEmits<ImageEmits>();
defineSlots<ImageSlots>();
const attrs = useAttrs();
const slots = useSlots();
const group = inject(imagePreviewContextKey, undefined);

const state = shallowReactive<ImageState>({
  loadStatus: 'loading',
  previewVisible:
    typeof props.preview === 'object'
      ? (props.preview.visible ?? props.preview.defaultVisible ?? false)
      : false,
  src: props.src ?? '',
});
const cache = new Map<unknown, unknown>();

type RuntimeProps = ImageProps & {
  onError?: (event: Event) => void;
  onLoad?: (event: Event) => void;
};

function runtimeProps(): RuntimeProps {
  return {
    ...props,
    onError: (event) => emit('error', event),
    onLoad: (event) => emit('load', event),
  } as RuntimeProps;
}

const adapter: ImageFoundationAdapter<RuntimeProps, ImageState> = {
  getContext: (key) => {
    if (!group) return undefined;
    if (key === 'setCurrentIndex') return group.setCurrentIndex;
    if (key === 'handleVisibleChange') return group.handleVisibleChange;
    return undefined;
  },
  getContexts: () => ({
    setCurrentIndex: group?.setCurrentIndex,
    handleVisibleChange: group?.handleVisibleChange,
  }),
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
  getIsInGroup: () => Boolean(group?.isGroup),
};
const foundation = markRaw(new ImageFoundation<RuntimeProps, ImageState>(adapter));

watch(
  () => props.src,
  (src) => {
    if ((src ?? '') === state.src) return;
    state.src = src ?? '';
    state.loadStatus = 'loading';
  },
);
watch(
  () => (typeof props.preview === 'object' ? props.preview.visible : undefined),
  (visible) => {
    if (typeof visible === 'boolean') state.previewVisible = visible;
  },
);

const isLazyGroupImage = computed(() => Boolean(group?.lazyLoad.value));
const canPreview = computed(
  () => state.loadStatus === 'success' && Boolean(props.preview) && !group?.isGroup,
);
const showPreviewCursor = computed(() => state.loadStatus === 'success' && Boolean(props.preview));
const previewOptions = computed(() => (typeof props.preview === 'object' ? props.preview : {}));
const previewBindings = computed<Record<string, unknown>>(() =>
  Object.fromEntries(
    Object.entries(previewOptions.value).filter(([, value]) => value !== undefined),
  ),
);
const previewSource = computed(() => previewOptions.value.src ?? state.src);
const imageAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => !['class', 'style'].includes(name))),
);
const outerStyle = computed(() => {
  const base = {
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  };
  const userStyle = normalizeStyle([attrs.style, props.style]);
  if (!userStyle || typeof userStyle !== 'object') return [base, userStyle];
  const definedUserStyle = Object.fromEntries(
    Object.entries(userStyle).filter(([, value]) => value !== undefined && value !== null),
  );
  return { ...base, ...definedUserStyle };
});
const placeholderContent = computed<VNodeChild>(() => slots.placeholder?.() ?? props.placeholder);
const fallbackContent = computed<VNodeChild>(() => slots.fallback?.() ?? props.fallback);

function handleClick(event: MouseEvent): void {
  emit('click', event);
  foundation.handleClick(event);
}

function handlePreviewVisibleChange(visible: boolean): void {
  foundation.handlePreviewVisibleChange(visible);
}
</script>

<template>
  <div
    class="semi-image"
    :class="[attrs.class, props.class, props.className]"
    :style="outerStyle"
    @click="handleClick"
  >
    <img
      v-bind="imageAttrs"
      :alt="props.alt"
      :class="[
        'semi-image-img',
        showPreviewCursor ? 'semi-image-img-preview' : undefined,
        state.loadStatus === 'error' ? 'semi-image-img-error' : undefined,
        props.imgCls,
      ]"
      :crossorigin="props.crossOrigin"
      :data-src="state.src"
      :height="props.height"
      :src="isLazyGroupImage ? undefined : state.src"
      :style="props.imgStyle"
      :width="props.width"
      @error="foundation.handleError"
      @load="foundation.handleLoaded"
    />

    <div v-if="state.loadStatus !== 'success'" class="semi-image-overlay">
      <template v-if="state.loadStatus === 'loading'">
        <div v-if="placeholderContent" class="semi-image-status">
          <ImageNodeRenderer :content="placeholderContent" />
        </div>
        <div
          v-else
          class="semi-skeleton-image"
          :style="{ width: props.width, height: props.height }"
        />
      </template>
      <div v-else class="semi-image-status">
        <img
          v-if="typeof fallbackContent === 'string'"
          alt="fallback"
          :src="fallbackContent"
          style="width: 100%; height: 100%"
        />
        <ImageNodeRenderer v-else-if="fallbackContent" :content="fallbackContent" />
        <IconUploadError v-else size="extra-large" />
      </div>
    </div>

    <div v-if="false" class="semi-image-mask">
      <div class="semi-image-mask-info">
        <IconEyeOpened size="extra-large" />
        <span class="semi-image-mask-info-text">Preview</span>
      </div>
    </div>

    <ImagePreviewInner
      v-if="canPreview"
      v-bind="previewBindings"
      :class-name="previewOptions.previewCls"
      :cross-origin="props.crossOrigin ?? previewOptions.crossOrigin"
      :set-download-name="props.setDownloadName"
      :src="previewSource"
      :style="previewOptions.previewStyle"
      :visible="state.previewVisible"
      @visible-change="handlePreviewVisibleChange"
    />
  </div>
</template>
