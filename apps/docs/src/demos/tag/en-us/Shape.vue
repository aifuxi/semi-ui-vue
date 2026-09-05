<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>

<template>
  <Space>
    <Tag size="small" shape="circle" color="amber"> small circle tag </Tag>
    <Tag size="large" shape="circle" color="violet"> large circle tag </Tag>
  </Space>
</template>
