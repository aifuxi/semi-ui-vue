<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div>
    <Progress
      :percent="50"
      stroke-linecap="round"
      type="circle"
      style="margin: 10px"
      aria-label="磁盘使用量"
    />
    <Progress
      :percent="50"
      stroke-linecap="square"
      type="circle"
      style="margin: 10px"
      aria-label="磁盘使用量"
    />
  </div>
</template>
