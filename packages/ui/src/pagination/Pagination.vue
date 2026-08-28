<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@workspace/icons';
import {
  PaginationFoundation,
  type PaginationAdapter,
  type PaginationPageListState,
} from '@workspace/foundation-integration';
import {
  computed,
  getCurrentInstance,
  inject,
  markRaw,
  onBeforeUnmount,
  shallowReactive,
  useAttrs,
  useSlots,
  watch,
} from 'vue';

import { configContextKey, type ConfigContextValue } from '../config-provider';
import InputNumber from '../input-number/InputNumber.vue';
import Select from '../select/Select.vue';
import SelectOption from '../select/SelectOption.vue';
import type { TooltipPosition } from '../tooltip';
import PaginationNodeRenderer from './PaginationNodeRenderer';
import PaginationPopover from './PaginationPopover.vue';
import PaginationRestList from './PaginationRestList.vue';
import type {
  PaginationEmits,
  PaginationLocale,
  PaginationPage,
  PaginationProps,
  PaginationSlots,
} from './types';

const DEFAULT_ZH_CN_LOCALE: Readonly<PaginationLocale> = Object.freeze({
  pageSize: '每页条数：${pageSize}',
  total: '总页数：${total}',
  jumpTo: '跳至',
  page: '页',
});
const DEFAULT_EN_US_LOCALE: Readonly<PaginationLocale> = Object.freeze({
  pageSize: 'Items per page: ${pageSize}',
  total: 'Total pages: ${total}',
  jumpTo: 'Jump to',
  page: ' page',
});
const DEFAULT_PAGE_SIZE_OPTIONS = Object.freeze([10, 20, 40, 100]);

defineOptions({ name: 'Pagination', inheritAttrs: false });
const props = defineProps<PaginationProps>();
const emit = defineEmits<PaginationEmits>();
defineSlots<PaginationSlots>();
const attrs = useAttrs();
const slots = useSlots();
const instance = getCurrentInstance();
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
const currentPageControlled = computed(() => hasRawProp('currentPage'));
const controlled = computed(() => modelControlled.value || currentPageControlled.value);
const incomingCurrentPage = computed(() =>
  modelControlled.value ? props.modelValue : props.currentPage,
);
const total = computed(() => props.total ?? 1);
const pageSizeOptions = computed(() => props.pageSizeOpts ?? [...DEFAULT_PAGE_SIZE_OPTIONS]);
const initialPageSize = props.pageSize || pageSizeOptions.value[0] || 10;
const initialCurrentPage = incomingCurrentPage.value || props.defaultCurrentPage || 1;

interface PaginationState {
  total: number;
  showTotal: boolean;
  currentPage: number;
  pageSize: number;
  pageList: PaginationPage[];
  prevDisabled: boolean;
  quickJumpPage: string | number;
  nextDisabled: boolean;
  restLeftPageList: number[];
  restRightPageList: number[];
  allPageNumbers: number[];
}

const state = shallowReactive<PaginationState>({
  total: total.value,
  showTotal: props.showTotal ?? false,
  currentPage: initialCurrentPage,
  pageSize: initialPageSize,
  pageList: [],
  prevDisabled: false,
  quickJumpPage: '',
  nextDisabled: false,
  restLeftPageList: [],
  restRightPageList: [],
  allPageNumbers:
    props.size === 'small' && props.hoverShowPageSelect && !props.disabled
      ? Array.from({ length: Math.ceil(total.value / initialPageSize) }, (_, index) => index + 1)
      : [],
});
const cache = new Map<unknown, unknown>();

type FoundationProps = PaginationProps & {
  currentPage?: number;
  disabled: boolean;
  hoverShowPageSelect: boolean;
  pageSize: number;
  pageSizeOpts: number[];
  preventPageChangeOnPageSizeChange: boolean;
  size: 'small' | 'default';
  total: number;
};

function getFoundationProps(): FoundationProps {
  const output = {
    ...props,
    currentPage: incomingCurrentPage.value,
    disabled: props.disabled ?? false,
    hoverShowPageSelect: props.hoverShowPageSelect ?? false,
    pageSize: props.pageSize || state.pageSize,
    pageSizeOpts: pageSizeOptions.value,
    preventPageChangeOnPageSizeChange: props.preventPageChangeOnPageSizeChange ?? false,
    size: props.size ?? 'default',
    total: total.value,
  } as FoundationProps;
  if (!controlled.value) delete output.currentPage;
  return output;
}

const adapter: PaginationAdapter<FoundationProps, PaginationState> = {
  getContext: () => undefined,
  getContexts: () => undefined,
  getProp: (key) => getFoundationProps()[key],
  getProps: getFoundationProps,
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
  setPageList: (pageState: PaginationPageListState) => Object.assign(state, pageState),
  setDisabled: (previous, next) => {
    state.prevDisabled = previous;
    state.nextDisabled = next;
  },
  updateTotal: (value) => {
    state.total = value;
  },
  updatePageSize: (value) => {
    state.pageSize = value;
  },
  updateQuickJumpPage: (value) => {
    state.quickJumpPage = value;
  },
  updateAllPageNumbers: (value) => {
    state.allPageNumbers = value;
  },
  setCurrentPage: (value) => {
    state.currentPage = value;
  },
  registerKeyDownHandler: (handler) => {
    if (typeof document !== 'undefined') document.addEventListener('keydown', handler);
  },
  unregisterKeyDownHandler: (handler) => {
    if (typeof document !== 'undefined') document.removeEventListener('keydown', handler);
  },
  notifyPageChange: (value) => {
    emit('pageChange', value);
    emit('update:currentPage', value);
    emit('update:modelValue', value);
  },
  notifyPageSizeChange: (value) => {
    emit('pageSizeChange', value);
    emit('update:pageSize', value);
  },
  notifyChange: (page, pageSize) => emit('change', page, pageSize),
};

const foundation = markRaw(new PaginationFoundation<FoundationProps, PaginationState>(adapter));
foundation.init();
onBeforeUnmount(() => foundation.destroy());

watch(
  () => [incomingCurrentPage.value, total.value, props.pageSize] as const,
  ([nextCurrentPage, nextTotal, nextPageSize]) => {
    const page = controlled.value ? nextCurrentPage || 1 : state.currentPage;
    foundation.updatePage(page, nextTotal, nextPageSize || state.pageSize);
    foundation.updateAllPageNumbers(nextTotal, nextPageSize || state.pageSize);
  },
);
watch(
  () => [props.size, props.hoverShowPageSelect, props.disabled] as const,
  () => foundation.updateAllPageNumbers(state.total, state.pageSize),
);

const locale = computed<PaginationLocale>(() => {
  const providerLocale = config.value.locale.Pagination as PaginationLocale | undefined;
  return (
    providerLocale ??
    (config.value.locale.code === 'en-US' ? DEFAULT_EN_US_LOCALE : DEFAULT_ZH_CN_LOCALE)
  );
});
const rootClass = computed(() => [
  'semi-page',
  props.size === 'small' ? 'semi-page-small' : undefined,
  props.disabled ? 'semi-page-disabled' : undefined,
  props.className,
  attrs.class,
]);
const dataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-'))),
);
const totalPages = computed(() => Math.ceil(state.total / state.pageSize));
const hidden = computed(
  () => totalPages.value < 2 && Boolean(props.hideOnSinglePage) && !props.showSizeChanger,
);
const totalText = computed(() => locale.value.total.replace('${total}', String(totalPages.value)));
const sizeOptions = computed(() => foundation.pageSizeInOpts());
const defaultSelectPosition = computed(() =>
  config.value.direction === 'rtl' ? 'bottomRight' : 'bottomLeft',
);

function isItemDisabled(kind: 'prev' | 'next'): boolean {
  return Boolean(props.disabled || (kind === 'prev' ? state.prevDisabled : state.nextDisabled));
}

function selectPage(page: PaginationPage): void {
  if (!props.disabled) foundation.goPage(page);
}

function restPages(page: PaginationPage, index: number): number[] {
  if (page !== '...') return [];
  return index < 3 ? state.restLeftPageList : state.restRightPageList;
}

function popoverBindings(): {
  position?: TooltipPosition;
  rePosKey?: number;
  zIndex: number;
} {
  return {
    ...(props.popoverPosition === undefined ? {} : { position: props.popoverPosition }),
    ...(props.currentPage === undefined ? {} : { rePosKey: props.currentPage }),
    zIndex: props.popoverZIndex ?? 1030,
  };
}

function handleQuickJumpChange(value: string | number): void {
  foundation.handleQuickJumpNumberChange(value);
}

function handleQuickJumpKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    foundation.handleQuickJumpEnterPress((event.target as HTMLInputElement).value);
  }
}
</script>

<template>
  <component
    :is="props.size === 'small' ? 'div' : 'ul'"
    v-if="!hidden"
    v-bind="dataAttrs"
    :class="rootClass"
    :style="props.style"
  >
    <span v-if="props.size !== 'small' && props.showTotal" class="semi-page-total">{{
      totalText
    }}</span>

    <li
      role="button"
      :aria-disabled="isItemDisabled('prev')"
      aria-label="Previous"
      class="semi-page-item semi-page-prev"
      :class="{ 'semi-page-item-disabled': isItemDisabled('prev') }"
      x-semi-prop="prevText"
      @click="!isItemDisabled('prev') && foundation.goPrev()"
    >
      <slot v-if="slots.prev" name="prev" />
      <PaginationNodeRenderer v-else-if="props.prevText" :content="props.prevText" />
      <IconChevronLeft v-else size="large" />
    </li>

    <template v-if="props.size === 'small'">
      <PaginationPopover v-if="props.hoverShowPageSelect && !props.disabled">
        <div class="semi-page-item semi-page-item-small">
          <PaginationNodeRenderer :content="state.currentPage" /><PaginationNodeRenderer
            content="/"
          /><PaginationNodeRenderer :content="totalPages" /><PaginationNodeRenderer content=" " />
        </div>
        <template #content>
          <PaginationRestList
            :direction="config.direction"
            :pages="state.allPageNumbers"
            @select="selectPage"
          />
        </template>
      </PaginationPopover>
      <div
        v-else
        class="semi-page-item semi-page-item-small"
        :class="{ 'semi-page-item-all-disabled': props.disabled }"
      >
        <PaginationNodeRenderer :content="state.currentPage" /><PaginationNodeRenderer
          content="/"
        /><PaginationNodeRenderer :content="totalPages" /><PaginationNodeRenderer content=" " />
      </div>
    </template>

    <template v-else>
      <template v-for="(page, index) in state.pageList" :key="`${page}-${index}`">
        <PaginationPopover v-if="page === '...' && !props.disabled" v-bind="popoverBindings()">
          <li class="semi-page-item" aria-label="More">...</li>
          <template #content>
            <PaginationRestList
              :direction="config.direction"
              :pages="restPages(page, index)"
              @select="selectPage"
            />
          </template>
        </PaginationPopover>
        <li
          v-else
          class="semi-page-item"
          :class="{
            'semi-page-item-active': state.currentPage === page,
            'semi-page-item-all-disabled': props.disabled,
            'semi-page-item-all-disabled-active': state.currentPage === page && props.disabled,
          }"
          :aria-label="page === '...' ? 'More' : `Page ${page}`"
          :aria-current="state.currentPage === page ? 'page' : undefined"
          @click="selectPage(page)"
        >
          {{ page }}
        </li>
      </template>
    </template>

    <li
      role="button"
      :aria-disabled="isItemDisabled('next')"
      aria-label="Next"
      class="semi-page-item semi-page-next"
      :class="{ 'semi-page-item-disabled': isItemDisabled('next') }"
      x-semi-prop="nextText"
      @click="!isItemDisabled('next') && foundation.goNext()"
    >
      <slot v-if="slots.next" name="next" />
      <PaginationNodeRenderer v-else-if="props.nextText" :content="props.nextText" />
      <IconChevronRight v-else size="large" />
    </li>

    <div v-if="props.size !== 'small' && props.showSizeChanger" class="semi-page-switch">
      <Select
        aria-label="Page size selector"
        click-to-hide
        :disabled="props.disabled"
        dropdown-class-name="semi-page-select-dropdown"
        :position="props.popoverPosition ?? defaultSelectPosition"
        :value="state.pageSize"
        :z-index="props.popoverZIndex ?? 1030"
        @change="(value) => foundation.changePageSize(Number(value))"
      >
        <SelectOption v-for="option in sizeOptions" :key="option" :value="option">
          <span>{{ locale.pageSize.replace('${pageSize}', String(option)) }}</span>
        </SelectOption>
      </Select>
    </div>

    <div
      v-if="props.showQuickJumper"
      class="semi-page-quickjump"
      :class="{
        'semi-page-quickjump-disabled': totalPages === 1 || props.disabled,
      }"
    >
      <span>{{ locale.jumpTo }}</span>
      <InputNumber
        class-name="semi-page-quickjump-input-number"
        :disabled="totalPages === 1 || props.disabled"
        hide-buttons
        :value="state.quickJumpPage"
        @blur="foundation.handleQuickJumpBlur()"
        @change="handleQuickJumpChange"
        @keydown="handleQuickJumpKeydown"
      />
      <span>{{ locale.page }}</span>
    </div>
  </component>
</template>
