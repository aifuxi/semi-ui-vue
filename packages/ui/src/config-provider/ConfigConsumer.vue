<script setup lang="ts">
import { computed, inject } from 'vue';

import { configContextKey } from './config-context';
import {
  DEFAULT_BREAKPOINT_SCREENS,
  DEFAULT_CONFIG_LOCALE,
  defaultResponsiveMap,
} from './constants';
import type { ConfigConsumerSlots, ConfigContextValue } from './types';

defineOptions({ name: 'ConfigConsumer', inheritAttrs: false });
defineSlots<ConfigConsumerSlots>();

const fallback = computed<ConfigContextValue>(() => ({
  direction: 'ltr',
  locale: DEFAULT_CONFIG_LOCALE,
  responsiveObserve: false,
  responsiveMap: defaultResponsiveMap,
  onBreakpoint: ((): (() => void) => () => undefined) as ConfigContextValue['onBreakpoint'],
  screens: DEFAULT_BREAKPOINT_SCREENS,
}));
const injected = inject(configContextKey, fallback);
const context = computed(() => injected.value);
</script>

<template>
  <slot v-bind="context" />
</template>
