<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div style="width: 200px">
    <Progress :percent="10" stroke="var(--semi-color-warning)" aria-label="磁盘使用量" /><br />
    <Progress :percent="25" stroke="var(--semi-color-danger)" aria-label="磁盘使用量" /><br />
    <Progress :percent="50" aria-label="磁盘使用量" /><br />
    <Progress :percent="80" aria-label="下载进度" /><br />
    <Progress :percent="80" size="large" aria-label="磁盘使用量" /><br />
    <Progress :percent="80" style="height: 8px" aria-label="磁盘使用量" />
  </div>
</template>
