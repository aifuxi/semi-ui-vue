<script setup lang="ts">
import { shallowRef } from 'vue';
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/rating.css';
import '@aifuxi/semi-theme-default/tooltip.css';
const value = shallowRef(0);
const descriptions = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
</script>

<template>
  <div>
    <span
      >How was the help you received: <span v-if="value">{{ descriptions[value - 1] }}</span></span
    ><br /><Rating v-model="value" :tooltips="descriptions" />
  </div>
</template>
