<script setup lang="ts">
import HorizontalNavigation from './CombinedRenderHorizontal.vue';
import VerticalNavigation from './CombinedRenderVertical.vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/en_US';
import '@aifuxi/semi-theme-default/navigation.css';
</script>
<template>
  <LocaleProvider :locale="locale">
    <HorizontalNavigation />
    <VerticalNavigation />
  </LocaleProvider>
</template>
