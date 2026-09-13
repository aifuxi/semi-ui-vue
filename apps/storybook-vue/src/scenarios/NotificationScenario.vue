<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import { type ConfigDirection } from '@aifuxi/semi-ui-vue/config-provider';
import { onBeforeUnmount, onMounted } from 'vue';

const props = withDefaults(defineProps<{ direction?: ConfigDirection }>(), {
  direction: 'ltr',
});

onMounted(() => {
  Notification.destroyAll();
  const position = props.direction === 'rtl' ? 'topLeft' : 'topRight';
  Notification.info({
    className: 'notification-scenario__info',
    content: '400 个任务成功，600 个任务失败。',
    direction: props.direction,
    duration: 0,
    position,
    title: '任务已完成',
  });
  Notification.warning({
    className: 'notification-scenario__warning',
    content: '请在四天内更新访问凭证。',
    direction: props.direction,
    duration: 0,
    position,
    theme: 'light',
    title: '配置即将过期',
  });
});
onBeforeUnmount(() => Notification.destroyAll());
</script>

<template>
  <div class="notification-scenario" data-testid="notification-vue">
    <p>通知卡片渲染在当前 viewport 的固定位置。</p>
  </div>
</template>
