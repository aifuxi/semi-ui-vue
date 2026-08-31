<script setup lang="ts">
import {
  JsonViewerFoundation,
  jsonViewerCssClasses,
  type JsonViewerAdapter,
  type JsonViewerFoundationProps,
  type JsonViewerFoundationState,
  type JsonViewerOptions as FoundationJsonViewerOptions,
} from '@workspace/foundation-integration';
import {
  Fragment,
  type Component,
  computed,
  h,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  render,
  shallowReactive,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type VNodeChild,
} from 'vue';

import { configContextKey, DEFAULT_CONFIG_LOCALE } from '../config-provider';
import JsonViewerSearchOverlay from './JsonViewerSearchOverlay';
import type {
  JsonViewerEmits,
  JsonViewerExposed,
  JsonViewerLocale,
  JsonViewerProps,
  JsonViewerSearchControls,
  JsonViewerSearchOptions,
  JsonViewerSlots,
} from './types';

defineOptions({ name: 'JsonViewer', inheritAttrs: false });
const props = withDefaults(defineProps<JsonViewerProps>(), {
  value: '',
  width: 400,
  height: 400,
  showSearch: true,
  options: () => ({ readOnly: false, autoWrap: true }),
  limitSearchButtonBounds: false,
});
const emit = defineEmits<JsonViewerEmits>();
defineSlots<JsonViewerSlots>();

const attrs = useAttrs();
const slots = useSlots();
const editorRef = useTemplateRef<HTMLDivElement>('editor');
const rootRef = useTemplateRef<HTMLDivElement>('root');
const injectedConfig = inject(configContextKey, null);
const prefixCls = jsonViewerCssClasses.PREFIX;
const cache = new Map<unknown, unknown>();
const mountedCustomRenderTargets = new Set<HTMLElement>();

const state = shallowReactive<JsonViewerFoundationState>({
  searchOptions: { caseSensitive: false, wholeWord: false, regex: false },
  showSearchBar: false,
  customRenderMap: markRaw(new Map()),
});

const locale = computed<JsonViewerLocale>(() => {
  const source = (injectedConfig?.value.locale?.JsonViewer ??
    DEFAULT_CONFIG_LOCALE.JsonViewer ??
    {}) as Partial<JsonViewerLocale>;
  return {
    search: source.search ?? '查找',
    replace: source.replace ?? '替换',
    replaceAll: source.replaceAll ?? '全部替换',
  };
});
const dimension = (value: number | string): string =>
  typeof value === 'number' ? `${value}px` : value;
const dimensions = computed(() => ({
  width: dimension(props.width),
  height: dimension(props.height),
}));
const rootClasses = computed(() => [props.class, props.className, attrs.class]);
const rootStyle = computed(() => [
  dimensions.value,
  { position: 'relative' as const },
  props.style,
  attrs.style,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const foundationOptions = computed(
  () => props.options as FoundationJsonViewerOptions<VNodeChild | HTMLElement>,
);

type FoundationProps = JsonViewerFoundationProps<VNodeChild | HTMLElement>;

function foundationProps(): FoundationProps {
  return { value: props.value, options: foundationOptions.value };
}

function searchInput(): HTMLInputElement {
  return rootRef.value?.querySelector<HTMLInputElement>(
    `.${prefixCls}-search-bar-input input`,
  ) as HTMLInputElement;
}

function clearCustomRenders(): void {
  for (const target of mountedCustomRenderTargets) render(null, target);
  mountedCustomRenderTargets.clear();
}

function mountCustomRenders(customRenderMap: Map<HTMLElement, unknown>): void {
  clearCustomRenders();
  for (const [target, content] of customRenderMap) {
    const node = h(Fragment as unknown as Component, null, [content as VNodeChild]);
    render(node, target);
    mountedCustomRenderTargets.add(target);
  }
  state.customRenderMap = markRaw(customRenderMap);
}

function setSearchOption(key: string): void {
  if (!['caseSensitive', 'wholeWord', 'regex'].includes(key)) return;
  const typedKey = key as keyof JsonViewerSearchOptions;
  state.searchOptions = { ...state.searchOptions, [typedKey]: !state.searchOptions[typedKey] };
  searchCurrentInput();
}

function toggleSearchBar(): void {
  state.showSearchBar = !state.showSearchBar;
  state.searchOptions = { caseSensitive: false, wholeWord: false, regex: false };
}

const adapter: JsonViewerAdapter<FoundationProps, JsonViewerFoundationState> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps()[key],
  getProps: foundationProps,
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
  getEditorRef: () => editorRef.value as HTMLDivElement,
  getSearchRef: searchInput,
  notifyChange: (value) => {
    emit('change', value);
    emit('update:value', value);
  },
  notifyHover: (value, element) => props.renderTooltip?.(value, element),
  notifyCustomRender: mountCustomRenders,
  setSearchOptions: setSearchOption,
  showSearchBar: toggleSearchBar,
};
const foundation = markRaw(new JsonViewerFoundation(adapter));

let resizeObserver: ResizeObserver | null = null;
let resizeRafId: number | null = null;
let lastObservedWidth: number | null = null;
let initialized = false;

function teardownResizeObserver(): void {
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
  resizeRafId = null;
  lastObservedWidth = null;
}

function setupResizeObserver(): void {
  teardownResizeObserver();
  if (
    !foundationOptions.value.autoWrap ||
    !editorRef.value ||
    typeof ResizeObserver === 'undefined'
  ) {
    return;
  }
  lastObservedWidth = editorRef.value.getBoundingClientRect().width;
  resizeObserver = new ResizeObserver(([entry]) => {
    const nextWidth = entry?.contentRect.width;
    if (typeof nextWidth !== 'number') return;
    if (lastObservedWidth !== null && Math.abs(nextWidth - lastObservedWidth) < 0.5) return;
    lastObservedWidth = nextWidth;
    if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = null;
      foundation.jsonViewer?.layout();
    });
  });
  resizeObserver.observe(editorRef.value);
}

function disposeCore(): void {
  teardownResizeObserver();
  clearCustomRenders();
  foundation.jsonViewer?.dispose();
  foundation.jsonViewer = null;
  initialized = false;
}

function initializeCore(): void {
  if (!editorRef.value) return;
  foundation.init();
  initialized = true;
  setupResizeObserver();
}

function reinitializeCore(): void {
  if (!initialized) return;
  disposeCore();
  void nextTick(initializeCore);
}

function searchCurrentInput(): void {
  foundation.search(searchInput()?.value ?? '');
}

const searchControls = computed<JsonViewerSearchControls>(() => ({
  showSearchBar: state.showSearchBar,
  onToggleSearchBar: () => foundation.showSearchBar(),
  onSearch: (text, caseSensitive, wholeWord, regex) =>
    foundation.search(text, caseSensitive, wholeWord, regex),
  onPrevSearch: () => foundation.prevSearch(),
  onNextSearch: () => foundation.nextSearch(),
  onReplace: (text) => foundation.replace(text),
  onReplaceAll: (text) => foundation.replaceAll(text),
}));
const customSearchRenderer = computed(() => {
  if (props.renderSearchButton) return props.renderSearchButton;
  if (!slots.searchButton) return undefined;
  return (defaultSearchButton: VNodeChild, controls: JsonViewerSearchControls) =>
    slots.searchButton?.({ defaultSearchButton, controls });
});

function getValue(): string {
  return foundation.jsonViewer?.getModel().getValue() ?? props.value;
}
function format(): void {
  foundation.jsonViewer?.format();
}
function search(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean): void {
  foundation.search(text, caseSensitive, wholeWord, regex);
}
function getSearchResults() {
  return foundation.getSearchResults();
}
function prevSearch(step?: number): void {
  foundation.prevSearch(step);
}
function nextSearch(step?: number): void {
  foundation.nextSearch(step);
}
function replace(text: string): void {
  foundation.replace(text);
}
function replaceAll(text: string): void {
  foundation.replaceAll(text);
}

defineExpose<JsonViewerExposed>({
  getValue,
  format,
  search,
  getSearchResults,
  prevSearch,
  nextSearch,
  replace,
  replaceAll,
});

watch(() => props.value, reinitializeCore);
watch(() => props.options, reinitializeCore, { deep: true });

onMounted(initializeCore);
onBeforeUnmount(() => {
  disposeCore();
  cache.clear();
});
</script>

<template>
  <div ref="root" v-bind="dataAttrs" :class="rootClasses" :style="rootStyle">
    <div ref="editor" :class="[prefixCls, `${prefixCls}-background`]" :style="dimensions" />
    <JsonViewerSearchOverlay
      v-if="props.showSearch"
      :controls="searchControls"
      :limit-bounds="props.limitSearchButtonBounds"
      :locale="locale"
      :options="state.searchOptions"
      :read-only="Boolean(foundationOptions.readOnly)"
      :render-search-button="customSearchRenderer"
      :width="props.width"
      @option="setSearchOption"
      @search="search"
    />
  </div>
</template>
