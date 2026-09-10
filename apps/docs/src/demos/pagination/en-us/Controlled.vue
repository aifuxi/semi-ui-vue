<script setup lang="ts">
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { shallowRef } from 'vue';
const page = shallowRef(3);
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Pagination v-model:current-page="page" :total="200" />
  </ConfigProvider>
</template>
