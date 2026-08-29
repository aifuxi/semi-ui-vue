<script setup lang="ts">
import { Toast, type ConfigDirection } from '@workspace/ui';
import { onBeforeUnmount, onMounted } from 'vue';

const props = withDefaults(defineProps<{ direction?: ConfigDirection }>(), {
  direction: 'ltr',
});
let timer: number | undefined;

onMounted(() => {
  Toast.destroyAll();
  Toast.info({
    className: 'toast-scenario__info',
    content: '同步已完成',
    direction: props.direction,
    duration: 0,
    motion: false,
  });
  timer = window.setTimeout(() => {
    Toast.warning({
      className: 'toast-scenario__warning',
      content: '访问凭证即将过期',
      direction: props.direction,
      duration: 0,
      motion: false,
      theme: 'light',
    });
  });
});
onBeforeUnmount(() => {
  if (timer !== undefined) window.clearTimeout(timer);
  Toast.destroyAll();
});
</script>

<template>
  <div class="toast-scenario" data-testid="toast-vue">
    <p>Toast 渲染在当前 viewport 顶部中央。</p>
  </div>
</template>
