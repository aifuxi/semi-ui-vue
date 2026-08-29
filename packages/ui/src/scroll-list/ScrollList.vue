<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';

import ScrollListNodeRenderer from './ScrollListNodeRenderer';
import type { ScrollListProps, ScrollListSlots } from './types';

defineOptions({ inheritAttrs: false });
const props = defineProps<ScrollListProps>();
defineSlots<ScrollListSlots>();

const attrs = useAttrs();
const slots = useSlots();
const prefix = computed(() => props.prefixCls || 'semi-scrolllist');
const rootDataAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key.startsWith('data-'))),
);
const headerAlias = computed(
  () => (attrs['x-semi-header-alias'] as string | undefined) ?? 'header',
);
const footerAlias = computed(
  () => (attrs['x-semi-footer-alias'] as string | undefined) ?? 'footer',
);
const hasHeader = computed(() => Boolean(slots.header || props.header));
const hasFooter = computed(() => Boolean(slots.footer || props.footer));
const bodyHeight = computed(() =>
  typeof props.bodyHeight === 'number' ? `${props.bodyHeight}px` : props.bodyHeight || '',
);
</script>

<template>
  <div :class="[prefix, props.className, props.class]" :style="props.style" v-bind="rootDataAttrs">
    <div v-if="hasHeader" :class="`${prefix}-header`">
      <div :class="`${prefix}-header-title`" :x-semi-prop="headerAlias">
        <slot name="header"><ScrollListNodeRenderer :content="props.header" /></slot>
      </div>
      <div :class="`${prefix}-line`" />
    </div>
    <div :class="`${prefix}-body`" :style="{ height: bodyHeight }" x-semi-prop="children">
      <slot />
    </div>
    <div v-if="hasFooter" :class="`${prefix}-footer`" :x-semi-prop="footerAlias">
      <slot name="footer"><ScrollListNodeRenderer :content="props.footer" /></slot>
    </div>
  </div>
</template>
