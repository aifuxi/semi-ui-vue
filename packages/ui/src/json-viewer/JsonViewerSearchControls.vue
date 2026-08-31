<script setup lang="ts">
import {
  IconCaseSensitive,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconRegExp,
  IconWholeWord,
} from '@aifuxi/semi-icons-vue';
import { nextTick, shallowRef, useTemplateRef } from 'vue';

import { Button, ButtonGroup } from '../button';
import { Input } from '../input';
import type { JsonViewerLocale, JsonViewerSearchOptions } from './types';

defineOptions({ name: 'JsonViewerSearchControls', inheritAttrs: false });
const props = defineProps<{
  locale: JsonViewerLocale;
  options: JsonViewerSearchOptions;
  readOnly: boolean;
}>();
const emit = defineEmits<{
  close: [];
  next: [];
  option: [key: keyof JsonViewerSearchOptions];
  previous: [];
  replace: [value: string];
  replaceAll: [value: string];
  search: [value: string];
}>();

const searchValue = shallowRef('');
const replaceValue = shallowRef('');
const isComposing = shallowRef(false);
const searchInputRef = useTemplateRef<{ focus(): void }>('searchInput');
const prefixCls = 'semi-json-viewer';

function handleSearchChange(value: string): void {
  searchValue.value = value;
  if (!isComposing.value) emit('search', value);
}

function handleCompositionStart(): void {
  isComposing.value = true;
}

function handleCompositionEnd(): void {
  isComposing.value = false;
  emit('search', searchValue.value);
  void nextTick(() => searchInputRef.value?.focus());
}

function toggleOption(key: keyof JsonViewerSearchOptions): void {
  emit('option', key);
}
</script>

<template>
  <div
    :class="`${prefixCls}-search-bar-container`"
    style="position: absolute; top: 20px; right: 20px"
  >
    <div :class="`${prefixCls}-search-bar`">
      <Input
        ref="searchInput"
        v-model="searchValue"
        :aria-label="props.locale.search"
        :placeholder="props.locale.search"
        :class-name="`${prefixCls}-search-bar-input`"
        @change="handleSearchChange"
        @composition-start="handleCompositionStart"
        @composition-end="handleCompositionEnd"
      />
      <ul :class="`${prefixCls}-search-options`">
        <li
          v-for="item in [
            { key: 'caseSensitive' as const, label: 'Case sensitive', icon: IconCaseSensitive },
            { key: 'regex' as const, label: 'Regular expression', icon: IconRegExp },
            { key: 'wholeWord' as const, label: 'Whole word', icon: IconWholeWord },
          ]"
          :key="item.key"
          :aria-label="item.label"
          :aria-pressed="props.options[item.key]"
          :class="[
            `${prefixCls}-search-options-item`,
            props.options[item.key] ? `${prefixCls}-search-options-item-active` : undefined,
          ]"
          role="button"
          tabindex="0"
          @click="toggleOption(item.key)"
          @keydown.enter.prevent="toggleOption(item.key)"
          @keydown.space.prevent="toggleOption(item.key)"
        >
          <component :is="item.icon" />
        </li>
      </ul>
      <ButtonGroup>
        <Button :aria-label="'Previous result'" @click="emit('previous')">
          <template #icon><IconChevronLeft /></template>
        </Button>
        <Button :aria-label="'Next result'" @click="emit('next')">
          <template #icon><IconChevronRight /></template>
        </Button>
      </ButtonGroup>
      <Button
        aria-label="Close search"
        size="small"
        theme="borderless"
        type="tertiary"
        @click="emit('close')"
      >
        <template #icon><IconClose /></template>
      </Button>
    </div>
    <div :class="`${prefixCls}-replace-bar`">
      <Input
        v-model="replaceValue"
        :aria-label="props.locale.replace"
        :placeholder="props.locale.replace"
        :class-name="`${prefixCls}-replace-bar-input`"
      />
      <Button
        :disabled="props.readOnly"
        style="width: fit-content"
        @click="emit('replace', replaceValue)"
      >
        {{ props.locale.replace }}
      </Button>
      <Button
        :disabled="props.readOnly"
        style="width: fit-content"
        @click="emit('replaceAll', replaceValue)"
      >
        {{ props.locale.replaceAll }}
      </Button>
    </div>
  </div>
</template>
