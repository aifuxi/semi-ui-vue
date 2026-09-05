<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Text } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>
<template>
  <Card title="Semi Design" :style="{ maxWidth: '360px' }">
    Semi Design is a design system developed and maintained by IES-FE & IES-UED. The design system
    includes a design language and a set of reusable front-end components, helping designers and
    developers to more easily create high-quality, consistent user experience, design-compliant Web
    applications.
    <template #headerExtraContent><Text link> More </Text></template></Card
  >
</template>
