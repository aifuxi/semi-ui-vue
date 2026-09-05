<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs default-active-key="1">
    <TabPane tab="文档" item-key="1"> 文档 </TabPane>
    <TabPane tab="快速起步" item-key="2" disabled> 快速起步 </TabPane>
    <TabPane tab="帮助" item-key="3"> 帮助 </TabPane>
  </Tabs>
</template>
