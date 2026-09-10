<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>
<template>
  <Card title="Card title">
    <Tabs
      type="line"
      :style="{
        marginTop: '-20px',
        marginBottom: '-20px',
      }"
    >
      <TabPane tab="Tab 1" item-key="1">
        <p>content1</p>
        <p>content1</p>
        <p>content1</p>
      </TabPane>
      <TabPane tab="Tab 2" item-key="2">
        <p>content2</p>
        <p>content2</p>
        <p>content2</p>
      </TabPane>
    </Tabs>
  </Card>
</template>
