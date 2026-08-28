<script setup lang="ts">
import { ImagePreviewFoundation } from '@workspace/foundation-integration';
import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  computed,
  getCurrentInstance,
  isVNode,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  shallowReactive,
  useAttrs,
  useSlots,
  watch,
  type ComponentPublicInstance,
  type VNode,
  type VNodeChild,
} from 'vue';

import Image from './Image.vue';
import ImageNodeRenderer from './ImageNodeRenderer';
import ImagePreviewInner from './ImagePreviewInner.vue';
import { imagePreviewContextKey } from './image-context';
import type {
  ImagePreviewEmits,
  ImagePreviewProps,
  ImagePreviewSlots,
  ImagePreviewState,
} from './types';

defineOptions({ name: 'ImagePreview', inheritAttrs: false });
const props = withDefaults(defineProps<ImagePreviewProps>(), {
  closable: true,
  closeOnEsc: true,
  disableDownload: false,
  infinite: false,
  lazyLoad: true,
  lazyLoadMargin: '0px 100px 100px 0px',
  maskClosable: true,
  maxZoom: 5,
  minZoom: 0.1,
  preLoad: true,
  preLoadGap: 2,
  showTooltip: false,
  src: () => [],
  viewerVisibleDelay: 10000,
  zIndex: 1070,
  zoomStep: 0.1,
});
const emit = defineEmits<ImagePreviewEmits>();
defineSlots<ImagePreviewSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

const state = shallowReactive<ImagePreviewState>({
  currentIndex: props.currentIndex ?? props.defaultCurrentIndex ?? 0,
  visible: hasRawProp('visible') ? Boolean(props.visible) : Boolean(props.defaultVisible),
});
const cache = new Map<unknown, unknown>();

type RuntimePreviewProps = ImagePreviewProps & {
  onChange?: ((index: number) => void) | undefined;
  onVisibleChange?: ((visible: boolean) => void) | undefined;
};

function runtimeProps(): RuntimePreviewProps {
  const output = { ...props } as RuntimePreviewProps;
  if (!hasRawProp('currentIndex')) delete output.currentIndex;
  if (!hasRawProp('visible')) delete output.visible;
  return Object.assign(output, {
    onChange: (index: number) => {
      emit('change', index);
      emit('update:currentIndex', index);
    },
    onVisibleChange: (visible: boolean) => {
      emit('visibleChange', visible);
      emit('update:visible', visible);
    },
  });
}

const foundation = markRaw(
  new ImagePreviewFoundation({
    getContext: () => undefined,
    getContexts: () => ({}),
    getProp: (key: keyof ReturnType<typeof runtimeProps>) => runtimeProps()[key],
    getProps: runtimeProps,
    getState: (key: keyof ImagePreviewState) => state[key],
    getStates: () => state,
    setState: (nextState: Partial<ImagePreviewState>, callback?: () => void) => {
      const derived = { ...nextState };
      if (hasRawProp('visible')) delete derived.visible;
      if (hasRawProp('currentIndex')) delete derived.currentIndex;
      Object.assign(state, derived);
      callback?.();
    },
    getCache: (key: string) => cache.get(key),
    getCaches: () => cache,
    setCache: (key: unknown, value: unknown) => cache.set(key, value),
    stopPropagation: (event?: { stopPropagation?: () => void }) => event?.stopPropagation?.(),
    persistEvent: () => undefined,
  }),
);

interface ParsedChildren {
  nodes: VNodeChild[];
  sources: string[];
  titles: VNodeChild[];
}

function isRenderable(node: VNodeChild): node is VNode {
  if (!isVNode(node) || node.type === Comment) return false;
  return !(node.type === Text && String(node.children ?? '').trim() === '');
}

function previewEnabled(node: VNode): boolean {
  if (!node.props || !Object.prototype.hasOwnProperty.call(node.props, 'preview')) return true;
  return node.props['preview'] !== false;
}

function parseNodes(input: VNodeChild[], parsed: ParsedChildren): VNodeChild[] {
  const output: VNodeChild[] = [];
  for (const child of input) {
    if (Array.isArray(child)) {
      output.push(...parseNodes(child, parsed));
      continue;
    }
    if (!isRenderable(child)) continue;
    if (child.type === Fragment && Array.isArray(child.children)) {
      output.push(...parseNodes(child.children as VNodeChild[], parsed));
      continue;
    }
    if (child.type === Image) {
      if (!previewEnabled(child)) {
        output.push(child);
        continue;
      }
      const preview = child.props?.['preview'];
      const source =
        preview && typeof preview === 'object' && 'src' in preview
          ? String(preview.src ?? child.props?.['src'] ?? '')
          : String(child.props?.['src'] ?? '');
      const title =
        preview && typeof preview === 'object' && 'previewTitle' in preview
          ? (preview.previewTitle as VNodeChild)
          : undefined;
      const imageID = parsed.sources.length;
      parsed.sources.push(source);
      parsed.titles.push(title);
      output.push(cloneVNode(child, { imageID }));
      continue;
    }
    if (Array.isArray(child.children)) {
      const cloned = cloneVNode(child);
      cloned.children = parseNodes(child.children as VNodeChild[], parsed) as VNode['children'];
      output.push(cloned);
      continue;
    }
    output.push(child);
  }
  return output;
}

const parsed = computed<ParsedChildren>(() => {
  const result: ParsedChildren = { nodes: [], sources: [], titles: [] };
  result.nodes = parseNodes((slots.default?.() ?? []) as VNodeChild[], result);
  return result;
});
const explicitSources = computed(() =>
  Array.isArray(props.src) ? props.src : typeof props.src === 'string' ? [props.src] : [],
);
const finalSources = computed(() => [...explicitSources.value, ...parsed.value.sources]);
const groupRoot = { value: null as HTMLDivElement | null };
let previewObserver: IntersectionObserver | undefined;

function setGroupRoot(element: Element | ComponentPublicInstance | null): void {
  groupRoot.value = element instanceof HTMLDivElement ? element : null;
}

function disconnectObserver(): void {
  previewObserver?.disconnect();
  previewObserver = undefined;
}

function observeImages(): void {
  disconnectObserver();
  if (!props.lazyLoad || !groupRoot.value) return;
  const images = groupRoot.value.querySelectorAll<HTMLImageElement>('.semi-image-img[data-src]');
  if (typeof IntersectionObserver === 'undefined') {
    images.forEach((image) => {
      image.src = image.dataset['src'] ?? '';
      image.removeAttribute('data-src');
    });
    return;
  }
  previewObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const image = entry.target;
        if (!(image instanceof HTMLImageElement) || !entry.isIntersecting) continue;
        const source = image.dataset['src'];
        if (source) image.src = source;
        image.removeAttribute('data-src');
        previewObserver?.unobserve(image);
      }
    },
    { root: groupRoot.value, rootMargin: props.lazyLoadMargin },
  );
  images.forEach((image) => previewObserver?.observe(image));
}

provide(imagePreviewContextKey, {
  currentIndex: computed(() => state.currentIndex),
  handleVisibleChange: (visible) => foundation.handleVisibleChange(visible),
  isGroup: true,
  lazyLoad: computed(() => props.lazyLoad),
  previewSrc: finalSources,
  setCurrentIndex: (index) => foundation.handleCurrentIndexChange(index),
  setDownloadName: computed(() => props.setDownloadName),
  titles: computed(() => parsed.value.titles),
  visible: computed(() => state.visible),
});

watch(
  () => props.currentIndex,
  (index) => {
    if (hasRawProp('currentIndex') && index !== undefined) state.currentIndex = index;
  },
);
watch(
  () => props.visible,
  (visible) => {
    if (hasRawProp('visible') && visible !== undefined) state.visible = visible;
  },
);

onMounted(() => void nextTick(observeImages));
onUpdated(() => void nextTick(observeImages));
onBeforeUnmount(() => {
  disconnectObserver();
  foundation.destroy();
});
</script>

<template>
  <div
    :ref="setGroupRoot"
    v-bind="attrs"
    :class="['semi-image-preview-group', props.class, props.className, attrs.class]"
    :style="[props.style, attrs.style]"
  >
    <ImageNodeRenderer :content="parsed.nodes" />
  </div>

  <ImagePreviewInner
    v-bind="props"
    :class="props.previewCls"
    :current-index="state.currentIndex"
    :src="finalSources"
    :style="props.previewStyle"
    :visible="state.visible"
    @change="foundation.handleCurrentIndexChange"
    @close="emit('close')"
    @download="(src, index) => emit('download', src, index)"
    @download-error="(src) => emit('downloadError', src)"
    @next="(index) => emit('next', index)"
    @prev="(index) => emit('prev', index)"
    @ratio-change="(type) => emit('ratioChange', type)"
    @rotate-left="(angle) => emit('rotateLeft', angle)"
    @visible-change="foundation.handleVisibleChange"
    @zoom-in="(zoom) => emit('zoomIn', zoom)"
    @zoom-out="(zoom) => emit('zoomOut', zoom)"
  >
    <template v-if="slots.header" #header="slotProps"
      ><slot name="header" v-bind="slotProps"
    /></template>
    <template v-if="slots.previewMenu" #previewMenu="menuProps"
      ><slot name="previewMenu" v-bind="menuProps"
    /></template>
    <template v-if="slots.leftIcon" #leftIcon="slotProps"
      ><slot name="leftIcon" v-bind="slotProps"
    /></template>
    <template v-if="slots.rightIcon" #rightIcon="slotProps"
      ><slot name="rightIcon" v-bind="slotProps"
    /></template>
    <template v-if="slots.closeIcon" #closeIcon><slot name="closeIcon" /></template>
  </ImagePreviewInner>
</template>
