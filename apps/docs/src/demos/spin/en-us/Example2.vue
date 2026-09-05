<script setup lang="ts">
import { shallowRef } from 'vue';
import { Spin } from '@aifuxi/semi-ui-vue/spin';

const loading = shallowRef(false);
import '@aifuxi/semi-theme-default/spin.css';
</script>

<template>
  <button @click="loading = !loading">Toggle</button>
  <Spin :spinning="loading" :delay="1000">
    <template #indicator><span>↻</span></template>
  </Spin>
</template>
