<script setup lang="ts">
import { shallowRef } from 'vue';
import { InputNumber } from '@aifuxi/semi-ui-vue/input-number';

const value = shallowRef<number | string>(12);
import '@aifuxi/semi-theme-default/input-number.css';
</script>

<template>
  <InputNumber v-model="value" :precision="2" @number-change="console.log" />
</template>
