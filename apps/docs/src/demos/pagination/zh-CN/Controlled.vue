<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { shallowRef } from 'vue';
const page = shallowRef(3);
</script>

<template>
  <Pagination v-model:current-page="page" :total="200" />
</template>
