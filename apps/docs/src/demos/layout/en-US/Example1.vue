<script setup lang="ts">
import {
  Layout,
  LayoutSider,
  LayoutContent,
  type LayoutBreakpoint,
} from '@aifuxi/semi-ui-vue/layout';

function handleBreakpoint(screen: LayoutBreakpoint, match: boolean) {
  console.log(screen, match);
}
import '@aifuxi/semi-theme-default/layout.css';
</script>

<template>
  <Layout>
    <LayoutSider :breakpoint="['xs', 'md']" @breakpoint="handleBreakpoint"> Sider </LayoutSider>
    <LayoutContent>Content</LayoutContent>
  </Layout>
</template>
