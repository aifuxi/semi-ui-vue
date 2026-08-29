<script setup lang="ts">
import { useAttrs } from 'vue';

import type { SkeletonBasicProps } from './types';

defineOptions({ name: 'SkeletonButton', inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonBasicProps>(), {
  className: '',
  prefixCls: 'semi-skeleton',
});
const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="[`${props.prefixCls}-button`, props.class, props.className]"
    :style="props.style"
  />
</template>
