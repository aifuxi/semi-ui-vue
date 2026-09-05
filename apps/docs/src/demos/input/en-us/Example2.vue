<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@aifuxi/semi-ui-vue/input';

const value = ref('semi.design');
import '@aifuxi/semi-theme-default/input.css';
</script>

<template>
  <Input v-model="value" prefix="https://" suffix=".com" show-clear />
</template>
