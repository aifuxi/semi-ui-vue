<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
import '@aifuxi/semi-theme-default/progress.css';
</script>

<template>
  <div>
    <Progress :percent="75" show-info type="circle" style="margin: 10px" aria-label="Disk usage"
      ><template #format="{ percent }">{{ percent }}Days</template></Progress
    >
    <Progress :percent="100" show-info type="circle" style="margin: 10px" aria-label="Disk usage"
      ><template #format>Done</template></Progress
    >
    <Progress
      :percent="50"
      type="circle"
      :show-info="false"
      style="margin: 10px"
      aria-label="Disk usage"
    />
  </div>
</template>
