<script setup lang="ts">
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
import { shallowRef } from 'vue';

const value = shallowRef(3.5);
</script>

<template>
  <Rating
    v-model="value"
    allow-half
    :tooltips="['Terrible', 'Bad', 'Normal', 'Good', 'Wonderful']"
  />
</template>
