<script setup lang="ts">
import { Tag, SplitTagGroup } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
</script>

<template>
  <Space vertical align="start">
    <SplitTagGroup
      ><Tag color="blue" type="solid">Tag One</Tag><Tag color="cyan" type="solid">Tag Two</Tag
      ><Tag color="teal" type="solid">Tag Three</Tag></SplitTagGroup
    >
    <SplitTagGroup
      ><Tag color="violet" shape="circle">Grouped</Tag><Tag color="purple" shape="circle">Tags</Tag
      ><Tag color="pink" shape="circle">Example</Tag
      ><Tag color="red" shape="circle">Effect</Tag></SplitTagGroup
    >
    <SplitTagGroup
      ><Tag color="amber" type="light">Light</Tag><Tag color="orange" type="light">Grouped</Tag
      ><Tag color="yellow" type="light">Tags</Tag></SplitTagGroup
    >
    <SplitTagGroup
      ><Tag color="green" type="ghost">Ghost</Tag><Tag color="light-green" type="ghost">Style</Tag
      ><Tag color="lime" type="ghost">Group</Tag></SplitTagGroup
    >
  </Space>
</template>
