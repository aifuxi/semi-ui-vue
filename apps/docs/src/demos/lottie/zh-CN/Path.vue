<script setup lang="ts">
import { Lottie } from '@aifuxi/semi-ui-vue/lottie';
import '@aifuxi/semi-theme-default/lottie.css';
const params = { path: '/demos/lottie.json' };
</script>

<template>
  <Lottie :params="params" width="300px" height="300px" />
</template>
