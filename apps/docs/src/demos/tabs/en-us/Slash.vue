<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
const activeKey = shallowRef('1');
const tabList = [
  { tab: 'Document', itemKey: '1' },
  { tab: 'Quick Start', itemKey: '2' },
  { tab: 'Help', itemKey: '3' },
];
</script>

<template>
  <Tabs v-model:active-key="activeKey" type="slash" :tab-list="tabList"
    ><div>{{ tabList[Number(activeKey) - 1]?.tab }}</div></Tabs
  >
</template>
