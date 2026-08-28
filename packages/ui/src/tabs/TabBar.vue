<script setup lang="ts">
import { IconChevronDown, IconChevronLeft, IconChevronRight } from '@workspace/icons';
import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowReactive,
  shallowRef,
  useSlots,
  useTemplateRef,
  watch,
  type CSSProperties,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import TabItem from './TabItem.vue';
import TabsDropdown from './TabsDropdown.vue';
import TabsNodeRenderer from './TabsNodeRenderer';
import type {
  PlainTab,
  TabArrowPosition,
  TabPosition,
  TabSize,
  TabsDropdownProps,
  TabsMoreOptions,
  TabsSlots,
  TabType,
} from './types';

interface TabBarProps {
  activeKey: string;
  arrowPosition: TabArrowPosition;
  className?: string | undefined;
  collapsible: boolean | 'auto';
  dropdownProps?: TabsDropdownProps | undefined;
  list: PlainTab[];
  more?: number | TabsMoreOptions | undefined;
  showRestInDropdown: boolean;
  size: TabSize;
  style?: CSSProperties | undefined;
  tabBarExtraContent?: VNodeChild | undefined;
  tabPosition: TabPosition;
  type: TabType;
  visibleTabsStyle?: CSSProperties | undefined;
}

defineOptions({ name: 'TabsTabBar', inheritAttrs: false });
const props = defineProps<TabBarProps>();
const emit = defineEmits<{
  close: [itemKey: string, event: MouseEvent];
  keyDown: [event: KeyboardEvent, itemKey: string, closable: boolean];
  select: [itemKey: string, event: MouseEvent | KeyboardEvent];
  visibleChange: [state: Map<string, boolean>];
}>();
defineSlots<Pick<TabsSlots, 'arrow' | 'more' | 'tabBarExtraContent'>>();
const slots = useSlots();
const bar = useTemplateRef<HTMLElement>('bar');
const scroller = useTemplateRef<HTMLElement>('scroller');
const uuid = shallowRef('');
const shouldCollapse = shallowRef(props.collapsible === true);
const visibleState = shallowReactive(new Map<string, boolean>());
let resizeObserver: ResizeObserver | undefined;
let intersectionObserver: IntersectionObserver | undefined;

const effectiveCollapsible = computed(
  () => props.collapsible === true || (props.collapsible === 'auto' && shouldCollapse.value),
);
const moreCount = computed(() => {
  if (typeof props.more === 'number') return Math.min(Math.max(props.more, 0), props.list.length);
  if (props.more && typeof props.more === 'object') {
    return Math.min(Math.max(props.more.count, 0), props.list.length);
  }
  return 0;
});
const visibleByMore = computed(() =>
  moreCount.value ? props.list.slice(0, props.list.length - moreCount.value) : props.list,
);
const hiddenByMore = computed(() =>
  moreCount.value ? props.list.slice(props.list.length - moreCount.value) : [],
);
const hiddenStart = computed(() =>
  props.list
    .filter((item) => visibleState.get(item.itemKey) === false)
    .filter((item) => {
      const activeIndex = props.list.findIndex(
        (candidate) => candidate.itemKey === props.activeKey,
      );
      return props.list.indexOf(item) < Math.max(activeIndex, 1);
    }),
);
const hiddenEnd = computed(() =>
  props.list.filter(
    (item) => visibleState.get(item.itemKey) === false && !hiddenStart.value.includes(item),
  ),
);
const extraContent = computed(() => slots.tabBarExtraContent?.() ?? props.tabBarExtraContent);
const barClasses = computed(() => [
  'semi-tabs-bar',
  `semi-tabs-bar-${props.type}`,
  `semi-tabs-bar-${props.tabPosition}`,
  effectiveCollapsible.value ? 'semi-tabs-bar-collapse' : undefined,
  props.className,
]);
const extraClasses = computed(() => [
  'semi-tabs-bar-extra',
  `semi-tabs-bar-${props.type}-extra`,
  `semi-tabs-bar-${props.type}-extra-${props.size}`,
]);

function defaultVisibleState(): Map<string, boolean> {
  return new Map(props.list.map((item) => [item.itemKey, true]));
}

function updateVisibility(): void {
  const target = scroller.value;
  if (!effectiveCollapsible.value || !target) {
    const all = defaultVisibleState();
    visibleState.clear();
    all.forEach((value, key) => visibleState.set(key, value));
    emit('visibleChange', all);
    return;
  }
  const rootRect = target.getBoundingClientRect();
  const viewportHeight = document.documentElement.clientHeight;
  if (rootRect.bottom <= 0 || rootRect.top >= viewportHeight) {
    const all = defaultVisibleState();
    visibleState.clear();
    all.forEach((value, key) => visibleState.set(key, value));
    emit('visibleChange', all);
    return;
  }
  const next = new Map<string, boolean>();
  target.querySelectorAll<HTMLElement>('.semi-tabs-tab[data-item-key]').forEach((node) => {
    const rect = node.getBoundingClientRect();
    next.set(
      node.dataset.itemKey ?? '',
      rect.left >= rootRect.left - 0.5 && rect.right <= rootRect.right + 0.5,
    );
  });
  visibleState.clear();
  next.forEach((value, key) => visibleState.set(key, value));
  emit('visibleChange', next);
}

function measure(): void {
  const target = bar.value;
  if (!target) return;
  if (props.collapsible === 'auto') {
    const tabs = Array.from(target.querySelectorAll<HTMLElement>('.semi-tabs-tab'));
    const firstTop = tabs[0]?.offsetTop;
    const wrapped =
      typeof firstTop === 'number' && tabs.some((node) => node.offsetTop !== firstTop);
    shouldCollapse.value = wrapped || target.scrollWidth > target.clientWidth + 1;
  }
  nextTick(updateVisibility);
}

function scroll(position: 'start' | 'end'): void {
  const target = scroller.value;
  if (!target) return;
  const distance = Math.max(target.clientWidth * 0.6, 80);
  target.scrollBy({ left: position === 'start' ? -distance : distance, behavior: 'smooth' });
  requestAnimationFrame(updateVisibility);
}

function scrollActiveIntoView(): void {
  scroller.value
    ?.querySelector<HTMLElement>(`[data-item-key="${CSS.escape(props.activeKey)}"]`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  requestAnimationFrame(updateVisibility);
}

function select(itemKey: string, event: MouseEvent | KeyboardEvent): void {
  emit('select', itemKey, event);
}

function forwardClose(itemKey: string, event: MouseEvent): void {
  emit('close', itemKey, event);
}

function forwardKeyDown(event: KeyboardEvent, itemKey: string, closable: boolean): void {
  emit('keyDown', event, itemKey, closable);
}

function arrowNode(position: 'start' | 'end'): VNodeChild {
  return h(position === 'start' ? IconChevronLeft : IconChevronRight);
}

onMounted(() => {
  uuid.value = globalThis.crypto?.randomUUID?.() ?? `tabs-${Math.random().toString(36).slice(2)}`;
  if (typeof ResizeObserver !== 'undefined' && bar.value) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(bar.value);
  }
  if (typeof IntersectionObserver !== 'undefined' && scroller.value) {
    intersectionObserver = new IntersectionObserver(updateVisibility, {
      threshold: [0, 0.75],
    });
    intersectionObserver.observe(scroller.value);
  }
  scroller.value?.addEventListener('scroll', updateVisibility, { passive: true });
  measure();
  requestAnimationFrame(measure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  scroller.value?.removeEventListener('scroll', updateVisibility);
});

watch(
  () => props.list,
  () => nextTick(measure),
  { deep: true },
);
watch(
  () => props.activeKey,
  () => effectiveCollapsible.value && nextTick(scrollActiveIntoView),
);
watch(
  () => props.collapsible,
  () => nextTick(measure),
);
</script>

<template>
  <div
    ref="bar"
    :aria-orientation="tabPosition === 'left' ? 'vertical' : 'horizontal'"
    :class="barClasses"
    :data-uuid="uuid"
    role="tablist"
    :style="style"
  >
    <template v-if="effectiveCollapsible">
      <div class="semi-overflow-list semi-tabs-bar-overflow-list">
        <div
          v-if="arrowPosition === 'both' || arrowPosition === 'start'"
          class="semi-tabs-bar-arrow semi-tabs-bar-arrow-start"
          role="presentation"
        >
          <slot
            v-if="$slots.arrow"
            name="arrow"
            :click="() => scroll('start')"
            :default-node="arrowNode('start')"
            :items="hiddenStart"
            position="start"
          />
          <TabsDropdown
            v-else-if="showRestInDropdown"
            :active-key="activeKey"
            class-name="semi-tabs-bar-dropdown"
            :items="hiddenStart"
            :options="dropdownProps?.start"
            @select="select"
          >
            <Button
              :disabled="hiddenStart.length === 0"
              theme="borderless"
              @click="scroll('start')"
            >
              <template #icon>
                <IconChevronLeft />
              </template>
            </Button>
          </TabsDropdown>
          <Button
            v-else
            :disabled="hiddenStart.length === 0"
            theme="borderless"
            @click="scroll('start')"
          >
            <template #icon>
              <IconChevronLeft />
            </template>
          </Button>
        </div>
        <div ref="scroller" class="semi-overflow-list-scroll-wrapper" :style="visibleTabsStyle">
          <TabItem
            v-for="item in list"
            :key="`${item.itemKey}-bar`"
            v-bind="item"
            :data-item-key="item.itemKey"
            :data-scrollkey="`${item.itemKey}-bar`"
            :selected="item.itemKey === activeKey"
            :size="size"
            :tab-position="tabPosition"
            :type="type"
            @click="select"
            @close="forwardClose"
            @key-down="forwardKeyDown"
          />
        </div>
        <div
          v-if="arrowPosition === 'both' || arrowPosition === 'end'"
          class="semi-tabs-bar-arrow semi-tabs-bar-arrow-end"
          role="presentation"
        >
          <slot
            v-if="$slots.arrow"
            name="arrow"
            :click="() => scroll('end')"
            :default-node="arrowNode('end')"
            :items="hiddenEnd"
            position="end"
          />
          <TabsDropdown
            v-else-if="showRestInDropdown"
            :active-key="activeKey"
            class-name="semi-tabs-bar-dropdown"
            :items="hiddenEnd"
            :options="dropdownProps?.end"
            @select="select"
          >
            <Button :disabled="hiddenEnd.length === 0" theme="borderless" @click="scroll('end')">
              <template #icon>
                <IconChevronRight />
              </template>
            </Button>
          </TabsDropdown>
          <Button
            v-else
            :disabled="hiddenEnd.length === 0"
            theme="borderless"
            @click="scroll('end')"
          >
            <template #icon>
              <IconChevronRight />
            </template>
          </Button>
        </div>
      </div>
    </template>
    <template v-else>
      <TabItem
        v-for="item in visibleByMore"
        :key="`${item.itemKey}-bar`"
        v-bind="item"
        :selected="item.itemKey === activeKey"
        :size="size"
        :tab-position="tabPosition"
        :type="type"
        @click="select"
        @close="forwardClose"
        @key-down="forwardKeyDown"
      />
      <TabsDropdown
        v-if="hiddenByMore.length"
        :active-key="activeKey"
        :class-name="`semi-tabs-bar-more-dropdown-${type}`"
        :items="hiddenByMore"
        :options="typeof more === 'object' ? more.dropdownProps : undefined"
        @select="select"
      >
        <slot v-if="$slots.more" name="more" :hidden-tabs="hiddenByMore" />
        <TabsNodeRenderer
          v-else-if="typeof more === 'object' && more.render"
          :content="more.render()"
        />
        <div v-else :class="['semi-tabs-bar-more-trigger', `semi-tabs-bar-more-trigger-${type}`]">
          <div class="semi-tabs-bar-more-trigger-content">
            <div>{{ $attrs['data-more-label'] ?? '更多' }}</div>
            <IconChevronDown class="semi-tabs-bar-more-trigger-content-icon" />
          </div>
        </div>
      </TabsDropdown>
    </template>
    <div
      v-if="extraContent"
      :class="extraClasses"
      :style="{ float: 'right' }"
      x-semi-prop="tabBarExtraContent"
    >
      <TabsNodeRenderer :content="extraContent" />
    </div>
  </div>
</template>
