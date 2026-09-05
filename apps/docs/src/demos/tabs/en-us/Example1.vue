<script setup lang="ts">
import { TabPane, Tabs } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs>
    <TabPane item-key="docs" tab="Docs">Docs content</TabPane>
    <TabPane item-key="start" tab="Quick Start">Quick Start content</TabPane>
    <TabPane item-key="help" tab="Help">Help content</TabPane>
  </Tabs>
</template>
