<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Pagination :total="30" disabled :style="{ marginBottom: '12px' }"></Pagination>
  </ConfigProvider>
</template>
