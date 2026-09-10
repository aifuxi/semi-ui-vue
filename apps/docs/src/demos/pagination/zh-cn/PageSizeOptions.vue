<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
</script>

<template>
  <div>
    <Pagination
      :total="300"
      show-size-changer
      :style="{ marginBottom: '12px' }"
      :page-size-opts="[50, 80, 90, 200]"
    >
    </Pagination>
    <Pagination :total="300" show-size-changer :page-size-opts="[10, 20, 50, 200]"> </Pagination>
  </div>
</template>
