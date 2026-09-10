<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/switch.css';
import { shallowRef } from 'vue';
const loading = shallowRef(true);
</script>
<template>
  <Switch @change="(v: boolean) => (loading = !v)" />
  <br />
  <br />
  <Card :style="{ maxWidth: '360px' }" :loading="loading">
    <CardMeta
      title="Semi Design"
      description="Semi Design is a design system developed and maintained by IES-FE &amp; IES-UED."
    />
  </Card>
</template>
