<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
</script>

<template>
  <div>
    <Rating allow-half :default-value="3.5" /><br /><Rating
      allow-half
      :default-value="3.65"
      disabled
    />
  </div>
</template>
