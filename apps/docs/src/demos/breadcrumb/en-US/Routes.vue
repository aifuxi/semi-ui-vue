<script setup lang="ts">
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { h } from 'vue';
import { IconHome, IconArticle } from '@aifuxi/semi-icons-vue';
const iconRoutes = [
  { path: '/en-us/', href: '/en-us/', icon: h(IconHome, { size: 'small', 'aria-label': 'Home' }) },
  {
    path: '/en-us/components/breadcrumb/',
    href: '/en-us/components/breadcrumb/',
    name: 'breadcrumb',
    icon: h(IconArticle, { size: 'small' }),
  },
  'with icon',
];
const longRoutes = ['Home', 'This page title is long enough to be truncated', 'Details'];
</script>

<template>
  <div>
    <Breadcrumb :routes="['Semi-ui', 'Breadcrumb', 'Default']" /><br />
    <Breadcrumb :routes="iconRoutes" /><br />
    <Breadcrumb :routes="longRoutes" />
  </div>
</template>
