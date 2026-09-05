<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs type="button">
    <TabPane tab="Document" item-key="1"> Document </TabPane>
    <TabPane tab="Quick Start" item-key="2"> Quick Start </TabPane>
    <TabPane tab="Help" item-key="3"> Help </TabPane>
  </Tabs>
</template>
