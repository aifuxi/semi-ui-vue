<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { IconArticle, IconHome } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem
      ><template #icon><IconHome /></template
    ></BreadcrumbItem>
    <BreadcrumbItem
      ><template #icon><IconArticle /></template>Breadcrumb</BreadcrumbItem
    >
    <BreadcrumbItem>With Icon</BreadcrumbItem>
  </Breadcrumb>
</template>
