<script setup lang="ts">
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import '@aifuxi/semi-theme-default/locale.css';
</script>

<template>
  <LocaleProvider :locale="enGB">
    <LocaleConsumer v-slot="{ localeData, localeCode }" component-name="TimePicker">
      <p>{{ localeCode }}: {{ (localeData as { begin: string }).begin }}</p>
    </LocaleConsumer>
  </LocaleProvider>
</template>
