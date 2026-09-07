<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

const options = {
  title: 'Hi, AIFUXI',
  content: 'AIFUXI design notification',
  duration: 3,
  theme: 'light' as const,
};
</script>

<template>
  <Button @click="Notification.info(options)">Info</Button>
  <br />
  <br />
  <Button @click="Notification.success(options)">Success</Button>
  <br />
  <br />
  <Button type="warning" @click="Notification.warning(options)">Warning</Button>
  <br />
  <br />
  <Button type="danger" @click="Notification.error(options)">Error</Button>
</template>
