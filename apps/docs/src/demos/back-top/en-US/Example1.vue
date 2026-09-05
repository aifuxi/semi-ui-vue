<script setup lang="ts">
import { BackTop } from '@aifuxi/semi-ui-vue/back-top';
import '@aifuxi/semi-theme-default/back-top.css';
</script>

<template>
  <main>
    <p>Scroll down to reveal the bottom-right button.</p>
    <BackTop @click="console.log('Back to top')" />
  </main>
</template>
