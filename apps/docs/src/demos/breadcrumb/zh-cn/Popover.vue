<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb more-type="popover">
    <BreadcrumbItem>首页</BreadcrumbItem>
    <BreadcrumbItem>当层级很多的时候</BreadcrumbItem>
    <BreadcrumbItem>又一层</BreadcrumbItem>
    <BreadcrumbItem>再一层</BreadcrumbItem>
    <BreadcrumbItem>上上一层</BreadcrumbItem>
    <BreadcrumbItem>上一层</BreadcrumbItem>
    <BreadcrumbItem>详情页</BreadcrumbItem>
  </Breadcrumb>
</template>
