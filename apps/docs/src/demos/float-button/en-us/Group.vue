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
    content: 'Edit',
    value: 'editor',
  },
  {
    icon: h(IconSearchStroked),
    content: 'Search',
    value: 'search',
  },
  {
    icon: h(IconHelpCircleStroked),
    content: 'Help',
    value: 'help',
  },
];
function click(value: string) {
  console.info('Clicked ', value);
}
</script>
<template>
  <div style="min-height: 340px">
    <span>页面右下方最后一行</span
    ><FloatButtonGroup style="inset-inline-end: 24px; bottom: 50px" :items="items" @click="click" />
  </div>
</template>
