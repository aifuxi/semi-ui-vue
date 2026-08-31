<script setup lang="ts">
import { computed, provide } from 'vue';

import zhCN from './source/zh_CN';
import { localeContextKey } from './locale-context';
import type { LocaleProviderProps, LocaleProviderSlots } from './types';

defineOptions({ name: 'LocaleProvider', inheritAttrs: false });
const props = defineProps<LocaleProviderProps>();
defineSlots<LocaleProviderSlots>();

const locale = computed(() => props.locale ?? zhCN);
provide(localeContextKey, locale);
</script>

<template>
  <slot />
</template>
