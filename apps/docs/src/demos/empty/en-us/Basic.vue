<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import IllustrationConstruction from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationConstruction';
import IllustrationConstructionDark from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationConstructionDark';
</script>

<template>
  <Empty
    title="Function under construction"
    description="The current function is not yet open, so stay tuned."
  >
    <template #image><IllustrationConstruction style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationConstructionDark style="width: 150px; height: 150px"
    /></template>
  </Empty>
</template>
