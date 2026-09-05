<script setup lang="ts">
import { h } from 'vue';
import { FloatButtonGroup } from '@aifuxi/semi-ui-vue/float-button';
import IconAIStrokedLevel3 from '@aifuxi/semi-icons-vue/icons/IconAIStrokedLevel3';
import IconSearchStroked from '@aifuxi/semi-icons-vue/icons/IconSearchStroked';
import IconHelpCircleStroked from '@aifuxi/semi-icons-vue/icons/IconHelpCircleStroked';
import '@aifuxi/semi-theme-default/float-button.css';
const items = [
  {
    icon: h(IconAIStrokedLevel3),
    content: '编辑',
    value: 'editor',
  },
  {
    icon: h(IconSearchStroked),
    content: '搜索',
    value: 'search',
  },
  {
    icon: h(IconHelpCircleStroked),
    content: '帮助',
    value: 'help',
  },
];
function click(value: string) {
  console.info('点击了 ', value);
}
</script>
<template>
  <div style="min-height: 340px">
    <span>The last row at the bottom right of the page</span
    ><FloatButtonGroup style="inset-inline-end: 24px; bottom: 50px" :items="items" @click="click" />
  </div>
</template>
