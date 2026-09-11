<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

function show() {
  Notification.info({ content: 'AIFUXI design notification', duration: 10 });
}
</script>

<template>
  <Button @click="show">Close After 10s</Button>
</template>
