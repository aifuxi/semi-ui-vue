<script setup lang="ts">
import { Card, CardMeta } from '@aifuxi/semi-ui-vue/card';
import '@aifuxi/semi-theme-default/card.css';
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
</script>
<template>
  <Card :style="{ maxWidth: '360px' }" :header-line="false">
    <CardMeta
      title="Semi Doc"
      description="Easily manage your project icons and easily upload, update and share a series of project icons." />
    <template #actions><Rating size="small" :default-value="4" /></template
    ><template #cover><img alt="example" src="/demos/poster.svg" /></template
  ></Card>
</template>
