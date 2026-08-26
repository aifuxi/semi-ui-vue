<script setup lang="ts">
import type { LayoutSectionProps, LayoutSlots } from './types';
import LayoutSection from './LayoutSection.vue';

defineOptions({
  name: 'LayoutHeader',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LayoutSectionProps>(), {
  prefixCls: 'semi-layout',
  tagName: 'header',
});
defineSlots<LayoutSlots>();
</script>

<template>
  <LayoutSection
    v-bind="$attrs"
    :prefix-cls="props.prefixCls"
    :tag-name="props.tagName"
    type="header"
    default-tag-name="header"
  >
    <slot />
  </LayoutSection>
</template>
