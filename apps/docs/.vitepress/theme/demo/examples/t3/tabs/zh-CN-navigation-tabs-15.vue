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
    ><TabPane tab="文档" item-key="1">文档</TabPane
    ><TabPane tab="快速起步" item-key="2">快速起步</TabPane
    ><TabPane tab="帮助" item-key="3">帮助</TabPane></Tabs
  >
</template>
