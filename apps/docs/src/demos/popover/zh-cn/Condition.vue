<script setup lang="ts">
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import '@aifuxi/semi-theme-default/popover.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { computed, shallowRef } from 'vue';
const enabled = shallowRef(true);
const content = computed(() => `condition is ${enabled.value ? 'true' : 'false'}`);
</script>
<template>
  <Space align="center">
    <Text> condition</Text>
    <Switch v-model:checked="enabled" />
    <Popover :content="content" :condition="enabled">
      <Button> Hover me</Button>
    </Popover>
    <Popover :content="content" trigger="click" :condition="enabled">
      <Button> Click me</Button>
    </Popover>
  </Space>
</template>
