<script setup lang="ts">
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { h } from 'vue';
import { IconHome, IconArticle } from '@aifuxi/semi-icons-vue';
const iconRoutes = [
  { path: '/zh-cn/', href: '/zh-cn/', icon: h(IconHome, { size: 'small', 'aria-label': '首页' }) },
  {
    path: '/zh-cn/components/breadcrumb/',
    href: '/zh-cn/components/breadcrumb/',
    name: 'breadcrumb',
    icon: h(IconArticle, { size: 'small' }),
  },
  'with icon',
];
const longRoutes = ['首页', '当这个页面标题很长时需要省略', '详情页'];
</script>

<template>
  <div>
    <Breadcrumb :routes="['Semi-ui', 'Breadcrumb', 'Default']" /><br />
    <Breadcrumb :routes="iconRoutes" /><br />
    <Breadcrumb :routes="longRoutes" />
  </div>
</template>
