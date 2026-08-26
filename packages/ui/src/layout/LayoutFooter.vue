<script setup lang="ts">
import type { LayoutSectionProps, LayoutSlots } from './types';
import LayoutSection from './LayoutSection.vue';

defineOptions({
  name: 'LayoutFooter',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LayoutSectionProps>(), {
  prefixCls: 'semi-layout',
  tagName: 'footer',
});
defineSlots<LayoutSlots>();
</script>

<template>
  <LayoutSection
    v-bind="$attrs"
    :prefix-cls="props.prefixCls"
    :tag-name="props.tagName"
    type="footer"
    default-tag-name="footer"
  >
    <slot />
  </LayoutSection>
</template>
