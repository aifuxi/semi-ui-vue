<script setup lang="ts" generic="Item extends ScrollItemData = ScrollItemData">
import {
  animatedScrollTo,
  ScrollItemFoundation,
  scrollListCssClasses,
  scrollListNumbers,
  type ScrollAnimation,
  type ScrollItemAdapter,
} from '@workspace/foundation-integration';
import {
  computed,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  useTemplateRef,
  watch,
} from 'vue';

import type {
  ScrollItemData,
  ScrollItemEmits,
  ScrollItemExposed,
  ScrollItemProps,
  ScrollItemSelectData,
} from './types';

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ScrollItemProps<Item>>(), {
  cycled: false,
  list: () => [],
  mode: 'wheel',
  motion: true,
  selectedIndex: 0,
});
const emit = defineEmits<ScrollItemEmits<Item>>();

interface ScrollItemState {
  appendCount: number;
  prependCount: number;
}

type RuntimeScrollItemProps = typeof props;

interface RenderedEntry {
  item: Item;
  key: string;
  sourceIndex: number;
}

const wrapper = useTemplateRef<HTMLDivElement>('wrapper');
const listElement = useTemplateRef<HTMLUListElement>('list');
const selector = useTemplateRef<HTMLDivElement>('selector');
const state = shallowReactive<ScrollItemState>({ appendCount: 0, prependCount: 0 });
const cache = new Map<unknown, unknown>();
let selectedNode: HTMLElement | null = null;
let willSelectNode: HTMLElement | null = null;
let scrollAnimation: ScrollAnimation | null = null;
let adjustFrame: number | undefined;
let selectTimer: ReturnType<typeof setTimeout> | undefined;

const runtimeProps = (): RuntimeScrollItemProps => ({
  ...props,
  cycled: props.cycled,
  list: props.list,
  mode: props.mode,
  motion: props.motion,
  selectedIndex: props.selectedIndex,
});

function isDisabledData(data: Item | undefined): boolean {
  return Boolean(data && typeof data === 'object' && data.disabled);
}

function isDisabledIndex(index: number): boolean {
  if (props.list.length === 0 || index < 0) return false;
  return isDisabledData(props.list[index % props.list.length]);
}

function cacheWillSelectNode(node: HTMLElement | null): void {
  if (node) willSelectNode = node;
}

const adapter: ScrollItemAdapter<RuntimeScrollItemProps, ScrollItemState, Item> = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => runtimeProps()[key],
  getProps: runtimeProps,
  getState: (key) => state[key],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    if (callback) void nextTick(callback);
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event?.stopPropagation?.(),
  persistEvent: () => undefined,
  setPrependCount: (prependCount) => {
    state.prependCount = prependCount;
  },
  setAppendCount: (appendCount) => {
    state.appendCount = appendCount;
  },
  isDisabledIndex,
  setSelectedNode: cacheWillSelectNode,
  notifySelectItem: (data) => emit('select', data as ScrollItemSelectData<Item>),
  scrollToCenter: (node, scrollWrapper, duration) =>
    scrollToCenter(node as HTMLElement, scrollWrapper as HTMLElement | undefined, duration),
};
const foundation = markRaw(
  new ScrollItemFoundation<RuntimeScrollItemProps, ScrollItemState, Item>(adapter),
);

const renderedEntries = computed<RenderedEntry[]>(() => {
  const makeEntries = (prefix: string) =>
    props.list.map((item, sourceIndex) => ({ item, key: `${prefix}${sourceIndex}`, sourceIndex }));
  const entries: RenderedEntry[] = [];
  for (let copy = state.prependCount - 1; copy >= 0; copy -= 1) {
    entries.push(...makeEntries(`pre_${copy}_`));
  }
  entries.push(...makeEntries(''));
  for (let copy = 0; copy < state.appendCount; copy += 1) {
    entries.push(...makeEntries(`app_${copy}_`));
  }
  return entries;
});

function displayText(item: Item, sourceIndex: number): unknown {
  const baseText = item.text == null ? item.value : item.text;
  if (sourceIndex !== props.selectedIndex) return baseText;
  const transform = typeof item.transform === 'function' ? item.transform : props.transform;
  return typeof transform === 'function' ? transform(item.value, item.text ?? '') : baseText;
}

function indexIsSame(index1: number, index2: number): boolean | undefined {
  return props.list.length > 0
    ? index1 % props.list.length === index2 % props.list.length
    : undefined;
}

function getIndexByNode(node: Element | null): number {
  return node && listElement.value ? [...listElement.value.children].indexOf(node) : -1;
}

function getNodeByIndex(index: number): HTMLElement | null {
  if (!listElement.value) return null;
  if (index > -1) return (listElement.value.children[index] as HTMLElement | undefined) ?? null;
  return (
    ([...listElement.value.children].find((_, childIndex) => !isDisabledIndex(childIndex)) as
      HTMLElement | undefined) ?? null
  );
}

function getNodeByOffset(
  referenceNode: HTMLElement | null,
  offset: number,
  listWrapper: HTMLUListElement | null,
): HTMLElement | null {
  if (!referenceNode || !listWrapper || props.list.length === 0) return referenceNode;
  const normalizedOffset = offset % props.list.length;
  let targetIndex = getIndexByNode(referenceNode) + normalizedOffset;
  while (targetIndex < 0) targetIndex += props.list.length;
  return normalizedOffset ? getNodeByIndex(targetIndex) : referenceNode;
}

function addClassToNode(
  node: HTMLElement | null,
  selectedClass = scrollListCssClasses.SELECTED,
): void {
  const list = listElement.value;
  const target = node ?? selectedNode;
  if (!list || !target) return;
  [...list.children].forEach((child) => child.classList.remove(selectedClass));
  target.classList.add(selectedClass);
}

function scrollToPos(
  targetTop: number,
  duration = scrollListNumbers.DEFAULT_SCROLL_DURATION,
): void {
  const outer = wrapper.value;
  if (!outer) return;
  if (duration && props.motion) {
    scrollAnimation?.destroy();
    if (outer.scrollTop === targetTop) {
      if (props.mode === 'wheel' && listElement.value && selector.value) {
        addClassToNode(
          foundation.getNearestNodeInfo(listElement.value, selector.value).nearestNode,
        );
      }
      return;
    }
    scrollAnimation = animatedScrollTo(outer, targetTop, duration);
    scrollAnimation.on('rest', () => {
      if (props.mode === 'wheel' && listElement.value && selector.value) {
        addClassToNode(
          foundation.getNearestNodeInfo(listElement.value, selector.value).nearestNode,
        );
      }
    });
    scrollAnimation.start();
    return;
  }
  outer.scrollTop = targetTop;
}

function scrollToNode(
  node: HTMLElement,
  duration = scrollListNumbers.DEFAULT_SCROLL_DURATION,
): void {
  const outer = wrapper.value;
  const list = listElement.value;
  if (!outer || !list || !node) return;
  const itemHeight = node.offsetHeight || scrollListNumbers.DEFAULT_ITEM_HEIGHT;
  const targetTop =
    (node.offsetTop || (list.children.length * itemHeight) / 2) -
    (outer.offsetHeight - itemHeight) / 2;
  scrollToPos(targetTop, duration);
}

function scrollToIndex(
  selectedIndex = props.selectedIndex,
  duration = scrollListNumbers.DEFAULT_SCROLL_DURATION,
): void {
  void selectedIndex;
  if (selectedNode) scrollToNode(selectedNode, duration);
}

function scrollToCenter(
  node = selectedNode,
  scrollWrapper: HTMLElement | null | undefined = wrapper.value,
  duration = scrollListNumbers.DEFAULT_SCROLL_DURATION,
): void {
  if (!node || !scrollWrapper) return;
  const scrollRect = scrollWrapper.getBoundingClientRect();
  const selectedRect = node.getBoundingClientRect();
  const targetTop =
    scrollWrapper.scrollTop +
    (selectedRect.top - (scrollRect.top + scrollRect.height / 2 - selectedRect.height / 2));
  scrollToPos(targetTop, duration);
}

function selectIndex(index: number): void {
  if (isDisabledIndex(index) || !listElement.value) return;
  foundation.selectIndex(index, listElement.value);
}

function selectNearest(node: HTMLElement | null): void {
  if (!node || !listElement.value) return;
  selectedNode = node;
  foundation.selectNode(node, listElement.value);
}

function scheduleSelect(node: HTMLElement | null): void {
  if (selectTimer !== undefined) clearTimeout(selectTimer);
  selectTimer = setTimeout(() => selectNearest(node), (1000 / 60) * 2);
}

function handleWheelScroll(): void {
  if (!listElement.value || !selector.value || !wrapper.value) return;
  const nearestNode = foundation.getNearestNodeInfo(listElement.value, selector.value).nearestNode;
  if (props.cycled && adjustFrame === undefined) {
    adjustFrame = requestAnimationFrame(() => {
      adjustFrame = undefined;
      if (listElement.value && wrapper.value && nearestNode) {
        foundation.adjustInfiniteList(listElement.value, wrapper.value, nearestNode);
      }
    });
  }
  scheduleSelect(nearestNode);
}

function handleWheelClick(event: MouseEvent): void {
  event.stopImmediatePropagation?.();
  if (!listElement.value) return;
  const target = foundation.getTargetNode(event, listElement.value);
  if (target?.targetNode && target.infoInList && !target.infoInList.disabled) {
    scheduleSelect(target.targetNode);
  }
}

function initialize(): void {
  foundation.init();
  const initialIndex =
    typeof props.selectedIndex === 'number' && props.selectedIndex > -1 ? props.selectedIndex : 0;
  selectedNode = getNodeByIndex(initialIndex);
  willSelectNode = selectedNode;
  if (!selectedNode) return;
  if (props.mode === 'wheel' && props.cycled && listElement.value && wrapper.value) {
    foundation.initWheelList(listElement.value, wrapper.value, () => {
      if (selectedNode) scrollToNode(selectedNode, 0);
    });
  } else {
    scrollToNode(selectedNode, 0);
  }
}

watch(
  () => props.selectedIndex,
  (selectedIndex, previousIndex) => {
    if (previousIndex === undefined) return;
    const willSelectIndex = getIndexByNode(willSelectNode);
    if (!indexIsSame(willSelectIndex, selectedIndex)) {
      willSelectNode = getNodeByOffset(
        selectedNode,
        selectedIndex - previousIndex,
        listElement.value,
      );
    }
    selectedNode = willSelectNode;
    scrollToIndex(selectedIndex);
  },
  { flush: 'post' },
);

onMounted(() => void nextTick(initialize));
onBeforeUnmount(() => {
  if (selectTimer !== undefined) clearTimeout(selectTimer);
  if (adjustFrame !== undefined) cancelAnimationFrame(adjustFrame);
  scrollAnimation?.destroy();
  foundation.destroy();
});

defineExpose<ScrollItemExposed>({ scrollToCenter, scrollToIndex, scrollToNode, scrollToPos });
</script>

<template>
  <div
    v-if="props.mode === 'normal'"
    ref="wrapper"
    :class="['semi-scrolllist-item', props.className, props.class]"
    :style="props.style"
  >
    <ul ref="list" role="listbox" :aria-label="props.ariaLabel" :aria-multiselectable="false">
      <li
        v-for="(item, index) in props.list"
        :key="index"
        :class="[
          index === props.selectedIndex ? 'semi-scrolllist-item-sel' : undefined,
          item.disabled ? 'semi-scrolllist-item-disabled' : undefined,
        ]"
        role="option"
        :aria-disabled="item.disabled"
        @click="selectIndex(index)"
      >
        {{ displayText(item, index) }}
      </li>
    </ul>
  </div>
  <div
    v-else
    :class="['semi-scrolllist-item-wheel', props.className, props.class]"
    :style="props.style"
  >
    <div class="semi-scrolllist-shade semi-scrolllist-shade-pre" />
    <div ref="selector" class="semi-scrolllist-selector" />
    <div class="semi-scrolllist-shade semi-scrolllist-shade-post" />
    <div
      ref="wrapper"
      :class="[
        'semi-scrolllist-list-outer',
        props.cycled ? undefined : 'semi-scrolllist-list-outer-nocycle',
      ]"
      @scroll="handleWheelScroll"
    >
      <ul
        ref="list"
        role="listbox"
        :aria-label="props.ariaLabel"
        :aria-multiselectable="false"
        @click="handleWheelClick"
      >
        <li
          v-for="entry in renderedEntries"
          :key="entry.key"
          :class="entry.item.disabled ? 'semi-scrolllist-item-disabled' : undefined"
          role="option"
          :aria-disabled="entry.item.disabled"
        >
          {{ displayText(entry.item, entry.sourceIndex) }}
        </li>
      </ul>
    </div>
  </div>
</template>
