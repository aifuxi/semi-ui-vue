<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <div>
      <Pagination :total="300" show-size-changer :page-size-opts="[50, 80, 90, 200]"> </Pagination>
      <br />
      <br />
      <Pagination :total="300" show-size-changer :page-size-opts="[10, 20, 50, 200]"> </Pagination>
    </div>
  </ConfigProvider>
</template>
