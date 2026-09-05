<script setup lang="ts">
import { Radio } from '@aifuxi/semi-ui-vue/radio';
import { shallowRef } from 'vue';

const checked = shallowRef(true);
import '@aifuxi/semi-theme-default/radio.css';
</script>

<template>
  <Radio v-model="checked" mode="advanced">Click again to clear</Radio>
</template>
