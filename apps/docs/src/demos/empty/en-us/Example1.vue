<script setup lang="ts">
import { Empty } from '@aifuxi/semi-ui-vue/empty';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@aifuxi/semi-illustrations-vue';
import '@aifuxi/semi-theme-default/empty.css';
</script>

<template>
  <Empty title="Under construction" description="This feature is not available yet.">
    <template #image>
      <IllustrationConstruction :style="{ width: '150px', height: '150px' }" />
    </template>
    <template #darkModeImage>
      <IllustrationConstructionDark :style="{ width: '150px', height: '150px' }" />
    </template>
  </Empty>
</template>
