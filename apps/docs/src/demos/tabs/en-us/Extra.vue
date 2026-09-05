<script setup lang="ts">
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/button.css';
function showAlert() {
  window.alert('you have clicked me!');
}
</script>

<template>
  <Tabs default-active-key="1"
    ><template #tabBarExtraContent><Button @click="showAlert">Extra Action</Button></template
    ><TabPane tab="Document" item-key="1">Document</TabPane
    ><TabPane tab="Quick Start" item-key="2">Quick Start</TabPane
    ><TabPane tab="Help" item-key="3">Help</TabPane></Tabs
  >
</template>
