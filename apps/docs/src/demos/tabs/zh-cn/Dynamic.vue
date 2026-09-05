<script setup lang="ts">
import { shallowRef } from 'vue';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import { Button, ButtonGroup } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/tabs.css';
import '@aifuxi/semi-theme-default/button.css';
const panes = shallowRef([
  { title: 'Tab 1', content: 'Content of Tab Pane 1', itemKey: '1' },
  { title: 'Tab 2', content: 'Content of Tab Pane 2', itemKey: '2' },
]);
const activeKey = shallowRef('1');
let newTabIndex = 0;
function add() {
  const index = newTabIndex++;
  panes.value = [
    ...panes.value,
    { title: `New Tab ${index}`, content: 'New Tab Pane', itemKey: `newTab${index}` },
  ];
  activeKey.value = `newTab${index}`;
}
function remove() {
  if (panes.value.length > 1) {
    panes.value = panes.value.slice(0, -1);
    activeKey.value = panes.value[panes.value.length - 1]!.itemKey;
  }
}
</script>

<template>
  <Tabs v-model:active-key="activeKey" default-active-key="1"
    ><template #tabBarExtraContent
      ><ButtonGroup
        ><Button @click="add">新增</Button><Button @click="remove">删除</Button></ButtonGroup
      ></template
    ><TabPane
      v-for="pane in panes"
      :key="pane.itemKey"
      :tab="pane.title"
      :item-key="pane.itemKey"
      >{{ pane.content }}</TabPane
    ></Tabs
  >
</template>
