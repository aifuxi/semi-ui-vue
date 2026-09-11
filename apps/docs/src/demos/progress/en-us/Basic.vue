<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div style="width: 200px">
    <Progress :percent="10" stroke="var(--semi-color-warning)" aria-label="Disk usage" /><br />
    <Progress :percent="25" stroke="var(--semi-color-danger)" aria-label="Disk usage" /><br />
    <Progress :percent="50" aria-label="Disk usage" /><br />
    <Progress :percent="80" aria-label="Disk usage" /><br />
    <Progress :percent="80" size="large" aria-label="Disk usage" /><br />
    <Progress :percent="80" style="height: 8px" aria-label="Disk usage" />
  </div>
</template>
