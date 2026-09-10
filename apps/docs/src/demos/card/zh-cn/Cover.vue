<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
</script>
<template>
  <Card :style="{ maxWidth: '300px' }">
    <CardMeta title="卡片封面" />
    <template #cover><img alt="example" src="/demos/poster.svg" /></template
  ></Card>
</template>
