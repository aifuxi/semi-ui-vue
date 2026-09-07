<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

function show() {
  Notification.open({
    title: 'Hi, AIFUXI',
    content: 'AIFUXI design notification',
    duration: 3,
  });
}
</script>

<template>
  <Button @click="show">展示通知</Button>
</template>
