<script setup lang="ts">
import { AnchorFoundation, type AnchorAdapter } from '@workspace/foundation-integration';
import {
  computed,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowReactive,
  shallowRef,
  useAttrs,
  useTemplateRef,
  watch,
  type StyleValue,
} from 'vue';

import { configContextKey, DEFAULT_CONFIG_LOCALE } from '../config-provider';

import { anchorContextKey } from './anchor-context';
import type { AnchorEmits, AnchorProps, AnchorSlots } from './types';

defineOptions({ name: 'Anchor', inheritAttrs: false });

const props = withDefaults(defineProps<AnchorProps>(), {
  autoCollapse: false,
  className: '',
  defaultAnchor: '',
  maxHeight: '750px',
  maxWidth: '200px',
  offsetTop: 0,
  railTheme: 'primary',
  scrollMotion: false,
  showTooltip: false,
  size: 'default',
  targetOffset: 0,
});
const emit = defineEmits<AnchorEmits>();
defineSlots<AnchorSlots>();

interface AnchorState {
  activeLink: string;
  clickLink: boolean;
  links: string[];
  scrollHeight: string;
  slideBarTop: string;
}

interface FoundationAnchorProps {
  children?: unknown;
  offsetTop: number;
  onChange: () => void;
  scrollMotion: boolean;
  targetOffset: number;
}

interface LinkRecord {
  href: string;
  parentHref?: string;
  token: symbol;
}

interface CancelableHandler {
  (): void;
  cancel(): void;
}

const attrs = useAttrs();
const root = useTemplateRef<HTMLElement>('root');
const linkWrapper = useTemplateRef<HTMLElement>('linkWrapper');
const injectedConfig = inject(
  configContextKey,
  computed(() => ({
    direction: 'ltr' as const,
    locale: DEFAULT_CONFIG_LOCALE,
    responsiveObserve: false,
    responsiveMap: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: '',
      xxl: '',
    },
    onBreakpoint: (() => () => undefined) as never,
    screens: { xs: false, sm: false, md: false, lg: false, xl: false, xxl: false },
  })),
);
const state = shallowReactive<AnchorState>({
  activeLink: '',
  clickLink: false,
  links: [],
  scrollHeight: '100%',
  slideBarTop: '0',
});
const childMapState = shallowRef<Record<string, ReadonlySet<string>>>({});
const linkRecords: LinkRecord[] = [];
const cache = new Map<string, unknown>();
const anchorId = shallowRef<string>();
let anchorSequence = 0;
let scrollContainer: HTMLElement | Window | undefined;
let scrollHandler: CancelableHandler | undefined;
let clickHandler: CancelableHandler | undefined;
let resizeObserver: ResizeObserver | undefined;

function createDebouncedHandler(callback: () => void, wait: number): CancelableHandler {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const handler = (() => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      callback();
    }, wait);
  }) as CancelableHandler;
  handler.cancel = () => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = undefined;
  };
  return handler;
}

function createThrottledHandler(callback: () => void, wait: number): CancelableHandler {
  let lastRun = 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const handler = (() => {
    const remaining = wait - (Date.now() - lastRun);
    if (remaining <= 0) {
      if (timeout !== undefined) clearTimeout(timeout);
      timeout = undefined;
      lastRun = Date.now();
      callback();
      return;
    }
    if (timeout !== undefined) return;
    timeout = setTimeout(() => {
      timeout = undefined;
      lastRun = Date.now();
      callback();
    }, remaining);
  }) as CancelableHandler;
  handler.cancel = () => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = undefined;
  };
  return handler;
}

function getFoundationProps(): FoundationAnchorProps {
  return {
    children: undefined,
    offsetTop: props.offsetTop,
    onChange: () => undefined,
    scrollMotion: props.scrollMotion,
    targetOffset: props.targetOffset,
  };
}

function resolveContainer(): HTMLElement | Window {
  const candidate = props.getContainer?.();
  return candidate ?? window;
}

const adapter: AnchorAdapter<FoundationAnchorProps, AnchorState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationAnchorProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof AnchorState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(String(key), value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  addLink: (href) => {
    state.links = [...state.links, href];
  },
  removeLink: (href) => {
    const index = state.links.indexOf(href);
    if (index === -1) return;
    state.links = [...state.links.slice(0, index), ...state.links.slice(index + 1)];
  },
  setChildMap: (value) => {
    childMapState.value = value;
  },
  setScrollHeight: (height) => {
    state.scrollHeight = height;
  },
  setSlideBarTop: (height) => {
    state.slideBarTop = `${height}px`;
  },
  setClickLink: (value) => {
    state.clickLink = value;
  },
  setActiveLink: (href, callback) => {
    state.activeLink = href;
    void nextTick(callback);
  },
  setClickLinkWithCallBack: (value, href, callback) => {
    state.clickLink = value;
    void nextTick(() => callback(href));
  },
  getContainer: () => scrollContainer ?? resolveContainer(),
  getContainerBoundingTop: () => {
    const container = scrollContainer ?? resolveContainer();
    return 'getBoundingClientRect' in container ? container.getBoundingClientRect().top : 0;
  },
  getLinksBoundingTop: () => {
    const containerTop = adapter.getContainerBoundingTop();
    return state.links.map((href) => {
      try {
        const node = document.querySelector(href);
        const top = node ? node.getBoundingClientRect().top - containerTop - props.offsetTop : 0;
        return top || -Infinity;
      } catch {
        return -Infinity;
      }
    });
  },
  getAnchorNode: (selector) => root.value?.querySelector<HTMLElement>(selector) ?? null,
  getContentNode: (selector) => {
    try {
      return document.querySelector<HTMLElement>(selector);
    } catch {
      return null;
    }
  },
  notifyChange: (currentLink, previousLink) => emit('change', currentLink, previousLink),
  notifyClick: (event, href) => {
    if (event) emit('click', event, href);
  },
  canSmoothScroll: () => 'scrollBehavior' in document.body.style,
};
const foundation = markRaw(new AnchorFoundation<FoundationAnchorProps, AnchorState>(adapter));

function rebuildChildMap(): void {
  const nextMap: Record<string, Set<string>> = {};
  const byHref = new Map<string, LinkRecord>();
  for (const record of linkRecords) {
    nextMap[record.href] ??= new Set();
    if (!byHref.has(record.href)) byHref.set(record.href, record);
  }
  for (const record of linkRecords) {
    let parentHref = record.parentHref;
    const visited = new Set<string>();
    while (parentHref && !visited.has(parentHref)) {
      visited.add(parentHref);
      nextMap[parentHref] ??= new Set();
      nextMap[parentHref]!.add(record.href);
      parentHref = byHref.get(parentHref)?.parentHref;
    }
  }
  childMapState.value = nextMap;
}

function addLink(token: symbol, href: string, parentHref?: string): void {
  linkRecords.push({ token, href, ...(parentHref === undefined ? {} : { parentHref }) });
  foundation.addLink(href);
  rebuildChildMap();
}

function removeLink(token: symbol, href: string): void {
  const index = linkRecords.findIndex((record) => record.token === token);
  if (index !== -1) linkRecords.splice(index, 1);
  foundation.removeLink(href);
  rebuildChildMap();
}

function handleClick(event: MouseEvent | KeyboardEvent, href: string): void {
  foundation.handleClick(event, href);
}

function handleResize(entries: ResizeObserverEntry[]): void {
  const entry = entries[0];
  if (!entry) return;
  const borderBox = Array.isArray(entry.borderBoxSize)
    ? entry.borderBoxSize[0]
    : entry.borderBoxSize;
  const visible = borderBox
    ? borderBox.blockSize !== 0 || borderBox.inlineSize !== 0
    : entry.contentRect.height !== 0 || entry.contentRect.width !== 0;
  if (visible) foundation.setScrollHeight();
}

function detachRuntime(): void {
  if (scrollContainer && scrollHandler && clickHandler) {
    scrollContainer.removeEventListener('scroll', scrollHandler);
    scrollContainer.removeEventListener('scroll', clickHandler);
  }
  scrollHandler?.cancel();
  clickHandler?.cancel();
  resizeObserver?.disconnect();
  scrollHandler = undefined;
  clickHandler = undefined;
  resizeObserver = undefined;
  scrollContainer = undefined;
}

const wrapperClasses = computed(() => [
  'semi-anchor',
  `semi-anchor-size-${props.size}`,
  props.className,
  attrs.class,
]);
const normalizeDimension = (value: string | number): string =>
  typeof value === 'number' ? `${value}px` : value;
const wrapperStyle = computed<StyleValue>(() => [
  attrs.style as StyleValue,
  props.style,
  {
    maxHeight: normalizeDimension(props.maxHeight),
    maxWidth: normalizeDimension(props.maxWidth),
  },
]);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([name]) => !['aria-label', 'class', 'style'].includes(name)),
  ),
);
const slideClasses = computed(() => ['semi-anchor-slide', `semi-anchor-slide-${props.railTheme}`]);
const slideBarClasses = computed(() => [
  'semi-anchor-slide-bar',
  `semi-anchor-slide-bar-${props.size}`,
  `semi-anchor-slide-bar-${props.railTheme}`,
  state.activeLink ? 'semi-anchor-slide-bar-active' : undefined,
]);

provide(anchorContextKey, {
  activeLink: computed(() => state.activeLink),
  autoCollapse: computed(() => props.autoCollapse),
  childMap: computed(() => childMapState.value),
  direction: computed(() => injectedConfig.value.direction),
  position: computed(() => props.position),
  showTooltip: computed(() => props.showTooltip),
  size: computed(() => props.size),
  addLink,
  removeLink,
  onClick: handleClick,
});

watch(
  () => state.links,
  () => void nextTick(() => foundation.setScrollHeight()),
);

onMounted(async () => {
  anchorSequence += 1;
  anchorId.value = `semi-anchor-${anchorSequence}`;
  scrollContainer = resolveContainer();
  scrollHandler = createThrottledHandler(() => foundation.handleScroll(), 100);
  clickHandler = createDebouncedHandler(() => foundation.handleClickLink(), 100);
  scrollContainer.addEventListener('scroll', scrollHandler);
  scrollContainer.addEventListener('scroll', clickHandler);
  await nextTick();
  foundation.setScrollHeight();
  if (typeof ResizeObserver !== 'undefined' && linkWrapper.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(linkWrapper.value);
  }
  if (props.defaultAnchor) foundation.handleClick(null, props.defaultAnchor, false);
});

onBeforeUnmount(detachRuntime);
</script>

<template>
  <div
    v-bind="rootAttrs"
    :id="anchorId"
    ref="root"
    role="navigation"
    :aria-label="(attrs['aria-label'] as string | undefined) || 'Side navigation'"
    :class="wrapperClasses"
    :style="wrapperStyle"
  >
    <div aria-hidden="true" :class="slideClasses" :style="{ height: state.scrollHeight }">
      <span :class="slideBarClasses" :style="{ top: state.slideBarTop }" />
    </div>
    <div ref="linkWrapper" class="semi-anchor-link-wrapper" role="list">
      <slot />
    </div>
  </div>
</template>
