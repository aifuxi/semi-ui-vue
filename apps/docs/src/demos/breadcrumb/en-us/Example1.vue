<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
</script>

<template>
  <Breadcrumb aria-label="Documentation path">
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/components">Components</BreadcrumbItem>
    <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
  </Breadcrumb>
</template>
