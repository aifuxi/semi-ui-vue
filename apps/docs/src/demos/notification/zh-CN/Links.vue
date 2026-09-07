<script setup lang="ts">
import { h } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/notification.css';
import '@aifuxi/semi-theme-default/typography.css';

function show() {
  Notification.info({
    title: 'This is a title',
    content: h('div', [
      h('div', 'AIFUXI design notification'),
      h('div', { style: { marginTop: '8px' } }, [
        h(Text, { link: true }, () => '查看详情'),
        h(Text, { link: true, style: { marginLeft: '20px' } }, () => '一会再看'),
      ]),
    ]),
    duration: 3,
  });
}
</script>

<template>
  <Button @click="show">展示通知</Button>
</template>
