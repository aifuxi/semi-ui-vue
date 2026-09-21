<script setup lang="ts">
import { h } from 'vue';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/toast.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';

function show() {
  Toast.info({
    content: h('span', [
      h(Text, null, () => 'Hi, AIFUXI dance dance'),
      h(Text, { link: true, style: { marginLeft: '12px' } }, () => '更多'),
    ]),
    duration: 3,
  });
}

function showMultiline() {
  Toast.info({
    content: [
      h('div', 'Hi, AIFUXI dance dance'),
      h('div', { style: { marginTop: '8px' } }, [
        h(Text, { link: true }, () => '查看详情'),
        h(Text, { link: true, style: { marginLeft: '20px' } }, () => '一会再看'),
      ]),
    ],
    duration: 3,
  });
}
</script>

<template>
  <Button @click="show">Display Toast</Button>
  <br />
  <br />
  <Button @click="showMultiline">Display Multi-line Toast</Button>
</template>
