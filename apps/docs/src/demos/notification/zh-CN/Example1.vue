<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue/notification';

const [notification, NotificationHolder] = Notification.useNotification();

function show() {
  notification.success({ title: '保存成功', content: '设置已经生效。' });
}
import '@aifuxi/semi-theme-default/notification.css';
</script>

<template>
  <NotificationHolder />
  <button type="button" @click="show">保存</button>
</template>
