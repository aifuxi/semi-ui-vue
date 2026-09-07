<script setup lang="ts">
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import { Notification, type NotificationPosition } from '@aifuxi/semi-ui-vue/notification';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';

const options = {
  duration: 3,
  content: 'aifuxi-notification',
  title: 'Hi, AIFUXI',
};

function show(position: NotificationPosition) {
  Notification.info({ ...options, position });
}
</script>

<template>
  <ButtonGroup>
    <Button @click="show('top')">top</Button>
    <Button @click="show('topLeft')">topLeft</Button>
    <Button @click="show('topRight')">topRight</Button>
  </ButtonGroup>
  <br />
  <br />
  <ButtonGroup>
    <Button @click="show('bottom')">bottom</Button>
    <Button @click="show('bottomRight')">bottomRight</Button>
    <Button @click="show('bottomLeft')">bottomLeft</Button>
  </ButtonGroup>
</template>
