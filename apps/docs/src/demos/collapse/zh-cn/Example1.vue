<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse default-active-key="overview">
    <CollapsePanel item-key="overview" header="概览"> 概览内容 </CollapsePanel>
    <CollapsePanel item-key="quality" header="质量门禁"> 质量门禁内容 </CollapsePanel>
  </Collapse>
</template>
