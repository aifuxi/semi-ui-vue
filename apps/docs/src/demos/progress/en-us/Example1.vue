<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div style="width: 240px">
    <Progress :percent="50" aria-label="File download progress" />
    <Progress :percent="80" show-info size="large" aria-label="File download progress" />
  </div>
</template>
