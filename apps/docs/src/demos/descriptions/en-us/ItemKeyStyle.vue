<script setup lang="ts">
import { Descriptions } from '@aifuxi/semi-ui-vue/descriptions';
import '@aifuxi/semi-theme-default/descriptions.css';
import { DescriptionsItem } from '@aifuxi/semi-ui-vue/descriptions';
const keyStyle = { width: '120px', color: 'var(--semi-color-primary)' };
</script>

<template>
  <Descriptions align="center">
    <DescriptionsItem item-key="Name" :key-style="keyStyle">Lee</DescriptionsItem>
    <DescriptionsItem item-key="Age" :key-style="keyStyle">28</DescriptionsItem>
    <DescriptionsItem item-key="Occupation" :key-style="keyStyle"
      >Frontend engineer</DescriptionsItem
    >
  </Descriptions>
</template>
