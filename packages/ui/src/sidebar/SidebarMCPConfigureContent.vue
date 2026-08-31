<script setup lang="ts">
import { IconEdit, IconMinus, IconPlus, IconSearch, IconSetting } from '@aifuxi/semi-icons-vue';
import {
  SidebarMCPConfigureFoundation,
  type SidebarMCPConfigureAdapter,
  type SidebarMCPFoundationProps,
  type SidebarMCPFoundationState,
  type SidebarMCPMode,
  type SidebarMCPOption as FoundationMCPOption,
} from '@workspace/foundation-integration';
import { IllustrationNoContent, IllustrationNoContentDark } from '@aifuxi/semi-illustrations-vue';
import { computed, markRaw, shallowReactive, useSlots, watch, type VNodeChild } from 'vue';
import type { RadioChangeEvent } from '../radio';

import { Button } from '../button';
import { Empty } from '../empty';
import { Input } from '../input';
import { LocaleConsumer } from '../locale';
import { Radio, RadioGroup } from '../radio';
import { Tooltip } from '../tooltip';
import SidebarNodeRenderer from './SidebarNodeRenderer';
import type {
  SidebarLocale,
  SidebarMCPConfigureContentEmits,
  SidebarMCPConfigureContentProps,
  SidebarMCPConfigureContentSlots,
  SidebarMCPOption,
} from './types';

defineOptions({ name: 'SidebarMCPConfigureContent' });
const props = defineProps<SidebarMCPConfigureContentProps>();
const emit = defineEmits<SidebarMCPConfigureContentEmits>();
defineSlots<SidebarMCPConfigureContentSlots>();
const slots = useSlots();

const state = shallowReactive<SidebarMCPFoundationState>({
  mode: 'inner',
  inputValue: '',
  showOptions: [...(props.options ?? [])],
  cachedOptions: props.options ?? [],
  cachedCustomOptions: props.customOptions ?? [],
});
const foundationProps = computed<SidebarMCPFoundationProps>(() => ({
  ...(props.options === undefined ? {} : { options: props.options as FoundationMCPOption[] }),
  ...(props.customOptions === undefined
    ? {}
    : { customOptions: props.customOptions as FoundationMCPOption[] }),
  ...(props.filter === undefined
    ? {}
    : { filter: props.filter as NonNullable<SidebarMCPFoundationProps['filter']> }),
}));
const cache = new Map<unknown, unknown>();

const adapter: SidebarMCPConfigureAdapter = {
  getContext: () => undefined,
  getContexts: () => ({}),
  getProp: (key) => foundationProps.value[key],
  getProps: () => foundationProps.value,
  getState: (key) => state[key],
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
  notifyConfigureClick: (event, option) => {
    const typedOption = option as SidebarMCPOption;
    emit('configure-click', event, typedOption);
  },
  notifyEditClick: (event, option) => {
    const typedOption = option as SidebarMCPOption;
    emit('edit-click', event, typedOption);
  },
  notifyStatusChange: (options, custom) => {
    const typedOptions = options as SidebarMCPOption[];
    emit('status-change', typedOptions, custom);
  },
  notifyAddClick: (event) => {
    emit('add-click', event);
  },
};
const foundation = markRaw(new SidebarMCPConfigureFoundation(adapter));

const showOptions = computed(() => state.showOptions as SidebarMCPOption[]);
const isCustom = computed(() => state.mode === 'custom');
const total = computed(() => (props.options?.length ?? 0) + (props.customOptions?.length ?? 0));
const activeCount = computed(
  () =>
    [...(props.options ?? []), ...(props.customOptions ?? [])].filter((option) => option.active)
      .length,
);

function handleSearch(value: string): void {
  foundation.handleSearch(value);
  emit('search', value, isCustom.value);
}
function handleInput(event: Event): void {
  handleSearch((event.target as HTMLInputElement).value);
}
function handleModeChange(event: RadioChangeEvent): void {
  const mode = event.target.value as SidebarMCPMode;
  foundation.handleModeChange({ target: { value: mode } });
}
function customItem(option: SidebarMCPOption): VNodeChild {
  const payload = { option, custom: isCustom.value };
  return slots.item?.(payload) ?? props.renderItem?.(payload);
}

watch(
  () => props.options,
  (options) => {
    state.cachedOptions = (options ?? []) as FoundationMCPOption[];
    if (state.mode === 'inner') foundation.updateShowOptions(state.inputValue, 'inner');
  },
);
watch(
  () => props.customOptions,
  (options) => {
    state.cachedCustomOptions = (options ?? []) as FoundationMCPOption[];
    if (state.mode === 'custom') foundation.updateShowOptions(state.inputValue, 'custom');
  },
);
</script>

<template>
  <LocaleConsumer v-slot="{ localeData }" component-name="Sidebar">
    <div
      :class="['semi-sidebar-mcp-configure-content', props.class, props.className]"
      :style="props.style"
    >
      <div class="semi-sidebar-mcp-configure-content-header">
        <RadioGroup type="button" :value="state.mode" @change="handleModeChange">
          <Radio value="inner">MCP Servers</Radio>
          <Radio value="custom">{{ (localeData as SidebarLocale | undefined)?.newMcpAdd }}</Radio>
        </RadioGroup>
        <span class="semi-sidebar-mcp-configure-content-header-count">
          {{ (localeData as SidebarLocale | undefined)?.activeMCPNumber }} {{ activeCount }}/{{
            total
          }}
        </span>
      </div>

      <template v-if="!isCustom || (props.customOptions?.length ?? 0) > 0">
        <div
          class="semi-sidebar-mcp-configure-content-search"
          :class="{ 'semi-sidebar-mcp-configure-content-search-container': isCustom }"
        >
          <Input
            :value="state.inputValue"
            :placeholder="
              props.placeholder ??
              (localeData as SidebarLocale | undefined)?.searchPlaceholder ??
              ''
            "
            @input="handleInput"
          >
            <template #prefix><IconSearch /></template>
          </Input>
          <Button v-if="isCustom" theme="solid" type="primary" @click="foundation.handleAddClick">
            <template #icon><IconPlus /></template>
            {{ (localeData as SidebarLocale | undefined)?.newMcpAdd }}
          </Button>
        </div>
      </template>
      <Empty
        v-else
        class="semi-sidebar-mcp-configure-content-custom-empty"
        :description="(localeData as SidebarLocale | undefined)?.emptyCustomMcpInfo"
      >
        <template #image><IllustrationNoContent style="width: 150px; height: 150px" /></template>
        <template #darkModeImage
          ><IllustrationNoContentDark style="width: 150px; height: 150px"
        /></template>
        <Button theme="solid" type="primary" @click="foundation.handleAddClick">
          <template #icon><IconPlus /></template>
          {{ (localeData as SidebarLocale | undefined)?.newMcpAdd }}
        </Button>
      </Empty>

      <div class="semi-sidebar-mcp-configure-content-item-container">
        <template v-for="option in showOptions" :key="option.value">
          <SidebarNodeRenderer
            v-if="slots.item || props.renderItem"
            :content="customItem(option)"
          />
          <div v-else class="semi-sidebar-mcp-configure-content-item">
            <img
              v-if="typeof option.icon === 'string'"
              class="semi-sidebar-mcp-configure-content-item-sign"
              :src="option.icon"
              :alt="option.label"
            />
            <div v-else class="semi-sidebar-mcp-configure-content-item-sign">
              <SidebarNodeRenderer :content="option.icon" />
            </div>
            <div class="semi-sidebar-mcp-configure-content-item-content">
              <div class="semi-sidebar-mcp-configure-content-item-content-label">
                {{ option.label }}
              </div>
              <div class="semi-sidebar-mcp-configure-content-item-content-desc">
                <SidebarNodeRenderer :content="option.desc" />
              </div>
            </div>
            <Button
              v-if="option.configure"
              class="semi-sidebar-mcp-configure-content-item-button semi-sidebar-mcp-configure-content-item-button-configure"
              @click="foundation.onConfigureButtonClick($event, option as FoundationMCPOption)"
              ><template #icon><IconSetting /></template
            ></Button>
            <Button
              v-if="isCustom"
              class="semi-sidebar-mcp-configure-content-item-button semi-sidebar-mcp-configure-content-item-button-configure"
              @click="foundation.onEditButtonClick($event, option as FoundationMCPOption)"
              ><template #icon><IconEdit /></template
            ></Button>
            <Tooltip
              v-if="option.disabled"
              :content="(localeData as SidebarLocale | undefined)?.defaultMcpInfo"
            >
              <span>
                <Button class="semi-sidebar-mcp-configure-content-item-button" disabled>
                  <template #icon><IconMinus v-if="option.active" /><IconPlus v-else /></template>
                </Button>
              </span>
            </Tooltip>
            <Button
              v-else
              class="semi-sidebar-mcp-configure-content-item-button"
              :theme="option.active ? 'light' : 'solid'"
              type="primary"
              @click="foundation.handleStatusChange(option as FoundationMCPOption, !option.active)"
              ><template #icon><IconMinus v-if="option.active" /><IconPlus v-else /></template
            ></Button>
          </div>
        </template>
      </div>
    </div>
  </LocaleConsumer>
</template>
