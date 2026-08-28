<script setup lang="ts">
import {
  ImagePreviewInnerFoundation,
  type ImagePreviewInnerAdapter,
} from '@workspace/foundation-integration';
import { IconArrowLeft, IconArrowRight } from '@workspace/icons';
import {
  computed,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useSlots,
  useTemplateRef,
  watch,
  type ComponentPublicInstance,
  type VNodeChild,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import ImageNodeRenderer from './ImageNodeRenderer';
import ImagePreviewFooter from './ImagePreviewFooter.vue';
import ImagePreviewHeader from './ImagePreviewHeader.vue';
import ImagePreviewImage from './ImagePreviewImage.vue';
import { imagePreviewContextKey } from './image-context';
import type {
  ImageLocale,
  ImagePreviewEmits,
  ImagePreviewInnerState,
  ImagePreviewProps,
  ImagePreviewSlots,
} from './types';

const ZH_CN_LOCALE: Readonly<ImageLocale> = Object.freeze({
  adaptiveTip: '适应页面',
  downloadTip: '下载',
  loadError: '加载失败',
  loading: '加载中',
  nextTip: '下一张',
  originTip: '原始尺寸',
  prevTip: '上一张',
  preview: '预览',
  rotateTip: '旋转',
  zoomInTip: '放大',
  zoomOutTip: '缩小',
});
const EN_US_LOCALE: Readonly<ImageLocale> = Object.freeze({
  adaptiveTip: 'Adapt to the page',
  downloadTip: 'Download',
  loadError: 'Failed to load',
  loading: 'Loading',
  nextTip: 'Next',
  originTip: 'Original size',
  prevTip: 'Previous',
  preview: 'Preview',
  rotateTip: 'Rotate',
  zoomInTip: 'Zoom in',
  zoomOutTip: 'Zoom out',
});

defineOptions({ name: 'ImagePreviewInner', inheritAttrs: false });
const props = withDefaults(defineProps<ImagePreviewProps>(), {
  closable: true,
  closeOnEsc: true,
  disableDownload: false,
  infinite: false,
  lazyLoad: false,
  maskClosable: true,
  maxZoom: 5,
  minZoom: 0.1,
  preLoad: true,
  preLoadGap: 2,
  showTooltip: false,
  viewerVisibleDelay: 10000,
  zIndex: 1070,
  zoomStep: 0.1,
});
const emit = defineEmits<ImagePreviewEmits>();
defineSlots<ImagePreviewSlots>();
const slots = useSlots();
const group = inject(imagePreviewContextKey, undefined);
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);
const locale = computed<ImageLocale>(() => {
  const fallback = config.value.locale.code === 'en-US' ? EN_US_LOCALE : ZH_CN_LOCALE;
  return {
    ...fallback,
    ...((config.value.locale.Image as Partial<ImageLocale> | undefined) ?? {}),
  };
});

const state = shallowReactive<ImagePreviewInnerState>({
  currentIndex: props.currentIndex ?? 0,
  direction: '',
  imgLoadStatus: {},
  imgSrc: [],
  preloadAfterVisibleChange: true,
  ratio: 'adaptation',
  rotation: 0,
  viewerVisible: true,
  visible: props.visible ?? false,
  zoom: 0.1,
});
const cache = new Map<unknown, unknown>();
const portalTarget = shallowRef<HTMLElement | null>(null);
const imageWrap = useTemplateRef<HTMLDivElement>('imageWrap');
const header = useTemplateRef<ComponentPublicInstance<{ element: HTMLElement | null }>>('header');
const footer = useTemplateRef<ComponentPublicInstance<{ element: HTMLElement | null }>>('footer');
const leftIcon = useTemplateRef<HTMLDivElement>('leftIcon');
const rightIcon = useTemplateRef<HTMLDivElement>('rightIcon');
const previewImage =
  useTemplateRef<
    ComponentPublicInstance<{ changeZoom: (zoom: number, event?: WheelEvent) => void }>
  >('previewImage');
let bodyOverflow = '';
let originBodyWidth = '';
let scrollBarWidth = 0;
let shown = false;

type RuntimeProps = ImagePreviewProps & {
  currentIndex?: number;
  src?: string | string[];
};
function runtimeProps(): RuntimeProps {
  const value = { ...props } as RuntimeProps;
  if (props.currentIndex === undefined) delete value.currentIndex;
  return value;
}

function elementFromComponent(
  value: ComponentPublicInstance<{ element: HTMLElement | null }> | null,
): HTMLElement | null {
  return value?.element ?? null;
}

const adapter: ImagePreviewInnerAdapter<RuntimeProps, ImagePreviewInnerState> = {
  getContext: (key) => (key === 'setCurrentIndex' ? group?.setCurrentIndex : undefined),
  getContexts: () => ({ setCurrentIndex: group?.setCurrentIndex }),
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
  disabledBodyScroll: () => {
    if (typeof document === 'undefined') return;
    const customContainer = props.getPopupContainer ?? config.value.getPopupContainer;
    bodyOverflow = document.body.style.overflow || '';
    if (!customContainer && bodyOverflow !== 'hidden') {
      document.body.style.overflow = 'hidden';
      document.body.style.width = `calc(${originBodyWidth || '100%'} - ${scrollBarWidth}px)`;
    }
  },
  enabledBodyScroll: () => {
    if (typeof document === 'undefined') return;
    const customContainer = props.getPopupContainer ?? config.value.getPopupContainer;
    if (!customContainer && bodyOverflow !== 'hidden') {
      document.body.style.overflow = bodyOverflow;
      document.body.style.width = originBodyWidth;
    }
  },
  notifyChange: (index, direction) => {
    emit('change', index);
    emit('update:currentIndex', index);
    if (direction === 'prev') emit('prev', index);
    else emit('next', index);
  },
  notifyZoom: (zoom, increase) => {
    if (increase) emit('zoomIn', zoom);
    else emit('zoomOut', zoom);
  },
  notifyClose: () => emit('close'),
  notifyVisibleChange: (visible) => {
    emit('visibleChange', visible);
    emit('update:visible', visible);
  },
  notifyRatioChange: (type) => emit('ratioChange', type),
  notifyRotateChange: (angle) => emit('rotateLeft', angle),
  notifyDownload: (src, index) => emit('download', src, index),
  notifyDownloadError: (src) => emit('downloadError', src),
  registerKeyDownListener: () => window.addEventListener('keydown', foundation.handleKeyDown),
  unregisterKeyDownListener: () => window.removeEventListener('keydown', foundation.handleKeyDown),
  getSetDownloadFunc: () => group?.setDownloadName.value ?? props.setDownloadName,
  isValidTarget: (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return true;
    return ![
      elementFromComponent(header.value),
      elementFromComponent(footer.value),
      leftIcon.value,
      rightIcon.value,
    ].some((element) => element?.contains(target));
  },
  changeImageZoom: (zoom, event) => previewImage.value?.changeZoom(zoom, event),
};
const foundation = markRaw(
  new ImagePreviewInnerFoundation<RuntimeProps, ImagePreviewInnerState>(adapter),
);

const sources = computed(() => {
  if (!state.visible) return [];
  if (Array.isArray(props.src)) return props.src;
  return props.src ? [props.src] : [];
});
const total = computed(() => state.imgSrc.length);
const showPrev = computed(() => total.value !== 1 && (props.infinite || state.currentIndex !== 0));
const showNext = computed(
  () => total.value !== 1 && (props.infinite || state.currentIndex !== total.value - 1),
);
const hideViewerClass = computed(() =>
  state.viewerVisible ? undefined : 'semi-image-preview-hide',
);
const previewClasses = computed(() => [
  'semi-image-preview',
  !state.visible ? 'semi-image-hide' : undefined,
  props.getPopupContainer || config.value.getPopupContainer
    ? 'semi-image-preview-popup'
    : undefined,
  props.class,
  props.className,
]);
const portalStyle = computed(() => ({
  position:
    props.getPopupContainer || config.value.getPopupContainer ? ('static' as const) : undefined,
  zIndex: props.zIndex,
}));
const title = computed<VNodeChild>(() =>
  group && typeof state.currentIndex === 'number'
    ? (group.titles.value[state.currentIndex] as VNodeChild)
    : props.previewTitle,
);
const leftContent = computed(
  () =>
    slots.leftIcon?.({ index: state.currentIndex }) ??
    (typeof props.renderLeftIcon === 'function'
      ? props.renderLeftIcon(state.currentIndex)
      : props.renderLeftIcon),
);
const rightContent = computed(
  () =>
    slots.rightIcon?.({ index: state.currentIndex }) ??
    (typeof props.renderRightIcon === 'function'
      ? props.renderRightIcon(state.currentIndex)
      : props.renderRightIcon),
);

function resolvePortalTarget(): void {
  const getContainer = props.getPopupContainer ?? config.value.getPopupContainer;
  portalTarget.value = getContainer?.() ?? document.body;
}

function handleWheel(event: WheelEvent): void {
  foundation.handleWheel(event);
}

watch(
  sources,
  (value) => {
    state.imgSrc = value;
  },
  { immediate: true },
);
watch(
  () => props.currentIndex,
  (index) => {
    if (index !== undefined && index !== state.currentIndex) {
      state.currentIndex = index;
      state.ratio = 'adaptation';
    }
  },
);
watch(
  () => props.visible,
  async (visible, previous) => {
    state.visible = Boolean(visible);
    if (visible) {
      state.preloadAfterVisibleChange = true;
      state.viewerVisible = true;
      state.rotation = 0;
      state.ratio = 'adaptation';
      if (typeof document !== 'undefined') resolvePortalTarget();
    }
    if (!shown) return;
    await nextTick();
    if (!previous && visible) foundation.beforeShow();
    if (previous && !visible) foundation.afterHide();
  },
);
watch(imageWrap, (element, previous) => {
  previous?.removeEventListener('wheel', handleWheel);
  element?.addEventListener('wheel', handleWheel, { passive: false });
});

onMounted(() => {
  shown = true;
  const documentWidth = document.documentElement.clientWidth;
  scrollBarWidth = Math.max(0, window.innerWidth - documentWidth);
  originBodyWidth = document.body.style.width;
  if (props.visible) {
    resolvePortalTarget();
    foundation.beforeShow();
  }
});
onBeforeUnmount(() => {
  imageWrap.value?.removeEventListener('wheel', handleWheel);
  if (state.visible) foundation.afterHide();
  foundation.clearTimer();
  foundation.destroy();
});
</script>

<template>
  <Teleport v-if="state.visible && portalTarget" :to="portalTarget">
    <div
      :class="['semi-portal', config.direction === 'rtl' ? 'semi-portal-rtl' : undefined]"
      :style="portalStyle"
    >
      <div
        ref="imageWrap"
        :class="previewClasses"
        :style="props.previewStyle ?? props.style"
        @mousedown="foundation.handleMouseDown"
        @mousemove="foundation.handleMouseMove"
        @mouseup="foundation.handleMouseUp"
      >
        <ImagePreviewHeader
          ref="header"
          :class-name="hideViewerClass"
          :closable="props.closable"
          :render-close-icon="props.renderCloseIcon"
          :render-header="props.renderHeader"
          :title="title"
          @close="foundation.handlePreviewClose"
        >
          <template v-if="slots.header" #header="slotProps"
            ><slot name="header" v-bind="slotProps"
          /></template>
          <template v-if="slots.closeIcon" #closeIcon><slot name="closeIcon" /></template>
        </ImagePreviewHeader>

        <ImagePreviewImage
          ref="previewImage"
          :cross-origin="props.crossOrigin"
          :disable-download="props.disableDownload"
          :initial-zoom="props.initialZoom"
          :max-zoom="props.maxZoom"
          :min-zoom="props.minZoom"
          :ratio="state.ratio"
          :rotation="state.rotation"
          :src="state.imgSrc[state.currentIndex]"
          :zoom="state.zoom"
          @error="foundation.preloadSingleImage"
          @load="foundation.onImageLoad"
          @ratio="foundation.handleAdjustRatio"
          @zoom="foundation.handleZoomImage"
        />

        <div
          v-if="showPrev"
          ref="leftIcon"
          :class="['semi-image-preview-icon', 'semi-image-preview-prev', hideViewerClass]"
          @click="foundation.handleSwitchImage('prev')"
        >
          <ImageNodeRenderer v-if="leftContent" :content="leftContent" />
          <IconArrowLeft v-else size="large" />
        </div>
        <div
          v-if="showNext"
          ref="rightIcon"
          :class="['semi-image-preview-icon', 'semi-image-preview-next', hideViewerClass]"
          @click="foundation.handleSwitchImage('next')"
        >
          <ImageNodeRenderer v-if="rightContent" :content="rightContent" />
          <IconArrowRight v-else size="large" />
        </div>

        <ImagePreviewFooter
          ref="footer"
          :adaptive-tip="props.adaptiveTip"
          :class-name="hideViewerClass"
          :cur-page="state.currentIndex + 1"
          :disable-download="props.disableDownload"
          :disabled-next="!showNext"
          :disabled-prev="!showPrev"
          :download-tip="props.downloadTip"
          :locale="locale"
          :max="props.maxZoom * 100"
          :min="props.minZoom * 100"
          :next-tip="props.nextTip"
          :on-adjust-ratio="foundation.handleAdjustRatio"
          :on-download="foundation.handleDownload"
          :on-next="() => foundation.handleSwitchImage('next')"
          :on-prev="() => foundation.handleSwitchImage('prev')"
          :on-rotate="foundation.handleRotateImage"
          :on-zoom="foundation.handleZoomImage"
          :origin-tip="props.originTip"
          :prev-tip="props.prevTip"
          :ratio="state.ratio"
          :render-preview-menu="props.renderPreviewMenu"
          :rotate-tip="props.rotateTip"
          :show-tooltip="props.showTooltip"
          :step="props.zoomStep * 100"
          :total-num="total"
          :z-index="props.zIndex"
          :zoom="state.zoom * 100"
          :zoom-in-tip="props.zoomInTip"
          :zoom-out-tip="props.zoomOutTip"
        >
          <template v-if="slots.previewMenu" #previewMenu="menuProps">
            <slot name="previewMenu" v-bind="menuProps" />
          </template>
        </ImagePreviewFooter>
      </div>
    </div>
  </Teleport>
</template>
