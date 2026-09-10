<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>

<template>
  <Pagination :total="30" disabled :style="{ marginBottom: '12px' }"></Pagination>
</template>
