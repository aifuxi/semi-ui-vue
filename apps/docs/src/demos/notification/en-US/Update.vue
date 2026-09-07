<script setup lang="ts">
import { onBeforeUnmount } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

const timers = new Set<ReturnType<typeof setTimeout>>();

function show() {
  const id = Notification.open({
    title: 'Hi, AIFUXI',
    content: 'AIFUXI design notification',
    duration: 3,
  });
  const timer = setTimeout(() => {
    timers.delete(timer);
    Notification.open({ title: 'Hi, AIFUXI', content: 'updated', duration: 10, id });
  }, 1000);
  timers.add(timer);
}

onBeforeUnmount(() => {
  for (const timer of timers) clearTimeout(timer);
});
</script>

<template>
  <Button @click="show">Display Notification</Button>
</template>
