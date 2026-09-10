<script setup lang="ts">
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutSider,
} from '@aifuxi/semi-ui-vue/layout';
import '@aifuxi/semi-theme-default/layout.css';
const commonStyle = { height: '64px', lineHeight: '64px', background: 'var(--semi-color-fill-0)' };
import type { LayoutBreakpoint } from '@aifuxi/semi-ui-vue/layout';
function onBreakpoint(screen: LayoutBreakpoint, matches: boolean) {
  console.log(screen, matches);
}
</script>

<template>
  <Layout class="components-layout-demo">
    <LayoutHeader :style="commonStyle">Header</LayoutHeader>
    <Layout>
      <LayoutSider
        :style="{ width: '120px', background: 'var(--semi-color-fill-2)' }"
        :breakpoint="['md']"
        @breakpoint="onBreakpoint"
      >
        Sider
      </LayoutSider>
      <LayoutContent :style="{ height: '300px', lineHeight: '300px' }">Content</LayoutContent>
    </Layout>
    <LayoutFooter :style="commonStyle">Footer</LayoutFooter>
  </Layout>
</template>

<style scoped>
.components-layout-demo {
  box-sizing: border-box;
  position: relative;
  text-align: center;
  margin: 60px;
  border-top: 22px solid var(--semi-color-fill-1);
  border-radius: 5px 5px 0 0;
  box-shadow: var(--semi-shadow-elevated);
  color: var(--semi-color-text-1);
}
.components-layout-demo::before {
  content: '';
  position: absolute;
  top: -14px;
  left: 12px;
  display: block;
  width: 6px;
  height: 6px;
  background-color: rgba(var(--semi-red-4), 1);
  border-radius: 50%;
  box-shadow:
    0 0 0 2px rgba(var(--semi-red-4), 1),
    15px 0 0 2px rgba(var(--semi-yellow-4), 1),
    30px 0 0 2px rgba(var(--semi-green-4), 1);
}
.components-layout-demo :deep(.semi-layout-sider-children) {
  display: flex;
  align-items: center;
  margin: 0 36px;
}
</style>
