<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';

const activeKeys = ref<string[]>(['one']);
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse v-model:active-key="activeKeys" accordion>
    <CollapsePanel item-key="one" header="第一项">内容一</CollapsePanel>
    <CollapsePanel item-key="two" header="第二项">内容二</CollapsePanel>
  </Collapse>
</template>
