<script setup lang="ts">
import { Input } from '@aifuxi/semi-ui-vue/input';
import '@aifuxi/semi-theme-default/input.css';
import { shallowRef } from 'vue';
const value = shallowRef('controlInput');
</script>

<template>
  <Input v-model="value" @change="console.log" />
</template>
