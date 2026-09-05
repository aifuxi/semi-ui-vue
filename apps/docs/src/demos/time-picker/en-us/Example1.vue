<script setup lang="ts">
import { ref } from 'vue';
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import '@aifuxi/semi-theme-default/time-picker.css';

const value = ref<Date>();
</script>

<template>
  <TimePicker v-model="value" placeholder="Select time" />
</template>
