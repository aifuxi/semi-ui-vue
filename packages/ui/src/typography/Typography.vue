<script setup lang="ts">
import { computed, useAttrs } from 'vue';

import type { TypographyProps, TypographySlots } from './types';

defineOptions({ name: 'Typography', inheritAttrs: false });
const props = withDefaults(defineProps<TypographyProps>(), { component: 'article' });
defineSlots<TypographySlots>();
const attrs = useAttrs();
const classes = computed(() => ['semi-typography', attrs.class]);
const rootAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'class')),
);
</script>

<template>
  <component :is="props.component" v-bind="rootAttrs" :class="classes"><slot /></component>
</template>
