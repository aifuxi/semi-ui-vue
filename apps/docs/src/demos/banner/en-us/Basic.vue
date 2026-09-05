<script setup lang="ts">
import { shallowRef } from 'vue';
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import { Layout, LayoutHeader, LayoutContent, LayoutFooter } from '@aifuxi/semi-ui-vue/layout';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/banner.css';
import '@aifuxi/semi-theme-default/layout.css';
import '@aifuxi/semi-theme-default/button.css';
const visible = shallowRef(false);
</script>

<template>
  <Layout class="components-layout-demo banner-basic"
    ><LayoutHeader>Header</LayoutHeader
    ><Banner
      v-if="visible"
      description="A pre-released version is available"
      @close="visible = false"
    /><LayoutContent>Content</LayoutContent><LayoutFooter>Footer</LayoutFooter></Layout
  ><Button
    :style="{ display: 'block', width: '120px', margin: '0 auto' }"
    @click="visible = !visible"
    >{{ visible ? 'Hide Banner' : 'Show Banner' }}</Button
  >
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
</style>
