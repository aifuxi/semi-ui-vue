<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
const formatPerMille = (percent: number) => `${percent * 10}‰`;
</script>

<template>
  <div style="width: 200px">
    <Progress
      :percent="10"
      stroke="var(--semi-color-warning)"
      show-info
      aria-label="Disk usage"
    /><br />
    <Progress
      :percent="25"
      stroke="var(--semi-color-danger)"
      show-info
      aria-label="Disk usage"
    /><br />
    <Progress :percent="50" show-info aria-label="Disk usage" /><br />
    <Progress :percent="50" show-info :format="formatPerMille" aria-label="Disk usage" />
  </div>
</template>
