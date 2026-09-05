<script setup lang="ts">
import { shallowRef } from 'vue';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';

const page = shallowRef(1);
import '@aifuxi/semi-theme-default/pagination.css';
</script>

<template>
  <Pagination v-model="page" :total="200" show-total />
</template>
