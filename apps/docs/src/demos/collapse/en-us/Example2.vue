<script setup lang="ts">
import { ref } from 'vue';
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';

const activeKeys = ref<string[]>(['one']);
import '@aifuxi/semi-theme-default/collapse.css';
</script>

<template>
  <Collapse v-model:active-key="activeKeys" accordion>
    <CollapsePanel item-key="one" header="First">First content</CollapsePanel>
    <CollapsePanel item-key="two" header="Second">Second content</CollapsePanel>
  </Collapse>
</template>
