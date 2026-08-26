<script setup lang="ts">
import type { LayoutSectionProps, LayoutSlots } from './types';
import LayoutSection from './LayoutSection.vue';

defineOptions({
  name: 'LayoutContent',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<LayoutSectionProps>(), {
  prefixCls: 'semi-layout',
  tagName: 'main',
});
defineSlots<LayoutSlots>();
</script>

<template>
  <LayoutSection
    v-bind="$attrs"
    :prefix-cls="props.prefixCls"
    :tag-name="props.tagName"
    type="content"
    default-tag-name="main"
  >
    <slot />
  </LayoutSection>
</template>
