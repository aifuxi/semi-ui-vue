<script setup lang="ts" generic="ComponentLocale = unknown">
import { computed, inject } from 'vue';

import { configContextKey } from '../config-provider';
import zhCN from './source/zh_CN';
import { localeContextKey } from './locale-context';
import type { LocaleConsumerProps, LocaleConsumerSlotProps, LocaleConsumerSlots } from './types';

defineOptions({ name: 'LocaleConsumer', inheritAttrs: false });
const props = defineProps<LocaleConsumerProps>();
defineSlots<LocaleConsumerSlots<ComponentLocale>>();

const config = inject(configContextKey, null);
const providedLocale = inject(
  localeContextKey,
  computed(() => zhCN),
);
const locale = computed(() => {
  const candidate = config?.value.locale ?? providedLocale.value;
  return candidate.code ? candidate : zhCN;
});
const slotProps = computed<LocaleConsumerSlotProps<ComponentLocale>>(() => ({
  localeData: locale.value[props.componentName] as ComponentLocale,
  localeCode: locale.value.code!,
  dateFnsLocale: locale.value.dateFnsLocale ?? zhCN.dateFnsLocale!,
  currency: locale.value.currency,
}));
</script>

<template>
  <slot v-bind="slotProps" />
</template>
