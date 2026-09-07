<script setup lang="ts">
import { shallowRef } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import {
  Notification,
  type NotificationId,
  type NotificationOptions,
} from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

const options: NotificationOptions = {
  content: '不会自动关闭',
  title: 'Hi',
  duration: 0,
};
const ids = shallowRef<NotificationId[]>([]);

function show() {
  ids.value = [...ids.value, Notification.info(options)];
}

function hide() {
  const [first, ...rest] = ids.value;
  if (first) Notification.close(first);
  ids.value = rest;
}
</script>

<template>
  <Button type="primary" @click="show">展示通知</Button>
  <br />
  <br />
  <Button type="primary" @click="hide">关闭最早的通知</Button>
</template>
