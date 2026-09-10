<script setup lang="ts">
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import '@aifuxi/semi-theme-default/tag.css';
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { IconArrowRight } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Breadcrumb separator="&gt;"
      ><BreadcrumbItem>Semi-ui</BreadcrumbItem><BreadcrumbItem>Breadcrumb</BreadcrumbItem
      ><BreadcrumbItem>Default</BreadcrumbItem></Breadcrumb
    ><br /><Breadcrumb
      ><template #separator><IconArrowRight size="small" /></template
      ><BreadcrumbItem>Semi-ui</BreadcrumbItem><BreadcrumbItem>Breadcrumb</BreadcrumbItem
      ><BreadcrumbItem>Default</BreadcrumbItem></Breadcrumb
    ><br /><Tag>v&gt;=1.16.0</Tag><br /><Breadcrumb
      ><BreadcrumbItem separator=":">Semi-ui</BreadcrumbItem
      ><BreadcrumbItem>Breadcrumb</BreadcrumbItem
      ><BreadcrumbItem>Default</BreadcrumbItem></Breadcrumb
    >
  </div>
</template>
