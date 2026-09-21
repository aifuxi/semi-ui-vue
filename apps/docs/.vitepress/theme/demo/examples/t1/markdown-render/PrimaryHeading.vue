<script setup lang="ts">
import { Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
</script>
<template>
  <Title :heading="1" style="color: var(--semi-color-primary)"><slot /></Title>
</template>
