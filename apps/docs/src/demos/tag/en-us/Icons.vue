<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import IconCode from '@aifuxi/semi-icons-vue/icons/IconCode';
import IconCodeStroked from '@aifuxi/semi-icons-vue/icons/IconCodeStroked';
</script>

<template>
  <Space>
    <Tag color="light-blue" size="large" shape="circle"
      ><template #prefixIcon><IconCode /></template>Semi Design</Tag
    >
    <Tag color="cyan" size="large" shape="circle"
      >D2C: figma to code in one click<template #suffixIcon><IconCodeStroked /></template
    ></Tag>
  </Space>
</template>
