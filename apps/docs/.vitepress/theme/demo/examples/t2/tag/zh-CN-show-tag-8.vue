<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Space } from '@aifuxi/semi-ui-vue/space';
import '@aifuxi/semi-theme-default/space.css';
import IconCode from '@aifuxi/semi-icons-vue/icons/IconCode';
import IconCodeStroked from '@aifuxi/semi-icons-vue/icons/IconCodeStroked';
</script>

<template>
  <Space wrap>
    <Tag color="light-blue" size="large" shape="circle" type="light"
      ><template #prefixIcon><IconCode /></template>Semi Design Light Tag</Tag
    >
    <Tag color="cyan" size="large" shape="circle" type="light"
      >D2C: figma to code in one click<template #suffixIcon><IconCodeStroked /></template
    ></Tag>
    <Tag color="light-blue" size="large" shape="circle" type="ghost"
      ><template #prefixIcon><IconCode /></template>Semi Design Ghost Tag</Tag
    >
    <Tag color="cyan" size="large" shape="circle" type="ghost"
      >D2C: figma to code in one click<template #suffixIcon><IconCodeStroked /></template
    ></Tag>
    <Tag color="light-blue" size="large" shape="circle" type="solid"
      ><template #prefixIcon><IconCode /></template>Semi Design Solid Tag</Tag
    >
    <Tag color="cyan" size="large" shape="circle" type="solid"
      >D2C: figma to code in one click<template #suffixIcon><IconCodeStroked /></template
    ></Tag>
  </Space>
</template>
