<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import '@aifuxi/semi-theme-default/empty.css';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@aifuxi/semi-illustrations-vue';
</script>

<template>
  <Empty title="功能建设中" description="当前功能暂未开放，敬请期待。">
    <template #image><IllustrationConstruction style="width: 150px; height: 150px" /></template>
    <template #darkModeImage
      ><IllustrationConstructionDark style="width: 150px; height: 150px"
    /></template>
  </Empty>
</template>
