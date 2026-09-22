<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
const routes = ['首页', '当这个页面标题很长很长很长时需要省略', '详情页'];
</script>

<template>
  <Text size="small">默认行为</Text>
  <Breadcrumb :routes="routes" />
  <br />
  <Text size="small">省略但不显示Tooltip</Text>
  <Breadcrumb :show-tooltip="false" :routes="routes" />
  <br />
  <Text size="small">不截断</Text>
  <Breadcrumb :show-tooltip="{ width: 'auto' }" :routes="routes" />
  <br />
  <Text size="small">从标题中间开始省略</Text>
  <Breadcrumb :show-tooltip="{ ellipsisPos: 'middle' }" :routes="routes" />
  <br />
  <Text size="small">自定义 Tooltip 参数</Text>
  <Breadcrumb :show-tooltip="{ opts: { position: 'topLeft' } }" :routes="routes" />
</template>
