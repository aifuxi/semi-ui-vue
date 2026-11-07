<script setup lang="ts">
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import { type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
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
    stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
  });
  timer = window.setTimeout(() => {
    Toast.warning({
      className: 'toast-scenario__warning',
      content: '访问凭证即将过期',
      direction: props.direction,
      duration: 0,
      motion: false,
      stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
      theme: 'light',
    });
  });
  // 独立查询展开全部语义类型与主题，默认验收场景保持原样。
  if (new URLSearchParams(window.location.search).get('messageState') === 'matrix') {
    for (const theme of ['normal', 'light'] as const) {
      for (const type of ['info', 'success', 'warning', 'error'] as const) {
        Toast[type]({
          className: 'toast-scenario__matrix',
          content: `${theme} / ${type} 消息内容`,
          direction: props.direction,
          duration: 0,
          motion: false,
          stack: new URLSearchParams(window.location.search).get('toastStack') === 'true',
          theme,
        });
      }
    }
  }
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
