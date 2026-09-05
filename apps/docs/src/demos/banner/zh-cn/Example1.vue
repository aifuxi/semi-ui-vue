<script setup lang="ts">
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
function handleClose() {
  console.log('Banner closed');
}
</script>

<template>
  <Banner description="新版本已经可用" @close="handleClose" />
</template>
