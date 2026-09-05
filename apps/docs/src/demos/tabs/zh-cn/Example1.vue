<script setup lang="ts">
import { TabPane, Tabs } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs>
    <TabPane item-key="docs" tab="文档">文档内容</TabPane>
    <TabPane item-key="start" tab="快速起步">快速起步内容</TabPane>
    <TabPane item-key="help" tab="帮助">帮助内容</TabPane>
  </Tabs>
</template>
