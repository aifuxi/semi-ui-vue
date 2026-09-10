<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';
</script>

<template>
  <main>
    <p>向下滚动页面查看右下角按钮。</p>
    <BackTop @click="console.log('返回顶部')" />
  </main>
</template>
