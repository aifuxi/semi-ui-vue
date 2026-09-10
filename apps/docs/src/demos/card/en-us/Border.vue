<script setup lang="ts">
import { Card } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
</script>
<template>
  <div
    :style="{
      display: 'inline-block',
      padding: '20px',
      backgroundColor: 'var(--semi-color-fill-0)',
    }"
  >
    <Card :style="{ maxWidth: '360px' }" :bordered="false" :header-line="true" title="Semi Design">
      Semi Design is a design system developed and maintained by IES-FE & IES-UED. The design system
      includes a design language and a set of reusable front-end components, helping designers and
      developers to more easily create high-quality, consistent user experience, design-compliant
      Web applications.
    </Card>
  </div>
</template>
