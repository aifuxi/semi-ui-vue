<script setup lang="ts">
import { computed } from 'vue';

import type { SkeletonParagraphProps } from './types';

defineOptions({ name: 'SkeletonParagraph', inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonParagraphProps>(), {
  className: '',
  prefixCls: 'semi-skeleton',
  rows: 4,
});
const rowKeys = computed(() => [...Array(props.rows).keys()]);
</script>

<template>
  <ul :class="[`${props.prefixCls}-paragraph`, props.class, props.className]" :style="props.style">
    <li v-for="row in rowKeys" :key="row" />
  </ul>
</template>
