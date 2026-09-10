<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb>
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Many levels</BreadcrumbItem>
    <BreadcrumbItem>Another level</BreadcrumbItem>
    <BreadcrumbItem>Another level again</BreadcrumbItem>
    <BreadcrumbItem>Here is another one</BreadcrumbItem>
    <BreadcrumbItem>Penultimate</BreadcrumbItem>
    <BreadcrumbItem>Detail</BreadcrumbItem>
  </Breadcrumb>
</template>
