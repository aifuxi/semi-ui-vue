<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse default-active-key="overview">
    <CollapsePanel item-key="overview" header="Overview"> Overview content </CollapsePanel>
    <CollapsePanel item-key="quality" header="Quality gates"> Quality gate content </CollapsePanel>
  </Collapse>
</template>
