<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div>
      <Pagination :total="80" show-quick-jumper :style="{ marginBottom: '12px' }"></Pagination>
      <Pagination :total="300" show-quick-jumper></Pagination>
    </div>
  </ConfigProvider>
</template>
