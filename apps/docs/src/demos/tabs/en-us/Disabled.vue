<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs default-active-key="1">
    <TabPane tab="Document" item-key="1"> Document </TabPane>
    <TabPane tab="Quick Start" item-key="2" disabled> Quick Start </TabPane>
    <TabPane tab="Help" item-key="3"> Help </TabPane>
  </Tabs>
</template>
