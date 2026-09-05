<script setup lang="ts">
import { Notification } from '@aifuxi/semi-ui-vue/notification';

const [notification, NotificationHolder] = Notification.useNotification();
const show = () => notification.success({ title: 'Saved', content: 'Settings are active.' });
import '@aifuxi/semi-theme-default/notification.css';
</script>

<template>
  <NotificationHolder />
  <button type="button" @click="show">Save</button>
</template>
