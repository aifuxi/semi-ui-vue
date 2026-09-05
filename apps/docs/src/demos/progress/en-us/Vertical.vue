<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div style="height: 100px; display: flex">
    <Progress
      v-for="percent in [10, 25, 50]"
      :key="percent"
      :percent="percent"
      direction="vertical"
      aria-label="Disk usage"
    />
    <Progress :percent="80" direction="vertical" size="large" aria-label="Disk usage" />
    <Progress :percent="80" direction="vertical" style="width: 8px" aria-label="Disk usage" />
  </div>
</template>
