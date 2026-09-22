<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>
<template>
  <Card title="Card title">
    <Card title="Inner Card title" :style="{ marginBottom: '20px' }">
      Inner Card content
      <template #headerExtraContent><Text link> More </Text></template></Card
    >
    <Card title="Inner Card title">
      Inner Card content
      <template #headerExtraContent><Text link> More </Text></template></Card
    >
  </Card>
</template>
