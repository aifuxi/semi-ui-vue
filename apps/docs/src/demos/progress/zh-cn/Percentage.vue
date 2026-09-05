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
      aria-label="磁盘使用量"
    /><br />
    <Progress
      :percent="25"
      stroke="var(--semi-color-danger)"
      show-info
      aria-label="磁盘使用量"
    /><br />
    <Progress :percent="50" show-info aria-label="磁盘使用量" /><br />
    <Progress :percent="50" show-info :format="formatPerMille" aria-label="磁盘使用量" />
  </div>
</template>
