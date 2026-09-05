<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
import { shallowRef } from 'vue';

const value = shallowRef(3.5);
</script>

<template>
  <Rating v-model="value" allow-half :tooltips="['很差', '较差', '一般', '满意', '很好']" />
</template>
