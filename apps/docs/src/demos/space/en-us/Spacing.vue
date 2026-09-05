<script setup lang="ts">
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Tabs, TabPane } from '@aifuxi/semi-ui-vue/tabs';
import '@aifuxi/semi-theme-default/tabs.css';
</script>

<template>
  <Tabs type="line">
    <TabPane tab="tight" item-key="1">
      <Space spacing="tight" :style="{ marginTop: '15px' }">
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
      </Space>
    </TabPane>
    <TabPane tab="medium" item-key="2">
      <Space spacing="medium" :style="{ marginTop: '15px' }">
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
      </Space>
    </TabPane>
    <TabPane tab="loose" item-key="3">
      <Space spacing="loose" :style="{ marginTop: '15px' }">
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
      </Space>
    </TabPane>
    <TabPane tab="array" item-key="4">
      <Space :spacing="[8, 16]" wrap :style="{ marginTop: '15px' }">
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
        <Button theme="solid" type="primary">button</Button>
      </Space>
    </TabPane>
  </Tabs>
</template>
