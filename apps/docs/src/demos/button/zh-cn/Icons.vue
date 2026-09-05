<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { IconCamera, IconSidebar, IconChevronDown } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <strong>默认状态：</strong
    ><Button aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>禁用状态：</strong
    ><Button disabled aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>复合类型：</strong
    ><Button type="primary" style="margin-right: 8px" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><Button type="secondary" style="margin-right: 8px" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><Button type="warning" style="margin-right: 8px" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><Button type="danger" style="margin-right: 8px" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>更改主题：</strong
    ><Button theme="solid" style="margin-right: 10px" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><Button theme="light" aria-label="截屏"
      ><template #icon><IconCamera /></template></Button
    ><br /><br />
    <strong>更改图标位置：</strong
    ><Button theme="solid" style="margin-right: 10px"
      ><template #icon><IconSidebar /></template>收起</Button
    ><Button theme="solid" icon-position="right"
      ><template #icon><IconChevronDown /></template>展开选项</Button
    ><br /><br />
  </div>
</template>
