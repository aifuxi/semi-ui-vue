<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>

<template>
  <div>
    <Pagination :total="30" :style="{ marginBottom: '12px' }"></Pagination>
    <Pagination :total="80" :style="{ marginBottom: '12px' }"></Pagination>
    <Pagination :total="200" :style="{ marginBottom: '12px' }"></Pagination>
    <Pagination :total="80" :page-size="30" :style="{ marginBottom: '12px' }"></Pagination>
  </div>
</template>
