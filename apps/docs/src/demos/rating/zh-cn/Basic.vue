<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
</script>

<template>
  <div><Rating :default-value="5" /><br /><br /><Rating size="small" :default-value="5" /></div>
</template>
