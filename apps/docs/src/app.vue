<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '#imports';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import zhCN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { useDocsPreferences } from './composables/useDocsPreferences';

const { locale } = useDocsPreferences();
const componentLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
useHead(() => ({ htmlAttrs: { lang: locale.value } }));
</script>

<template>
  <LocaleProvider :locale="componentLocale">
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </LocaleProvider>
</template>
