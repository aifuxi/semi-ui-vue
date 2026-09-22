<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
const tabList = shallowRef([
  { tab: '文档', itemKey: '1', closable: true },
  { tab: '快速起步', itemKey: '2', closable: true },
  { tab: '帮助', itemKey: '3', closable: false },
]);
function close(key: string) {
  tabList.value = tabList.value.filter((tab) => tab.itemKey !== key);
}
</script>

<template>
  <Tabs type="card" default-active-key="1" @tab-close="close"
    ><TabPane
      v-for="tab in tabList"
      :key="tab.itemKey"
      :closable="tab.closable"
      :tab="tab.tab"
      :item-key="tab.itemKey"
      >{{ tab.tab }}</TabPane
    ></Tabs
  >
</template>
