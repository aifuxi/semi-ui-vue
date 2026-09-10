<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div>
      <Pagination :total="80" show-size-changer></Pagination>
      <br />
      <br />
      <Pagination :total="300" show-size-changer></Pagination>
    </div>
  </ConfigProvider>
</template>
