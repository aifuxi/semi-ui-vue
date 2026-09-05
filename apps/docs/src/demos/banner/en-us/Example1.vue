<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
function handleClose() {
  console.log('Banner closed');
}
</script>

<template>
  <Banner description="A new version is available" @close="handleClose" />
</template>
