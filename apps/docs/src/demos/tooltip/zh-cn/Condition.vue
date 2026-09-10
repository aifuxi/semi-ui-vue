<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import '@aifuxi/semi-theme-default/tooltip.css';
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
    <Tooltip :content="content" trigger="hover" :condition="enabled">
      <Button> Hover me</Button>
    </Tooltip>
    <Tooltip :content="content" trigger="click" :condition="enabled">
      <Button> Click me</Button>
    </Tooltip>
  </Space>
</template>
