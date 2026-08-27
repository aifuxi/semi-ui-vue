<script setup lang="ts">
import { computed, provide } from 'vue';

import { typographyLocaleKey } from '../typography';

import { configContextKey } from './config-context';
import { DEFAULT_CONFIG_LOCALE, defaultResponsiveMap } from './constants';
import type { ConfigContextValue, ConfigProviderProps, ConfigProviderSlots } from './types';
import { useResponsiveObserve } from './use-responsive-observe';

defineOptions({ name: 'ConfigProvider', inheritAttrs: false });
const props = withDefaults(defineProps<ConfigProviderProps>(), {
  direction: 'ltr',
  locale: () => DEFAULT_CONFIG_LOCALE,
  responsiveObserve: false,
  responsiveMap: () => defaultResponsiveMap,
});
defineSlots<ConfigProviderSlots>();

const responsiveObserve = computed(() => props.responsiveObserve);
const responsiveMap = computed(() => props.responsiveMap);
const { screens, onBreakpoint } = useResponsiveObserve(responsiveObserve, responsiveMap);
const context = computed<ConfigContextValue>(() => ({
  direction: props.direction,
  timeZone: props.timeZone,
  locale: props.locale,
  getPopupContainer: props.getPopupContainer,
  responsiveObserve: props.responsiveObserve,
  responsiveMap: props.responsiveMap,
  onBreakpoint,
  screens: screens.value,
}));
const typographyLocale = computed(
  () => props.locale.Typography ?? DEFAULT_CONFIG_LOCALE.Typography!,
);

provide(configContextKey, context);
provide(typographyLocaleKey, typographyLocale);
</script>

<template>
  <div v-if="props.direction === 'rtl'" class="semi-rtl"><slot /></div>
  <slot v-else />
</template>
