<script setup lang="ts">
import { LocaleProvider, LocaleConsumer } from '@aifuxi/semi-ui-vue/locale';
import '@aifuxi/semi-theme-default/locale.css';
import en_GB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import zh_CN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import ko_KR from '@aifuxi/semi-ui-vue/locale/source/ko_KR';
const locales = [
  { ...zh_CN, ComponentA: { customKey: 'semi' } },
  { ...ko_KR, ComponentA: { customKey: 'design' } },
  { ...en_GB, ComponentA: { customKey: 'dsm' } },
];
</script>
<template>
  <LocaleProvider v-for="locale in locales" :key="locale.code" :locale="locale">
    <LocaleConsumer v-slot="{ localeData, localeCode }" component-name="TimePicker"
      ><div>{{ localeCode }} : {{ (localeData as { begin: string }).begin }}</div></LocaleConsumer
    >
  </LocaleProvider>
  <LocaleProvider v-for="locale in locales" :key="`custom-${locale.code}`" :locale="locale">
    <LocaleConsumer v-slot="{ localeData }" component-name="ComponentA"
      ><div>{{ (localeData as { customKey: string }).customKey }}</div></LocaleConsumer
    >
  </LocaleProvider>
</template>
