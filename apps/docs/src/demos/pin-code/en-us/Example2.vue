<script setup lang="ts">
import { PinCode } from '@aifuxi/semi-ui-vue/pin-code';
import { shallowRef } from 'vue';

const code = shallowRef('69af41');
import '@aifuxi/semi-theme-default/pin-code.css';
</script>

<template>
  <PinCode v-model="code" format="mixed" />
</template>
