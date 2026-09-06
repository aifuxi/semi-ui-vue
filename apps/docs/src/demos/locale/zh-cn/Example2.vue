<script setup lang="ts">
import { computed, ref } from 'vue';
import { LocaleConsumer, LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import jaJP from '@aifuxi/semi-ui-vue/locale/source/ja_JP';

const japanese = ref(false);
const locale = computed(() => (japanese.value ? jaJP : enGB));
import '@aifuxi/semi-theme-default/locale.css';
</script>

<template>
  <LocaleProvider :locale="locale">
    <LocaleConsumer v-slot="slotProps" component-name="Pagination">
      <span>{{ (slotProps.localeData as { jumpTo: string }).jumpTo }}</span>
    </LocaleConsumer>
    <button type="button" @click="japanese = !japanese">切换语言</button>
  </LocaleProvider>
</template>
