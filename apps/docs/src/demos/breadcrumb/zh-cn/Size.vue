<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { IconHome } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <div>
    <Breadcrumb compact>
      <BreadcrumbItem
        ><template #icon><IconHome size="small" /></template
      ></BreadcrumbItem>
      <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      <BreadcrumbItem>Loose</BreadcrumbItem>
    </Breadcrumb>
    <br />
    <Breadcrumb :compact="false">
      <BreadcrumbItem
        ><template #icon><IconHome size="small" /></template
      ></BreadcrumbItem>
      <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
      <BreadcrumbItem>Loose</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
