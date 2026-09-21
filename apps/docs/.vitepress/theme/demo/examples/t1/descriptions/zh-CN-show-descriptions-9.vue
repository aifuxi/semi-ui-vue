<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { DescriptionsItem } from '@aifuxi/semi-ui-vue/descriptions';
const keyStyle = { width: '120px', color: 'var(--semi-color-primary)' };
</script>

<template>
  <Descriptions align="center">
    <DescriptionsItem item-key="姓名" :key-style="keyStyle">李四</DescriptionsItem>
    <DescriptionsItem item-key="年龄" :key-style="keyStyle">28</DescriptionsItem>
    <DescriptionsItem item-key="职业" :key-style="keyStyle">前端工程师</DescriptionsItem>
  </Descriptions>
</template>
