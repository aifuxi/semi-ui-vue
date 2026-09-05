<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div>
    <Progress
      v-for="percent in [10, 25, 50, 80]"
      :key="percent"
      :percent="percent"
      type="circle"
      size="small"
      style="margin: 5px"
      aria-label="Disk usage"
    />
  </div>
</template>
