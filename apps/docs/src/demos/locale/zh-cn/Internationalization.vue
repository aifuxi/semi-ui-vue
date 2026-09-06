<script setup lang="ts">
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import '@aifuxi/semi-theme-default/locale.css';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import '@aifuxi/semi-theme-default/pagination.css';
import en_GB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import ja_JP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';
</script>
<template>
  <LocaleProvider :locale="en_GB"
    ><Pagination :total="100" show-total show-size-changer :style="{ margin: '20px' }"
  /></LocaleProvider>
  <LocaleProvider :locale="ja_JP"
    ><Pagination :total="100" show-total show-size-changer :style="{ margin: '20px' }"
  /></LocaleProvider>
</template>
