<script setup lang="ts">
import { useAttrs } from 'vue';

import type { SkeletonAvatarProps } from './types';

defineOptions({ name: 'SkeletonAvatar', inheritAttrs: false });
const props = withDefaults(defineProps<SkeletonAvatarProps>(), {
  className: '',
  prefixCls: 'semi-skeleton',
  shape: 'circle',
  size: 'medium',
});
const attrs = useAttrs();
</script>

<template>
  <div
    v-bind="attrs"
    :class="[
      `${props.prefixCls}-avatar`,
      `${props.prefixCls}-avatar-${props.size}`,
      `${props.prefixCls}-avatar-${props.shape}`,
      props.class,
      props.className,
    ]"
    :style="props.style"
  />
</template>
