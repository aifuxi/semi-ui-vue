<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/card.css';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <Card title="Semi Design" :style="{ maxWidth: '360px' }">
    <template #headerExtraContent><Text link>更多</Text></template>
    Semi Design 帮助设计师与开发者打造高质量、体验一致的 Web 应用。
  </Card>
</template>
