<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/card.css';
import '@aifuxi/semi-theme-default/typography.css';
</script>

<template>
  <Card title="Semi Design" :style="{ maxWidth: '360px' }">
    <template #headerExtraContent><Text link>More</Text></template>
    Semi Design helps teams build consistent, high-quality web applications.
  </Card>
</template>
