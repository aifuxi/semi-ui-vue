<script setup lang="ts">
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
</script>

<template>
  <Space>
    <Switch :default-checked="true" />
    <Button type="secondary">secondary</Button>
    <Button type="tertiary">tertiary</Button>
    <Button type="warning">warning</Button>
  </Space>
</template>
