<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div>
      <Pagination :total="30" :style="{ marginBottom: '12px' }"></Pagination>
      <Pagination :total="80" :style="{ marginBottom: '12px' }"></Pagination>
      <Pagination :total="200" :style="{ marginBottom: '12px' }"></Pagination>
      <Pagination :total="80" :page-size="30" :style="{ marginBottom: '12px' }"></Pagination>
    </div>
  </ConfigProvider>
</template>
