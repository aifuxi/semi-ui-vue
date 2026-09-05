<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
const activeKey = shallowRef('1');
const tabList = [
  { tab: '文档', itemKey: '1' },
  { tab: '快速起步', itemKey: '2' },
  { tab: '帮助', itemKey: '3' },
];
</script>

<template>
  <Tabs v-model:active-key="activeKey" type="slash" :tab-list="tabList"
    ><div>{{ tabList[Number(activeKey) - 1]?.tab }}</div></Tabs
  >
</template>
