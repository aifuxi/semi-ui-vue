<script setup lang="ts">
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
const routes = ['Home', 'The is a very very very very long title', 'Detail'];
</script>

<template>
  <Text size="small">Default</Text>
  <Breadcrumb :routes="routes" />
  <br />
  <Text size="small">No tooltip</Text>
  <Breadcrumb :show-tooltip="false" :routes="routes" />
  <br />
  <Text size="small">No truncation</Text>
  <Breadcrumb :show-tooltip="{ width: 'auto' }" :routes="routes" />
  <br />
  <Text size="small">Ellipsis from middle of text</Text>
  <Breadcrumb :show-tooltip="{ ellipsisPos: 'middle' }" :routes="routes" />
  <br />
  <Text size="small">Customize tooltip</Text>
  <Breadcrumb :show-tooltip="{ opts: { position: 'topLeft' } }" :routes="routes" />
</template>
