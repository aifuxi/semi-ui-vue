<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>

<template>
  <Space vertical align="start">
    <Tag avatar-src="/demos/photo.svg">Peter Behrens</Tag>
    <Tag avatar-src="/demos/photo.svg" size="large">Peter Behrens</Tag>
    <Tag avatar-src="/demos/photo.svg" size="large" closable>Peter Behrens</Tag>
    <Tag avatar-src="/demos/photo.svg" avatar-shape="circle">Peter Behrens</Tag>
    <Tag avatar-src="/demos/photo.svg" avatar-shape="circle" size="large">Peter Behrens</Tag>
    <Tag avatar-src="/demos/photo.svg" avatar-shape="circle" size="large" closable
      >Peter Behrens</Tag
    >
  </Space>
</template>
