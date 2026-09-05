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
      aria-label="Disk usage"
    />
    <Progress
      :percent="50"
      stroke-linecap="square"
      type="circle"
      style="margin: 10px"
      aria-label="Disk usage"
    />
  </div>
</template>
