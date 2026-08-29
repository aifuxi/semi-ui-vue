<script setup lang="ts" generic="T = unknown">
import {
  Comment,
  Fragment,
  Text,
  computed,
  inject,
  isVNode,
  provide,
  useAttrs,
  useSlots,
  type VNodeChild,
} from 'vue';

import { Row, type RowProps } from '../grid';
import { configContextKey, DEFAULT_CONFIG_LOCALE } from '../config-provider';
import ListNodeRenderer from './ListNodeRenderer';
import ListSpin from './ListSpin.vue';
import { listContextKey } from './list-context';
import type { ListEmits, ListLocale, ListProps, ListSlots } from './types';

interface RenderedItem {
  content: VNodeChild;
  key: PropertyKey;
}

defineOptions({ name: 'List', inheritAttrs: false });
const props = withDefaults(defineProps<ListProps<T>>(), {
  bordered: false,
  layout: 'vertical',
  loading: false,
  size: 'default',
  split: true,
});
const emit = defineEmits<ListEmits>();
defineSlots<ListSlots<T>>();
const attrs = useAttrs();
const slots = useSlots();
const injectedConfig = inject(configContextKey, undefined);
const locale = computed(() => injectedConfig?.value.locale ?? DEFAULT_CONFIG_LOCALE);

provide(listContextKey, {
  grid: computed(() => props.grid),
  onClick: (event) => emit('click', event),
  onRightClick: (event) => emit('rightClick', event),
});

function hasRenderableContent(content: VNodeChild): boolean {
  if (Array.isArray(content)) return content.some(hasRenderableContent);
  if (content == null || content === false || content === true) return false;
  if (typeof content === 'string') return content.trim().length > 0;
  if (!isVNode(content)) return true;
  if (content.type === Comment) return false;
  if (content.type === Text) return String(content.children ?? '').trim().length > 0;
  if (content.type === Fragment) return hasRenderableContent(content.children as VNodeChild);
  return true;
}

const defaultContent = computed<VNodeChild>(() => slots.default?.() ?? []);
const hasDefaultContent = computed(() => hasRenderableContent(defaultContent.value));
const renderedItems = computed<RenderedItem[]>(() => {
  if (!props.dataSource?.length) return [];
  return props.dataSource.map((item, index) => {
    const content = slots.item?.({ item, index }) ?? props.renderItem?.(item, index);
    const key = isVNode(content) && content.key != null ? content.key : `list-item-${index}`;
    return { content, key };
  });
});
const shouldRenderEmpty = computed(() => !props.dataSource?.length && !hasDefaultContent.value);
const headerContent = computed(() => slots.header?.() ?? props.header);
const footerContent = computed(() => slots.footer?.() ?? props.footer);
const loadMoreContent = computed(() => slots.loadMore?.() ?? props.loadMore);
const hasHeader = computed(() => hasRenderableContent(headerContent.value));
const hasFooter = computed(() => hasRenderableContent(footerContent.value));
const hasLoadMore = computed(() => hasRenderableContent(loadMoreContent.value));
const customEmptyContent = computed(() => slots.emptyContent?.() ?? props.emptyContent);
const hasCustomEmpty = computed(() => hasRenderableContent(customEmptyContent.value));
const emptyText = computed(
  () => (locale.value.List as ListLocale | undefined)?.emptyText ?? '暂无数据',
);
const rowProps = computed<RowProps>(() => {
  const grid = props.grid;
  if (!grid) return { type: 'flex' };
  return {
    type: grid.type ?? 'flex',
    ...(grid.align === undefined ? {} : { align: grid.align }),
    ...(grid.gutter === undefined ? {} : { gutter: grid.gutter }),
    ...(grid.justify === undefined ? {} : { justify: grid.justify }),
  };
});
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([attributeName]) => attributeName !== 'class' && attributeName !== 'style',
    ),
  ),
);
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="semi-list"
    :class="[
      attrs.class,
      props.class,
      props.className,
      `semi-list-${props.size}`,
      {
        'semi-list-flex': props.layout === 'horizontal',
        'semi-list-grid': props.grid,
        'semi-list-split': props.split,
        'semi-list-bordered': props.bordered,
      },
    ]"
    :style="[attrs.style, props.style]"
  >
    <div v-if="hasHeader" class="semi-list-header" x-semi-prop="header">
      <ListNodeRenderer :content="headerContent" />
    </div>
    <ListSpin :spinning="props.loading">
      <Row v-if="props.grid" v-bind="rowProps">
        <ListNodeRenderer v-for="item in renderedItems" :key="item.key" :content="item.content" />
        <div
          v-if="shouldRenderEmpty"
          class="semi-list-empty"
          :x-semi-prop="hasCustomEmpty ? 'emptyContent' : undefined"
        >
          <ListNodeRenderer v-if="hasCustomEmpty" :content="customEmptyContent" />
          <template v-else>{{ emptyText }}</template>
        </div>
        <ListNodeRenderer :content="defaultContent" />
      </Row>
      <ul v-else class="semi-list-items">
        <ListNodeRenderer v-for="item in renderedItems" :key="item.key" :content="item.content" />
        <div
          v-if="shouldRenderEmpty"
          class="semi-list-empty"
          :x-semi-prop="hasCustomEmpty ? 'emptyContent' : undefined"
        >
          <ListNodeRenderer v-if="hasCustomEmpty" :content="customEmptyContent" />
          <template v-else>{{ emptyText }}</template>
        </div>
        <ListNodeRenderer :content="defaultContent" />
      </ul>
    </ListSpin>
    <div v-if="hasFooter" class="semi-list-footer" x-semi-prop="footer">
      <ListNodeRenderer :content="footerContent" />
    </div>
    <ListNodeRenderer v-if="hasLoadMore" :content="loadMoreContent" />
  </div>
</template>
