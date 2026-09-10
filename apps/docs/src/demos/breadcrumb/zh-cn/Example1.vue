<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb aria-label="文档路径">
    <BreadcrumbItem href="/">首页</BreadcrumbItem>
    <BreadcrumbItem href="/components">组件</BreadcrumbItem>
    <BreadcrumbItem>面包屑</BreadcrumbItem>
  </Breadcrumb>
</template>
