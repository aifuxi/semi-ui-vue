<script setup lang="ts">
import { h } from 'vue';
import { IconBell, IconStar } from '@aifuxi/semi-icons-vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

const options = {
  title: 'Hi, AIFUXI',
  content: 'AIFUXI design notification',
  duration: 3,
};
</script>

<template>
  <h5>Default Icon</h5>
  <Button type="primary" style="margin: 4px" @click="Notification.success(options)">
    Success
  </Button>
  <Button style="margin: 4px" @click="Notification.info(options)">Info</Button>
  <Button type="warning" style="margin: 4px" @click="Notification.warning(options)">
    Warning
  </Button>
  <Button type="danger" style="margin: 4px" @click="Notification.error(options)">Error</Button>
  <h5>Customized Icon</h5>
  <Button
    aria-label="Red bell notification"
    style="margin-right: 5px"
    @click="Notification.info({ ...options, icon: h(IconBell, { style: { color: 'red' } }) })"
  >
    <template #icon><IconBell /></template>
  </Button>
  <Button
    aria-label="Star notification"
    style="margin-right: 5px"
    @click="Notification.info({ ...options, icon: h(IconStar) })"
  >
    <template #icon><IconStar /></template>
  </Button>
  <Button
    aria-label="Pink star notification"
    @click="Notification.info({ ...options, icon: h(IconStar, { style: { color: 'pink' } }) })"
  >
    <template #icon><IconStar /></template>
  </Button>
</template>
