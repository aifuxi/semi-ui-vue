<script setup lang="ts">
import { IconClose, IconHandle, IconSearch } from '@workspace/icons';
import {
  generateTransferDataByType,
  generateTransferSelectedItems,
  TransferFoundation,
  type TransferAdapter,
  type TransferBasicDataItem,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  h,
  inject,
  markRaw,
  onBeforeUnmount,
  shallowReactive,
  shallowRef,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
  type CSSProperties,
  type VNodeChild,
} from 'vue';

import Button from '../button/Button.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import { configContextKey, type ConfigContextValue } from '../config-provider';
import Input from '../input/Input.vue';
import Pagination from '../pagination/Pagination.vue';
import Spin from '../spin/Spin.vue';
import Tree from '../tree/Tree.vue';
import type { TreeExposed, TreeProps, TreeValue } from '../tree';
import TransferNodeRenderer from './TransferNodeRenderer';
import type {
  TransferDataItem,
  TransferDataSource,
  TransferDragHandleProps,
  TransferEmits,
  TransferExposed,
  TransferLocale,
  TransferPrimitive,
  TransferProps,
  TransferResolvedDataItem,
  TransferSelectedHeaderProps,
  TransferSelectedItemProps,
  TransferSelectedPanelProps,
  TransferSlots,
  TransferSourceHeaderProps,
  TransferSourceItemProps,
  TransferSourcePanelProps,
} from './types';

const DEFAULT_ZH_CN_LOCALE: Readonly<TransferLocale> = Object.freeze({
  emptyLeft: '暂无数据',
  emptySearch: '无搜索结果',
  emptyRight: '暂无内容，可从左侧勾选',
  placeholder: '搜索',
  clear: '清空',
  selectAll: '全选',
  clearSelectAll: '取消全选',
  total: '总个数：${total}',
  selected: '已选个数：${total}',
});
const DEFAULT_EN_US_LOCALE: Readonly<TransferLocale> = Object.freeze({
  emptyLeft: 'No Data',
  emptySearch: 'No search results',
  emptyRight: 'No content, check from the left',
  placeholder: 'Search',
  clear: 'Clear',
  selectAll: 'Select all',
  clearSelectAll: 'Unselect all',
  total: 'Total items: ${total}',
  selected: 'Items selected: ${total}',
});

defineOptions({ name: 'Transfer', inheritAttrs: false });
const props = withDefaults(defineProps<TransferProps>(), {
  dataSource: () => [],
  defaultValue: () => [],
  disabled: false,
  draggable: false,
  emptyContent: () => ({}),
  filter: true,
  loading: false,
  showPath: false,
  type: 'list',
});
const emit = defineEmits<TransferEmits>();
defineSlots<TransferSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
const treeRef = useTemplateRef<TreeExposed>('treeRef');
const injectedConfig = inject(configContextKey, undefined);
const config = computed<ConfigContextValue>(() =>
  injectedConfig
    ? injectedConfig.value
    : ({ direction: 'ltr', locale: { code: 'zh-CN' } } as ConfigContextValue),
);

function hasRawProp(name: string): boolean {
  const raw = instance?.vnode.props;
  const kebab = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return Boolean(
    raw &&
    (Object.prototype.hasOwnProperty.call(raw, name) ||
      Object.prototype.hasOwnProperty.call(raw, kebab)),
  );
}

const modelControlled = computed(() => hasRawProp('modelValue'));
const valueControlled = computed(() => hasRawProp('value'));
const controlled = computed(() => modelControlled.value || valueControlled.value);
const incomingValue = computed(() =>
  modelControlled.value ? props.modelValue : valueControlled.value ? props.value : undefined,
);
const locale = computed<TransferLocale>(() => {
  const fallback =
    config.value.locale.code === 'en-US' ? DEFAULT_EN_US_LOCALE : DEFAULT_ZH_CN_LOCALE;
  return { ...fallback, ...(config.value.locale.Transfer as Partial<TransferLocale> | undefined) };
});

interface TransferState {
  data: TransferResolvedDataItem[];
  selectedItems: Map<TransferPrimitive, TransferResolvedDataItem>;
  searchResult: Set<TransferPrimitive>;
  inputValue: string;
  leftCurrentPage: number;
}

function cloneDataSource(source: TransferDataSource): unknown[] {
  return (source as Array<Record<string, unknown>>).map((item) => ({
    ...item,
    ...(Array.isArray(item.children)
      ? { children: cloneDataSource(item.children as TransferDataSource) }
      : {}),
  }));
}

const initialData = generateTransferDataByType(
  cloneDataSource(props.dataSource as TransferDataSource),
  props.type,
) as TransferResolvedDataItem[];
const initialValues = controlled.value ? (incomingValue.value ?? []) : props.defaultValue;
const state = shallowReactive<TransferState>({
  data: initialData,
  selectedItems: generateTransferSelectedItems(initialValues, initialData) as Map<
    TransferPrimitive,
    TransferResolvedDataItem
  >,
  searchResult: new Set(),
  inputValue: '',
  leftCurrentPage: props.pagination?.defaultCurrentPage ?? props.pagination?.currentPage ?? 1,
});
const cache = new Map<unknown, unknown>();
const virtualScrollTop = shallowRef(0);
const dragIndex = shallowRef<number | null>(null);

type FoundationProps = TransferProps & {
  data: TransferResolvedDataItem[];
  disabled: boolean;
  showPath: boolean;
  type: NonNullable<TransferProps['type']>;
};

function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    data: state.data,
    disabled: props.disabled,
    showPath: props.showPath,
    type: props.type,
    value: incomingValue.value,
  } as FoundationProps;
  if (!controlled.value) delete output.value;
  return output;
}

const adapter: TransferAdapter<FoundationProps, TransferState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key as keyof FoundationProps],
  getProps: getFoundationProps,
  getState: (key) => state[key as keyof TransferState],
  getStates: () => state,
  setState: (nextState, callback) => {
    Object.assign(state, nextState);
    callback?.();
  },
  getCache: (key) => cache.get(key),
  getCaches: () => cache,
  setCache: (key, value) => cache.set(key, value),
  stopPropagation: (event) => event.stopPropagation?.(),
  persistEvent: () => undefined,
  getSelected: () => new Map(state.selectedItems) as Map<TransferPrimitive, TransferBasicDataItem>,
  updateSelected: (selectedItems) => {
    state.selectedItems = new Map(selectedItems) as Map<
      TransferPrimitive,
      TransferResolvedDataItem
    >;
  },
  notifyChange: (values, items) => {
    const resolvedValues = [...values];
    const resolvedItems = items as TransferDataItem[];
    emit('change', resolvedValues, resolvedItems);
    emit('update:value', resolvedValues);
    emit('update:modelValue', resolvedValues);
  },
  notifySearch: (input) => emit('search', input),
  notifySelect: (item) => emit('select', item as TransferDataItem),
  notifyDeselect: (item) => emit('deselect', item as TransferDataItem),
  updateInput: (input) => {
    state.inputValue = input;
    state.leftCurrentPage = 1;
  },
  updateSearchResult: (searchResult) => {
    state.searchResult = new Set(searchResult);
  },
  searchTree: (keyword) => treeRef.value?.search(keyword),
  updateCurrentPage: (currentPage) => {
    state.leftCurrentPage = currentPage;
  },
  notifyPageChange: (currentPage) => props.pagination?.onPageChange?.(currentPage),
};
const foundation = markRaw(new TransferFoundation<FoundationProps, TransferState>(adapter));
foundation.init();
onBeforeUnmount(() => foundation.destroy());

const filterData = computed(() =>
  state.inputValue ? state.data.filter((item) => state.searchResult.has(item.key)) : state.data,
);
const noMatch = computed(() => Boolean(state.inputValue) && state.searchResult.size === 0);
const showNumber = computed(() => (state.inputValue ? state.searchResult.size : state.data.length));
const filterDataAllDisabled = computed(() =>
  filterData.value.every((item) => Boolean(item.disabled)),
);
const leftContainsNotInSelected = computed(() =>
  filterData.value.some((item) => !item.disabled && !state.selectedItems.has(item.key)),
);
const allChecked = computed(() => !leftContainsNotInSelected.value);
const leafOnlyNum = computed(() =>
  props.type === 'treeList'
    ? filterData.value.filter((item) => Boolean(item.isLeaf)).length
    : undefined,
);
const pageSize = computed(() => props.pagination?.pageSize ?? 10);
const totalPage = computed(() => Math.ceil(filterData.value.length / pageSize.value));
const paginatedData = computed(() => {
  if (!props.pagination) return filterData.value;
  const start = (state.leftCurrentPage - 1) * pageSize.value;
  return filterData.value.slice(start, start + pageSize.value);
});
const selectedData = computed(() =>
  [...state.selectedItems.values()].map((item) => {
    const fullPath = getFullPath(item);
    return fullPath ? { ...item, fullPath } : { ...item };
  }),
);
const hasValidSelected = computed(() => selectedData.value.some((item) => !item.disabled));
const safeInputProps = computed(() => {
  const result = { ...(props.inputProps ?? {}) };
  delete result.value;
  delete result.modelValue;
  delete result.defaultValue;
  return result;
});
const safeTreeProps = computed(() => {
  const result = { ...(props.treeProps ?? {}) } as TreeProps & Record<string, unknown>;
  delete result.value;
  delete result.modelValue;
  delete result.defaultValue;
  delete result.onChange;
  delete result.ref;
  return result;
});
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name.startsWith('data-'))),
);
const sourceHeaderProps = computed<TransferSourceHeaderProps>(() => {
  const output: TransferSourceHeaderProps = {
    num: showNumber.value,
    showButton: props.type !== 'treeList' && !filterDataAllDisabled.value,
    allChecked: allChecked.value,
    onAllClick: () => foundation.handleAll(leftContainsNotInSelected.value),
  };
  if (leafOnlyNum.value !== undefined) output.leafOnlyNum = leafOnlyNum.value;
  return output;
});
const selectedHeaderProps = computed<TransferSelectedHeaderProps>(() => ({
  num: selectedData.value.length,
  showButton: selectedData.value.length > 0 && hasValidSelected.value,
  onClear: () => foundation.handleClear(),
}));
const sourcePanelProps = computed<TransferSourcePanelProps>(() => ({
  value: foundation.getValuesAndItemsFromMap(state.selectedItems).values,
  loading: props.loading,
  noMatch: noMatch.value,
  filterData: filterData.value,
  sourceData: state.data,
  propsDataSource: props.dataSource as TransferDataSource,
  allChecked: allChecked.value,
  showNumber: showNumber.value,
  inputValue: state.inputValue,
  selectedItems: state.selectedItems,
  onSearch: (value) => foundation.handleInputChange(value, true),
  onAllClick: () => foundation.handleAll(leftContainsNotInSelected.value),
  onSelectOrRemove: (item) => foundation.handleSelectOrRemove(item),
  onSelect: (values) => foundation.handleSelect(values),
}));
const selectedPanelProps = computed<TransferSelectedPanelProps>(() => ({
  length: selectedData.value.length,
  selectedData: selectedData.value,
  onClear: () => foundation.handleClear(),
  onRemove: (item) => foundation.handleSelectOrRemove(item),
  onSortEnd: (sort) => foundation.handleSortEnd(sort),
}));
const customSourcePanel = computed(() => Boolean(slots.sourcePanel || props.renderSourcePanel));
const customSelectedPanel = computed(() =>
  Boolean(slots.selectedPanel || props.renderSelectedPanel),
);

function sourceItemProps(item: TransferResolvedDataItem): TransferSourceItemProps {
  return {
    ...item,
    checked: state.selectedItems.has(item.key),
    onChange: () => foundation.handleSelectOrRemove(item),
  };
}

function beginDrag(index: number, event: DragEvent): void {
  if (!props.draggable || props.disabled || selectedData.value[index]?.disabled) return;
  dragIndex.value = index;
  event.dataTransfer?.setData('text/plain', String(selectedData.value[index]?.key ?? index));
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
}

function endDrag(): void {
  dragIndex.value = null;
}

function dropAt(newIndex: number): void {
  if (dragIndex.value === null || dragIndex.value === newIndex) {
    dragIndex.value = null;
    return;
  }
  foundation.handleSortEnd({ oldIndex: dragIndex.value, newIndex });
  dragIndex.value = null;
}

function dragHandleProps(index: number): TransferDragHandleProps {
  return {
    draggable: true,
    role: 'button',
    'aria-label': 'Drag and sort',
    onDragstart: (event) => beginDrag(index, event),
    onDragend: endDrag,
  };
}

function selectedItemProps(
  item: TransferResolvedDataItem,
  index: number,
): TransferSelectedItemProps {
  const handleProps = props.draggable ? dragHandleProps(index) : undefined;
  const output: TransferSelectedItemProps = {
    ...item,
    onRemove: () => foundation.handleSelectOrRemove(item),
  };
  const fullPath = getFullPath(item);
  if (fullPath) output.fullPath = fullPath;
  if (handleProps) {
    output.dragHandleProps = handleProps;
    output.sortableHandle = (render) => h('span', handleProps, { default: render });
  }
  return output;
}

function getFullPath(item: TransferResolvedDataItem): TransferResolvedDataItem[] | undefined {
  if (props.type !== 'treeList' || !props.showPath || !Array.isArray(item.path)) return undefined;
  return item.path.map((pathItem) => ({ ...pathItem })) as TransferResolvedDataItem[];
}

function selectedLabel(item: TransferResolvedDataItem): VNodeChild {
  if (props.type === 'treeList' && props.showPath) {
    return foundation._generatePath(
      item as TransferBasicDataItem & { path?: TransferBasicDataItem[] },
    );
  }
  return item.label;
}

function sourceItemRender(item: TransferResolvedDataItem): VNodeChild {
  return props.renderSourceItem?.(sourceItemProps(item));
}

function selectedItemRender(item: TransferResolvedDataItem, index: number): VNodeChild {
  return props.renderSelectedItem?.(selectedItemProps(item, index));
}

function sourceHeaderRender(): VNodeChild {
  return props.renderSourceHeader?.(sourceHeaderProps.value);
}

function selectedHeaderRender(): VNodeChild {
  return props.renderSelectedHeader?.(selectedHeaderProps.value);
}

function sourcePanelRender(): VNodeChild {
  return props.renderSourcePanel?.(sourcePanelProps.value);
}

function selectedPanelRender(): VNodeChild {
  return props.renderSelectedPanel?.(selectedPanelProps.value);
}

function search(value: string): void {
  foundation.handleInputChange(value, false);
}

function handleTreeChange(value?: TreeValue): void {
  const values = Array.isArray(value)
    ? value.filter(
        (entry): entry is TransferPrimitive =>
          typeof entry === 'string' || typeof entry === 'number',
      )
    : typeof value === 'string' || typeof value === 'number'
      ? [value]
      : [];
  foundation.handleSelect(values);
}

function handleVirtualScroll(event: Event): void {
  virtualScrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
}

function cssSize(value: number | string | undefined, fallback: string): string {
  if (typeof value === 'number') return `${value}px`;
  return value ?? fallback;
}

const virtualItemSize = computed(() => Math.max(1, props.virtualize?.itemSize ?? 36));
const virtualViewportHeight = computed(() => {
  const height = props.virtualize?.height;
  if (typeof height === 'number') return height;
  const parsed = typeof height === 'string' ? Number.parseFloat(height) : Number.NaN;
  return Number.isFinite(parsed) && height?.endsWith('px') ? parsed : 400;
});
const virtualRange = computed(() => {
  const start = Math.max(0, Math.floor(virtualScrollTop.value / virtualItemSize.value) - 2);
  const end = Math.min(
    selectedData.value.length,
    Math.ceil((virtualScrollTop.value + virtualViewportHeight.value) / virtualItemSize.value) + 2,
  );
  return { start, end };
});
const virtualItems = computed(() =>
  selectedData.value
    .slice(virtualRange.value.start, virtualRange.value.end)
    .map((item, offset) => ({
      item,
      index: virtualRange.value.start + offset,
    })),
);
const virtualListStyle = computed<CSSProperties>(() => ({
  height: cssSize(props.virtualize?.height, '100%'),
  width: cssSize(props.virtualize?.width, '100%'),
}));

watch(
  () => [props.dataSource, props.type] as const,
  () => {
    state.data = generateTransferDataByType(
      cloneDataSource(props.dataSource as TransferDataSource),
      props.type,
    ) as TransferResolvedDataItem[];
    if (controlled.value) {
      state.selectedItems = generateTransferSelectedItems(
        incomingValue.value ?? [],
        state.data,
      ) as Map<TransferPrimitive, TransferResolvedDataItem>;
    }
    if (state.inputValue) foundation.handleInputChange(state.inputValue, false);
  },
  { deep: true },
);
watch(incomingValue, (value) => {
  if (!controlled.value) return;
  state.selectedItems = generateTransferSelectedItems(value ?? [], state.data) as Map<
    TransferPrimitive,
    TransferResolvedDataItem
  >;
});
watch(
  () => props.pagination?.currentPage,
  (page) => {
    if (typeof page === 'number') state.leftCurrentPage = page;
  },
);

defineExpose<TransferExposed>({ search });
</script>

<template>
  <div
    v-bind="dataAttrs"
    :class="[
      'semi-transfer',
      props.disabled && 'semi-transfer-disabled',
      customSourcePanel && customSelectedPanel && 'semi-transfer-custom-panel',
      props.className,
      attrs.class,
    ]"
    :style="[props.style, attrs.style]"
  >
    <slot v-if="customSourcePanel" name="sourcePanel" v-bind="sourcePanelProps">
      <TransferNodeRenderer :content="sourcePanelRender()" />
    </slot>
    <section v-else class="semi-transfer-left">
      <div
        v-if="props.filter !== false"
        role="search"
        aria-label="Transfer filter"
        class="semi-transfer-filter"
      >
        <Input
          v-bind="safeInputProps"
          :disabled="props.disabled"
          :placeholder="safeInputProps.placeholder ?? locale.placeholder"
          show-clear
          :value="state.inputValue"
          @change="(value) => foundation.handleInputChange(String(value ?? ''), true)"
        >
          <template #prefix><IconSearch /></template>
        </Input>
      </div>

      <Spin v-if="props.loading" />
      <div
        v-else-if="noMatch"
        aria-label="empty"
        class="semi-transfer-empty semi-transfer-left-empty"
      >
        <slot name="emptySearch">
          <TransferNodeRenderer :content="props.emptyContent.search ?? locale.emptySearch" />
        </slot>
      </div>
      <div
        v-else-if="state.data.length === 0"
        aria-label="empty"
        class="semi-transfer-empty semi-transfer-left-empty"
      >
        <slot name="emptyLeft">
          <TransferNodeRenderer :content="props.emptyContent.left ?? locale.emptyLeft" />
        </slot>
      </div>
      <template v-else>
        <slot name="sourceHeader" v-bind="sourceHeaderProps">
          <TransferNodeRenderer v-if="props.renderSourceHeader" :content="sourceHeaderRender()" />
          <div v-else class="semi-transfer-header semi-transfer-left-header">
            <span class="semi-transfer-header-total">{{
              locale.total.replace('${total}', String(showNumber))
            }}</span>
            <Button
              v-if="sourceHeaderProps.showButton"
              theme="borderless"
              :disabled="props.disabled"
              type="tertiary"
              size="small"
              class="semi-transfer-header-all"
              @click="sourceHeaderProps.onAllClick"
            >
              {{ sourceHeaderProps.allChecked ? locale.clearSelectAll : locale.selectAll }}
            </Button>
          </div>
        </slot>

        <Tree
          v-if="props.type === 'treeList'"
          ref="treeRef"
          :disabled="props.disabled"
          :tree-data="props.dataSource as NonNullable<TreeProps['treeData']>"
          multiple
          disable-strictly
          :value="sourcePanelProps.value"
          default-expand-all
          leaf-only
          :filter-tree-node="true"
          :search-render="false"
          :search-style="{ padding: 0 }"
          :style="{ flex: 1, overflow: 'overlay' }"
          v-bind="safeTreeProps"
          @change="handleTreeChange"
        />
        <template v-else>
          <div class="semi-transfer-left-list" role="list" aria-label="Option list">
            <template v-for="(item, index) in paginatedData" :key="item.key">
              <div
                v-if="
                  item._parent &&
                  (index === 0 || paginatedData[index - 1]?._parent?.title !== item._parent.title)
                "
                class="semi-transfer-group-title"
              >
                {{ item._parent.title }}
              </div>
              <slot name="sourceItem" v-bind="sourceItemProps(item)">
                <TransferNodeRenderer
                  v-if="props.renderSourceItem"
                  :content="sourceItemRender(item)"
                />
                <Checkbox
                  v-else
                  :checked="state.selectedItems.has(item.key)"
                  :class-name="`semi-transfer-item${item.disabled ? ' semi-transfer-item-disabled' : ''}`"
                  :disabled="Boolean(item.disabled || props.disabled)"
                  role="listitem"
                  @change="foundation.handleSelectOrRemove(item)"
                >
                  <TransferNodeRenderer :content="item.label" />
                </Checkbox>
              </slot>
            </template>
          </div>
          <div v-if="props.pagination && totalPage > 1" class="semi-transfer-left-pagination">
            <Pagination
              :total="filterData.length"
              :current-page="state.leftCurrentPage"
              :page-size="pageSize"
              @page-change="(page) => foundation.handlePageChange(page)"
            />
          </div>
        </template>
      </template>
    </section>

    <slot v-if="customSelectedPanel" name="selectedPanel" v-bind="selectedPanelProps">
      <TransferNodeRenderer :content="selectedPanelRender()" />
    </slot>
    <section v-else class="semi-transfer-right">
      <slot name="selectedHeader" v-bind="selectedHeaderProps">
        <TransferNodeRenderer v-if="props.renderSelectedHeader" :content="selectedHeaderRender()" />
        <div v-else class="semi-transfer-header semi-transfer-right-header">
          <span class="semi-transfer-header-total">{{
            locale.selected.replace('${total}', String(selectedData.length))
          }}</span>
          <Button
            v-if="selectedHeaderProps.showButton"
            theme="borderless"
            :disabled="props.disabled"
            type="tertiary"
            size="small"
            class="semi-transfer-header-all"
            @click="selectedHeaderProps.onClear"
          >
            {{ locale.clear }}
          </Button>
        </div>
      </slot>

      <div
        v-if="selectedData.length === 0"
        aria-label="empty"
        class="semi-transfer-empty semi-transfer-right-empty"
      >
        <slot name="emptyRight">
          <TransferNodeRenderer :content="props.emptyContent.right ?? locale.emptyRight" />
        </slot>
      </div>
      <div
        v-else-if="props.virtualize && !props.draggable"
        class="semi-transfer-right-list semi-transfer-right-virtual-list"
        role="list"
        aria-label="Selected list"
        :style="virtualListStyle"
        @scroll="handleVirtualScroll"
      >
        <div
          :style="{ height: `${selectedData.length * virtualItemSize}px`, position: 'relative' }"
        >
          <div
            v-for="entry in virtualItems"
            :key="entry.item.key"
            role="presentation"
            :style="{
              position: 'absolute',
              top: `${entry.index * virtualItemSize}px`,
              width: '100%',
              height: `${virtualItemSize}px`,
            }"
          >
            <slot name="selectedItem" v-bind="selectedItemProps(entry.item, entry.index)">
              <TransferNodeRenderer
                v-if="props.renderSelectedItem"
                :content="selectedItemRender(entry.item, entry.index)"
              />
              <div v-else role="listitem" class="semi-transfer-item semi-transfer-right-item">
                <div class="semi-transfer-right-item-text">
                  <TransferNodeRenderer :content="selectedLabel(entry.item)" />
                </div>
                <IconClose
                  :aria-disabled="entry.item.disabled"
                  :class="[
                    'semi-transfer-item-close-icon',
                    entry.item.disabled && 'semi-transfer-item-close-icon-disabled',
                  ]"
                  @click="foundation.handleSelectOrRemove(entry.item)"
                />
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div v-else class="semi-transfer-right-list" role="list" aria-label="Selected list">
        <template v-for="(item, index) in selectedData" :key="item.key">
          <slot name="selectedItem" v-bind="selectedItemProps(item, index)">
            <TransferNodeRenderer
              v-if="props.renderSelectedItem"
              :content="selectedItemRender(item, index)"
            />
            <div
              v-else
              role="listitem"
              :class="[
                'semi-transfer-item',
                'semi-transfer-right-item',
                props.draggable && 'semi-transfer-right-item-draggable',
              ]"
              @dragover.prevent
              @drop.prevent="dropAt(index)"
            >
              <IconHandle
                v-if="props.draggable"
                v-bind="dragHandleProps(index)"
                class="semi-transfer-right-item-drag-handler"
              />
              <div class="semi-transfer-right-item-text">
                <TransferNodeRenderer :content="selectedLabel(item)" />
              </div>
              <IconClose
                :aria-disabled="item.disabled"
                :class="[
                  'semi-transfer-item-close-icon',
                  item.disabled && 'semi-transfer-item-close-icon-disabled',
                ]"
                @click="foundation.handleSelectOrRemove(item)"
              />
            </div>
          </slot>
        </template>
      </div>
    </section>
  </div>
</template>
