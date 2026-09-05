<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div>
    <div>
      <Progress
        :percent="100"
        type="circle"
        :width="100"
        style="margin: 5px"
        aria-label="Disk usage"
      />
    </div>
    <div>
      <Progress
        :percent="100"
        type="circle"
        :width="100"
        stroke="var(--semi-color-danger)"
        style="margin: 5px"
        aria-label="Disk usage"
      />
    </div>
  </div>
</template>
