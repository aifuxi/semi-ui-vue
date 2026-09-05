<script setup lang="ts">
import { ref } from 'vue';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import '@aifuxi/semi-theme-default/date-picker.css';

const date = ref<Date>();
</script>

<template>
  <DatePicker v-model="date" />
</template>
