<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>

<template>
  <div>
    <Pagination :total="80" show-quick-jumper :style="{ marginBottom: '12px' }"></Pagination>
    <Pagination :total="300" show-quick-jumper></Pagination>
  </div>
</template>
