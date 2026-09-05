<script setup lang="ts">
import { shallowRef } from 'vue';
import { Transfer } from '@aifuxi/semi-ui-vue/transfer';

const selected = shallowRef<Array<string | number>>(['design']);
const data = [
  { key: 1, label: 'Design', value: 'design' },
  { key: 2, label: 'Engineering', value: 'engineering' },
  { key: 3, label: 'Finance', value: 'finance', disabled: true },
];
import '@aifuxi/semi-theme-default/transfer.css';
</script>

<template><Transfer v-model="selected" :data-source="data" /></template>
