<script setup lang="ts">
import { IconChevronRight, IconTick } from '@workspace/icons';
import {
  computed,
  h,
  shallowRef,
  type CSSProperties,
  type VNode,
  type VNodeArrayChildren,
  type VNodeChild,
} from 'vue';

import { Checkbox, type CheckboxChangeEvent } from '../checkbox';
import { Spin } from '../spin';
import CascaderNodeRenderer from './CascaderNodeRenderer';
import type {
  CascaderData,
  CascaderEntity,
  CascaderFilterData,
  CascaderFilterRenderProps,
  CascaderShowNext,
  CascaderVirtualize,
} from './types';

type CascaderPanelNode = string | number | VNode | VNodeArrayChildren | null;

interface Props {
  activeKeys: Set<string>;
  checkedKeys: Set<string>;
  data: Array<CascaderEntity | CascaderFilterData>;
  direction: 'ltr' | 'rtl';
  emptyContent?: CascaderPanelNode | undefined;
  expandIcon?: CascaderPanelNode | undefined;
  filterRender?: ((props: CascaderFilterRenderProps) => VNodeChild) | undefined;
  halfCheckedKeys: Set<string>;
  keyword: string;
  loadData?: ((selectOptions: CascaderData[]) => Promise<void>) | undefined;
  loadedKeys: Set<string>;
  loadingKeys: Set<string>;
  multiple: boolean;
  searchable: boolean;
  selectedKeys: Set<string>;
  separator: string;
  showNext: CascaderShowNext;
  virtualize?: CascaderVirtualize | undefined;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  check: [item: CascaderEntity | CascaderFilterData];
  itemClick: [event: MouseEvent | KeyboardEvent, item: CascaderEntity | CascaderFilterData];
  itemHover: [event: MouseEvent, item: CascaderEntity];
  listScroll: [event: Event, panelIndex: number];
}>();

const scrollTop = shallowRef(0);
const columns = computed<CascaderEntity[][]>(() => {
  if (props.searchable) return [];
  const output: CascaderEntity[][] = [];
  let current = props.data as CascaderEntity[];
  while (current.length) {
    output.push(current);
    const active = current.find((item) => props.activeKeys.has(item.key));
    current = active?.children ?? [];
  }
  return output;
});
const virtualHeight = computed(() => {
  const value = props.virtualize?.height;
  return typeof value === 'number' ? value : Number.parseFloat(value ?? '') || 200;
});
const virtualWindow = computed(() => {
  const data = props.data as CascaderFilterData[];
  if (!props.virtualize) return { start: 0, items: data, total: 0 };
  const overscan = 2;
  const start = Math.max(0, Math.floor(scrollTop.value / props.virtualize.itemSize) - overscan);
  const count = Math.ceil(virtualHeight.value / props.virtualize.itemSize) + overscan * 2;
  return {
    start,
    items: data.slice(start, start + count),
    total: data.length * props.virtualize.itemSize,
  };
});

function isDisabled(item: CascaderEntity | CascaderFilterData): boolean {
  return Boolean(item.data.disabled || ('disabled' in item && item.disabled));
}
function itemClasses(item: CascaderEntity | CascaderFilterData, flattened: boolean): string[] {
  const selected = props.selectedKeys.has(item.key);
  return [
    'semi-cascader-option',
    flattened && !props.filterRender ? 'semi-cascader-option-flatten' : '',
    props.activeKeys.has(item.key) && !selected ? 'semi-cascader-option-active' : '',
    selected && !props.multiple ? 'semi-cascader-option-select' : '',
    isDisabled(item) ? 'semi-cascader-option-disabled' : '',
  ].filter(Boolean);
}
function handleClick(
  event: MouseEvent | KeyboardEvent,
  item: CascaderEntity | CascaderFilterData,
): void {
  if (isDisabled(item)) return;
  emit('itemClick', event, item);
}
function handleKeypress(event: KeyboardEvent, item: CascaderEntity | CascaderFilterData): void {
  if (event.key === 'Enter') handleClick(event, item);
}
function handleHover(event: MouseEvent, item: CascaderEntity): void {
  if (!item.data.disabled && props.showNext === 'hover') emit('itemHover', event, item);
}
function handleCheck(event: CheckboxChangeEvent, item: CascaderEntity | CascaderFilterData): void {
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
  if (!isDisabled(item)) emit('check', item);
}
function icon(type: 'child' | 'tick' | 'loading' | 'empty', left = false): VNodeChild {
  const base = left ? ' semi-cascader-option-icon-left' : '';
  if (type === 'child') {
    return (
      props.expandIcon ??
      h(IconChevronRight, {
        class: `semi-cascader-option-icon semi-cascader-option-icon-expand${base}`,
      })
    );
  }
  if (type === 'tick') {
    return h(IconTick, {
      class: `semi-cascader-option-icon semi-cascader-option-icon-active${base}`,
    });
  }
  if (type === 'loading') {
    return h(Spin, { wrapperClassName: `semi-cascader-option-spin-icon${base}`, size: 'small' });
  }
  return h('span', {
    'aria-hidden': 'true',
    class: `semi-cascader-option-icon semi-cascader-option-icon-empty${base}`,
  });
}
function highlighted(path: VNodeChild[]): VNodeChild[] {
  const output: VNodeChild[] = [];
  const needle = props.keyword.toLocaleLowerCase();
  path.forEach((part, partIndex) => {
    if (typeof part !== 'string' || !needle) {
      output.push(part);
    } else {
      const lower = part.toLocaleLowerCase();
      let from = 0;
      let match = lower.indexOf(needle);
      while (match >= 0) {
        if (match > from) output.push(part.slice(from, match));
        output.push(
          h(
            'span',
            { class: 'semi-cascader-option-label-highlight', key: `${partIndex}-${match}` },
            part.slice(match, match + props.keyword.length),
          ),
        );
        from = match + props.keyword.length;
        match = lower.indexOf(needle, from);
      }
      if (from < part.length) output.push(part.slice(from));
    }
    if (partIndex < path.length - 1) output.push(props.separator);
  });
  return output;
}
function filterRenderProps(
  item: CascaderFilterData,
  style?: CSSProperties,
): CascaderFilterRenderProps {
  const output: CascaderFilterRenderProps = {
    className: itemClasses(item, true).join(' '),
    inputValue: props.keyword,
    disabled: isDisabled(item),
    data: item.pathData,
    checkStatus: {
      checked: props.checkedKeys.has(item.key),
      halfChecked: props.halfCheckedKeys.has(item.key),
    },
    selected: props.selectedKeys.has(item.key),
    onClick: (event) => handleClick(event, item),
    onCheck: (event) => handleClick(event, item),
  };
  if (style !== undefined) output.style = style;
  return output;
}
function virtualStyle(index: number): CSSProperties | undefined {
  if (!props.virtualize) return undefined;
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    top: `${(virtualWindow.value.start + index) * props.virtualize.itemSize}px`,
    height: `${props.virtualize.itemSize}px`,
  };
}
function handleVirtualScroll(event: Event): void {
  scrollTop.value = (event.currentTarget as HTMLElement).scrollTop;
  emit('listScroll', event, 0);
}
</script>

<template>
  <div
    :class="[
      'semi-cascader-option-lists',
      direction === 'rtl' ? 'semi-cascader-option-lists-rtl' : undefined,
      data.length === 0 ? 'semi-cascader-option-lists-empty' : undefined,
    ]"
  >
    <template v-if="data.length === 0">
      <ul class="semi-cascader-option semi-cascader-option-empty">
        <span class="semi-cascader-option-label" x-semi-prop="emptyContent">
          <CascaderNodeRenderer :content="emptyContent" />
        </span>
      </ul>
    </template>
    <ul
      v-else-if="searchable"
      class="semi-cascader-option-list"
      :style="
        virtualize
          ? {
              height:
                typeof virtualize.height === 'number'
                  ? `${virtualize.height}px`
                  : virtualize.height,
              width:
                typeof virtualize.width === 'number' ? `${virtualize.width}px` : virtualize.width,
              overflow: 'auto',
              position: 'relative',
            }
          : undefined
      "
      @scroll="virtualize ? handleVirtualScroll($event) : emit('listScroll', $event, 0)"
    >
      <div v-if="virtualize" :style="{ height: `${virtualWindow.total}px`, position: 'relative' }">
        <template v-for="(item, index) in virtualWindow.items" :key="item.key">
          <CascaderNodeRenderer
            v-if="filterRender"
            :content="filterRender(filterRenderProps(item, virtualStyle(index)))"
          />
          <li
            v-else
            role="menuitem"
            :class="itemClasses(item, true)"
            :style="virtualStyle(index)"
            @click="handleClick($event, item)"
            @keypress="handleKeypress($event, item)"
          >
            <span class="semi-cascader-option-label">
              <CascaderNodeRenderer v-if="!multiple" :content="icon('empty')" />
              <Checkbox
                v-else
                class-name="semi-cascader-option-label-checkbox"
                :checked="checkedKeys.has(item.key)"
                :disabled="isDisabled(item)"
                :indeterminate="halfCheckedKeys.has(item.key)"
                @change="handleCheck($event, item)"
              />
              <CascaderNodeRenderer :content="highlighted(item.searchText)" />
            </span>
          </li>
        </template>
      </div>
      <template v-for="item in data as CascaderFilterData[]" v-else :key="item.key">
        <CascaderNodeRenderer
          v-if="filterRender"
          :content="filterRender(filterRenderProps(item))"
        />
        <li
          v-else
          role="menuitem"
          :class="itemClasses(item, true)"
          @click="handleClick($event, item)"
          @keypress="handleKeypress($event, item)"
        >
          <span class="semi-cascader-option-label">
            <CascaderNodeRenderer v-if="!multiple" :content="icon('empty')" />
            <Checkbox
              v-else
              class-name="semi-cascader-option-label-checkbox"
              :checked="checkedKeys.has(item.key)"
              :disabled="isDisabled(item)"
              :indeterminate="halfCheckedKeys.has(item.key)"
              @change="handleCheck($event, item)"
            />
            <CascaderNodeRenderer :content="highlighted(item.searchText)" />
          </span>
        </li>
      </template>
    </ul>
    <ul
      v-for="(column, columnIndex) in columns"
      v-else
      :key="column[0]?.key ?? columnIndex"
      role="menu"
      class="semi-cascader-option-list"
      @scroll="emit('listScroll', $event, columnIndex)"
    >
      <li
        v-for="item in column"
        :id="`cascaderItem-${item.key}`"
        :key="item.key"
        role="menuitem"
        :aria-disabled="Boolean(item.data.disabled)"
        :aria-expanded="activeKeys.has(item.key)"
        :aria-haspopup="Boolean(item.children?.length || (loadData && !item.data.isLeaf))"
        :aria-owns="item.parentKey ? `cascaderItem-${item.parentKey}` : undefined"
        :class="itemClasses(item, false)"
        @click="handleClick($event, item)"
        @keypress="handleKeypress($event, item)"
        @mouseenter="handleHover($event, item)"
      >
        <span class="semi-cascader-option-label">
          <CascaderNodeRenderer
            v-if="!multiple"
            :content="icon(selectedKeys.has(item.key) ? 'tick' : 'empty')"
          />
          <Checkbox
            v-else
            class-name="semi-cascader-option-label-checkbox"
            :checked="checkedKeys.has(item.key)"
            :disabled="Boolean(item.data.disabled)"
            :indeterminate="halfCheckedKeys.has(item.key)"
            @change="handleCheck($event, item)"
          />
          <span><CascaderNodeRenderer :content="item.data.label" /></span>
        </span>
        <CascaderNodeRenderer
          v-if="item.children?.length || (loadData && !item.data.isLeaf)"
          :content="
            icon(loadingKeys.has(item.key) && !loadedKeys.has(item.key) ? 'loading' : 'child', true)
          "
        />
      </li>
    </ul>
  </div>
</template>
